import { AsyncStorage } from 'react-native';


async function makeProxy() {
  const keys = await AsyncStorage.getAllKeys();
  const pairs = await Promise.all(keys.map(
    key => AsyncStorage.getItem(key).then(value => [key, value])
  ));
  console.log("Loaded localStorage", keys)
  // const inMemoryStorage = Object.fromEntries(pairs);
  const inMemoryStorage = {};
  for(let pair of pairs) {
    const [key, value] = pair;
    inMemoryStorage[key] = value;
  }
  function setItem(key, value) {
    console.log("setItem", key);
    AsyncStorage.setItem(key, value);
    inMemoryStorage[key] = value;
  }
  const prototype = {
    getItem: (key) => console.log("getItem proto", key) || inMemoryStorage[key],
    setItem
  };

  const proxy = new Proxy(inMemoryStorage, {
    get: (target, key) => prototype[key] || console.log("getItem", key) || target[key],
    set: (target, key, value) => setItem(key, value)
  });
  global.localStorage = proxy;
  return proxy;
}

export default makeProxy();
