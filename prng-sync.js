import crypto from "crypto";
import {getRandomBytesAsync} from 'expo-random';

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

export default getRandomBytesAsync(32).then((ui8a) => {
  isSyncPrngRequestingAsyncBytes = false;
  reseed(Buffer.alloc(32, ui8a));

  global.crypto.getRandomValues = (typedArray) => {
    //if (typedArray instanceof Uint8Array) {
    //  const randomBytes = getRandomBytesSync(typedArray.length);
    //  // Requires buffer as a parameter
    //  // randomBytes.copy(typedArray);
    //  for(let i = 0; i < typedArray.length; i++) {
    //    typedArray[i] = randomBytes[i];
    //  }
    //  randomBytes.fill(0);
    //  return;
    //}
    //throw new Error("Only Uint8Array is supported");

    const dv = new DataView(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const randomBytes = getRandomBytesSync(dv.byteLength);
    for(let i = 0; i < randomBytes.length; i++) {
       dv.setUint8(i, randomBytes[i]);
    }
    randomBytes.fill(0);

  }
});
