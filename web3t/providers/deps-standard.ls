require! {
    #\bitgo-utxo-lib : BitcoinLib
    \bitcoinjs-lib : BitcoinLib
    \web3 : \Web3
    \ethereumjs-tx : {Tx: Transaction}
    #\bignumber.js : BN
    \ethereumjs-util : { BN }
    \ethereumjs-wallet/hdkey.js
    \bip39
}

# performance optimization start
mnemonic-to-seed = bip39.mnemonic-to-seed
cache = {}
bip39.mnemonic-to-seed = (mnemonic)->
    cache[mnemonic] = mnemonic-to-seed mnemonic if not cache[mnemonic]?
    cache[mnemonic]
# performance optimization end

module.exports = { BitcoinLib, Web3, Tx, BN, hdkey, bip39 }
