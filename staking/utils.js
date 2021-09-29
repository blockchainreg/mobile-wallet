import { ManyKeysMap } from "./many-keys-map.js"

const cacheMap = new ManyKeysMap();

export async function invalidateCache() {
  cacheMap.clear();
}

export async function cachedCallWithRetries(network, params, call) {
  var params$ = params;
  if (network){
		params$.unshift(network);
  }
  if (!cacheMap.has(params$)) {
  	const res = callWithRetries(call, params);
		cacheMap.set(params,  callWithRetries(call, params));
		return res;		
  } else {
	  return cacheMap.get(params$);	
  }
}

export async function callWithRetries(call, params) {
  let tries = 0;
  let timeout = null;
  while(true) {
  	// if (tries >= 5) {
  	// 	clearTimeout(timeout);
		// 	return new Promise(resolve => resolve(null));
		// }
    try {
      return await call();
    } catch(e) {
      console.error(e, params && params.map(o => o.toString()).join());
      tries++;
      console.log("[callWithRetries] try # ", tries);
	  await new Promise(resolve => timeout = setTimeout(resolve, 1000*tries));
    }
  }
}
