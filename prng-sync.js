import {getRandomBytesAsync} from 'expo-random';
let crypto = null;

let syncPrngSeed = null;
let isSyncPrngRequestingAsyncBytes = false;

function reseed(newSeed) {
  if (!(newSeed instanceof Buffer)) {
    throw new Error("Buffer required");
  }
  if (newSeed.length !== 32) {
    throw new Error("Invalid seed length");
  }
  syncPrngSeed = newSeed;
}

function getBlocks(count) {
  const blocks = [];
  for(let i = 0; i <= count; i++) {
    const indexBuf = Buffer.alloc(8);
    indexBuf.writeInt32LE(i);
    const hash = crypto.createHash('sha256');
    hash.update(syncPrngSeed);
    hash.update(indexBuf);

    blocks.push(hash.digest());
  }
  reseed(blocks[blocks.length - 1]);
  blocks.splice(blocks.length - 1, 1);
  return blocks;
}

function getRandomBytesSync(length) {
  const blocks = getBlocks(Math.ceil(length / 32));
  result = Buffer.concat(blocks).slice(0, length);
  if (!isSyncPrngRequestingAsyncBytes) {
    isSyncPrngRequestingAsyncBytes = true;
    getRandomBytesAsync(32).then((ui8a) => {
      isSyncPrngRequestingAsyncBytes = false;
      reseed(Buffer.alloc(32, ui8a));
    });
  }
  return result;
}

//if (!global.crypto) {
//  global.crypto = {};
//}

isSyncPrngRequestingAsyncBytes = true;
// Pausing to attach debugger
const startAt = Date.now();
// console.log('Starting timer');
// while(Date.now() - 15000 < startAt);
// console.log('Ending timer');
global.crypto.getRandomValues = () => {
  throw new Error('Crypto.getRandomValues called too early. We have no good random data yet. This usually happens when you import crypto library without waiting for prng-sync to finish initializing. Do things like this: import prngSync from "./prng-sync.js"; prngSync.then(() => { web3 = require("./wallet/web3.js").. do anything with web3');
};
export default getRandomBytesAsync(32)
// Pausing to attach debugger
// .then(() => new Promise((resolve) => {setTimeout(resolve, 15000);}))
.then((ui8a) => {
  isSyncPrngRequestingAsyncBytes = false;
  reseed(Buffer.alloc(32, ui8a));

  global.crypto.getRandomValues = (typedArray) => {
    const dv = new DataView(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const randomBytes = getRandomBytesSync(dv.byteLength);
    for(let i = 0; i < randomBytes.length; i++) {
       dv.setUint8(i, randomBytes[i]);
    }
    randomBytes.fill(0);
  };
  crypto = require("crypto");
});
