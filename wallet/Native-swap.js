import bs58 from 'bs58';
const lo = require('buffer-layout');
const assert = require('assert');
const Buffer = require('buffer').Buffer;
const solanaWeb3 = require('../web3t/providers/solana/index.cjs.js');

const freeOwnership = function () {
  var ds, b;
  ds = lo.struct([lo.u32('tag')]);
  b = Buffer.alloc(4);
  ds.encode(
    {
      tag: 2,
    },
    b
  );
  return b;
};
const swapNativeToEvmData = function (lamports, addr) {
  var ds, b;
  ds = lo.struct([lo.u32('tag'), lo.nu64('lamports'), lo.nu64('array_len')]);
  assert.strictEqual(ds.offsetOf('tag'), 0);
  assert.strictEqual(ds.offsetOf('lamports'), 4);
  assert.strictEqual(ds.offsetOf('array_len'), 12);
  b = Buffer.alloc(20);
  ds.encode(
    {
      tag: 1,
      lamports: lamports,
      array_len: 42,
    },
    b
  );
  return Buffer.concat([b, Buffer.from(addr, 'utf8')]);
};
module.exports = function (ownerPrivateKey, lamports, addr) {
  var EVM_STATE, EVM_CODE, keys, transaction, err;
  const secretKey = bs58.decode(ownerPrivateKey);
  const payAccount = new solanaWeb3.Account(secretKey);
  const owner = payAccount.publicKey;
  EVM_STATE = new solanaWeb3.PublicKey(
    'EvmState11111111111111111111111111111111111'
  );
  EVM_CODE = new solanaWeb3.PublicKey(
    'EVM1111111111111111111111111111111111111111'
  );
  keys = [
    {
      pubkey: EVM_STATE,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: owner,
      isSigner: false,
      isWritable: true,
    },
  ];
  transaction = new solanaWeb3.Transaction();
  try {
    transaction.add(
      solanaWeb3.SystemProgram.assign({
        accountPubkey: owner,
        programId: EVM_CODE,
      })
    );
    transaction.add(
      new solanaWeb3.TransactionInstruction({
        keys: keys,
        data: swapNativeToEvmData(lamports, addr),
        programId: EVM_CODE,
      })
    );
    transaction.add(
      new solanaWeb3.TransactionInstruction({
        keys: keys,
        data: freeOwnership(),
        programId: EVM_CODE,
      })
    );
  } catch (e$) {
    err = e$;
    console.error('err:', err);
    return;
  }
  return transaction;
};
