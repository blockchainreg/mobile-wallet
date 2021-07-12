import { ManyKeysMap } from "./many-keys-map.js"

const cacheMap = new ManyKeysMap();

export async function invalidateCache() {
  cacheMap.clear();
}

export async function cachedCallWithRetries(params, call) {
  if (!cacheMap.has(params)) {
    cacheMap.set(params, callWithRetries(call, params));
  }
  return await cacheMap.get(params);
}

export async function callWithRetries(call, params) {
  let tries = 0;
  while(true) {
    try {
      return await call();
    } catch(e) {
      console.error(e, params && params.map(o => o.toString()).join());
      tries++;
      await new Promise(resolve => setTimeout(resolve, 1000*tries));
    }
  }
}
