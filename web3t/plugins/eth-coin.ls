export mainnet =
    decimals: 18
    tx-fee: \0.0014
    tx-fee-options: 
        auto: \0.0014
        cheap: \0.00014
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    api:
        provider: \eth
        web3Provider : \https://mainnet.infura.io/UoCkF4efTrbEGU8Qpcs0
        #web3Provider: \https://mainnet.infura.io/v3/6a6c66740e9e4cea9cc8425869e9d106
        url : \https://etherscan.io
        apiUrl : \https://api.etherscan.io/api
export ethnamed =
    decimals: 18
    tx-fee: \0.0014
    tx-fee-options:
        auto: \0.0014
        cheap: \0.00014
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    api:
        provider: \eth
        web3Provider : \http://web3.space:9000
        url : \http://web3.space:8000
        apiUrl : \http://web3.space:8000/api
export ropsten =
    decimals: 18
    tx-fee: \0.0014
    tx-fee-options: 
        auto: \0.0014
        cheap: \0.00014
    message-prefix: 'Ethereum'
    mask: \0x0000000000000000000000000000000000000000
    api:
        provider: \eth
        web3Provider : \https://ropsten.infura.io/UoCkF4efTrbEGU8Qpcs0
        url : \https://ropsten.etherscan.io
        apiUrl : \https://api-ropsten.etherscan.io/api
export color = \#5838B8
export testnet = ropsten
export type = \coin    
export name = "Ethereum"
export enabled = yes
export token = \eth
export image = "data:image/png;base64,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"
export usd-info = "url(https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC,DASH,XEM,USDT,ETC&tsyms=USD).ETH.USD"