import { AsyncStorage } from 'react-native';


async function makeProxy() {
  const keys = await AsyncStorage.getAllKeys();
  const pairs = await Promise.all(keys.map(
    key => AsyncStorage.getItem(key).then(value => [key, value])
  ));
  // const inMemoryStorage = Object.fromEntries(pairs); - not implemented in rn
  const inMemoryStorage = {};
  for(let pair of pairs) {
    const [key, value] = pair;
    inMemoryStorage[key] = value;
  }
  function setItem(key, value) {
    AsyncStorage.setItem(key, value);
    inMemoryStorage[key] = value;
  }
  function clear() {
    return AsyncStorage.clear();
  }
  const prototype = {
    getItem: (key) => inMemoryStorage[key],
    setItem,
    clear
  };

  const proxy = new Proxy(inMemoryStorage, {
    get: (target, key) => prototype[key] || target[key],
    set: (target, key, value) => setItem(key, value)
  });
  global.localStorage = proxy;
  return proxy;
}

export default makeProxy();
