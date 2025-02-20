export mainnet =
    decimals: 8
    tx-fee: \0.0000004
    tx-fee-auto-mode: \per-byte
    tx-fee-options:
        cheap: \0.0000004
        auto: \0.000001
        fee-per-byte: \0.0000005
    tx-fee-in: \btc
    mask: '1000000000000000000000000000000000'
    api:
        api-url: \https://api.omniwallet.org
        api-url-btc: \https://api.bitcore.io
        provider: \omni
        url: \https://omniexplorer.info
        decimal: 8
    propertyid: \31
    message-prefix: '\x18Bitcoin Signed Message:\n'
    bech32: 'bc'
    bip32:
        public: 0x0488b21e
        private: 0x0488ade4
    pubKeyHash: 0x00
    scriptHash: 0x05
    wif: 0x80
    group: 'Bitcoin'
export testnet =
    tx-fee: \0.0001
    tx-fee-options:
        cheap: \0.00005546
        auto: \0.0002
    tx-fee-in: \btc
    disabled: yes
    decimals: 8
    mask: '1000000000000000000000000000000000'
    api:
        provider: \insight
        url: \https://testnet.blockexplorer.com
        api-url: \https://api.omniwallet.org
        api-url-btc: \https://testnet.blockexplorer.com
        decimal: 8
    messagePrefix: '\x18Bitcoin Signed Message:\n'
    propertyid: \31
    bech32: 'tb'
    bip32:
        public: 0x043587cf
        private: 0x04358394
    pubKeyHash: 0x6f
    scriptHash: 0xc4
    wif: 0xef
    group: 'Bitcoin'
export type = \coin
export enabled = yes
export token = \usdt
export nickname = \usdt   
export name = "USDT Omni"
export color = \#26A17B
export image = "data:image/png;base64,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"
export usd-info = "url(https://explorer.velas.com/ticker).usdt_price"
