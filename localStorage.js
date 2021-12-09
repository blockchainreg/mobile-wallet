import AsyncStorage from '@react-native-async-storage/async-storage';

async function makeProxy() {
  const keys = await AsyncStorage.getAllKeys();
  const pairs = await Promise.all(
    keys.map((key) => AsyncStorage.getItem(key).then((value) => [key, value]))
  );
  // const inMemoryStorage = Object.fromEntries(pairs); - not implemented in rn
  const inMemoryStorage = {};
  for (let pair of pairs) {
    const [key, value] = pair;
    inMemoryStorage[key] = value;
  }
  function setItem(key, value) {
    // console.log('setItem', key, value);
    inMemoryStorage[key] = value;
    AsyncStorage.setItem(key, value);
  }
  function clear() {
    // console.log('Clear');
    for (let key in inMemoryStorage) {
      delete inMemoryStorage[key];
    }
    return AsyncStorage.clear();
  }
  function removeItem(key) {
    // console.log('removeItem', key);
    delete inMemoryStorage[key];
    AsyncStorage.removeItem(key);
  }
  function getItem(key) {
    if (prototype[key]) {
      return prototype[key];
    }
    // console.log('getItem', key, inMemoryStorage[key]);
    return inMemoryStorage[key];
  }
  const prototype = {
    getItem: (key) => inMemoryStorage[key],
    setItem,
    clear,
    removeItem,
  };

  const proxy = new Proxy(inMemoryStorage, {
    get: (target, key) => getItem(key),
    set: (target, key, value) => setItem(key, value),
  });
  global.localStorage = proxy;
  return proxy;
}

export default makeProxy();
