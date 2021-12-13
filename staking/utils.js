import { ManyKeysMap } from "./many-keys-map.js"

const cacheMap = new ManyKeysMap();

export async function invalidateCache() {
  cacheMap.clear();
}

export async function cachedCallWithRetries(network, params, call) {
  var params$ = params;
  if (network && params$ && params$.unshift){
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

export async function callWithRetries(call, params, maxTries = Infinity) {
  let tries = 0;
  let timeout = null;
  while(true) {
    try {
      return await call();
    } catch(e) {
      console.error(e, params && params.map(o => o.toString()).join());
      tries++;
      if (tries >= maxTries) throw e;
      console.log("[callWithRetries] try # ", tries, ' of ', maxTries);
	    await new Promise(resolve => timeout = setTimeout(resolve, 1000*tries));
    }
  }
}
