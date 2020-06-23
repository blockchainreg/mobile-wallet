module.exports = {
    "mainnet": {
        "decimals": 18,
        "txFee": "0.0014",
        "txFeeOptions": {
            "auto": "0.0014",
            "cheap": "0.00014"
        },
        "messagePrefix": "Ethereum",
        "mask": "0x0000000000000000000000000000000000000000",
        "api": {
            "provider": "eth",
            "web3Provider": "https://mainnet.infura.io/v3/6ea14cccb3b14586b7e2b6724e347d6c",
            "url": "https://etherscan.io",
            "apiUrl": "https://api.etherscan.io/api"
        }
    },
    "ethnamed": {
        "decimals": 18,
        "txFee": "0.0014",
        "txFeeOptions": {
            "auto": "0.0014",
            "cheap": "0.00014"
        },
        "messagePrefix": "Ethereum",
        "mask": "0x0000000000000000000000000000000000000000",
        "api": {
            "provider": "eth",
            "web3Provider": "http://web3.space:9000",
            "url": "http://web3.space:8000",
            "apiUrl": "http://web3.space:8000/api"
        }
    },
    "ropsten": {
        "decimals": 18,
        "txFee": "0.0014",
        "txFeeOptions": {
            "auto": "0.0014",
            "cheap": "0.00014"
        },
        "messagePrefix": "Ethereum",
        "mask": "0x0000000000000000000000000000000000000000",
        "api": {
            "provider": "eth",
            "web3Provider": "https://ropsten.infura.io/UoCkF4efTrbEGU8Qpcs0",
            "url": "https://ropsten.etherscan.io",
            "apiUrl": "https://api-ropsten.etherscan.io/api"
        }
    },
    "color": "#5838B8",
    "testnet": {
        "decimals": 18,
        "txFee": "0.0014",
        "txFeeOptions": {
            "auto": "0.0014",
            "cheap": "0.00014"
        },
        "messagePrefix": "Ethereum",
        "mask": "0x0000000000000000000000000000000000000000",
        "api": {
            "provider": "eth",
            "web3Provider": "https://ropsten.infura.io/UoCkF4efTrbEGU8Qpcs0",
            "url": "https://ropsten.etherscan.io",
            "apiUrl": "https://api-ropsten.etherscan.io/api"
        }
    },
    "type": "coin",
    "name": "Ethereum",
    "enabled": true,
    "token": "eth",
    "image": "data:image/png;base64,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",
    "usdInfo": "url(https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC,DASH,XEM,USDT,ETC&tsyms=USD).ETH.USD"
}
