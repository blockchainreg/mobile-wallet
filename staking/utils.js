import { ManyKeysMap } from "./many-keys-map.js"

const cacheMap = new ManyKeysMap();

export async function cachedCallWithRetries(params, call) {
  if (!cacheMap.has(params)) {
    cacheMap.set(params, callWithRetries(call, params));
  }
  return await cacheMap.get(params);
}

export async function callWithRetries(call, params) {
  let tries = 0;
  while(true) {
    console.log('Calling', params && params.map(o => o.toString()).join());
    const startAt = Date.now();
    try {
      return await call();
    } catch(e) {
      console.error(e, params && params.map(o => o.toString()).join());
      tries++;
      await new Promise(resolve => setTimeout(resolve, 1000*tries));
    } finally {
      const ms = Date.now() - startAt;
      console.log('Call completed', ms, params && params.map(o => o.toString()).join());
    }
  }
}
