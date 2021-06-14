import { ManyKeysMap } from "./many-keys-map.js"

const cacheMap = new ManyKeysMap();

export async function cachedCallWithRetries(params, call) {
  if (!cacheMap.has(params)) {
    cacheMap.set(params, callWithRetries(call));
  }
  return await cacheMap.get(params);
}

export async function callWithRetries(call) {
  let tries = 0;
  while(true) {
    try {
      return await call();
    } catch(e) {
      console.error(e);
      tries++;
      await new Promise(resolve => setTimeout(resolve, 1000*tries));
    }
  }
}
