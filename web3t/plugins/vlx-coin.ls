#const baseUrl = 'https://api.velas.website/api/testnet'
export mainnet =
    decimals: 8
    tx-fee: \0.001
    api:
        provider: \velas
        apiUrl : \https://explorer.velas.com/api/v1
        url: \https://explorer.velas.com
        historyUrl : \https://api.velas.website/api/mainnet/history_pg/:address?limit=289&offset=0
export testnet =
    decimals: 8
    tx-fee: \0.001
    api:
        provider: \velas
        apiUrl : \https://testnet.velas.website/api/v1
        url: \https://testnet.velas.website
        historyUrl : \https://api.velas.website/api/testnet/history_pg/:address?limit=289&offset=0
export color = \#9E4FEB
export type = \coin  
export enabled = yes
export name = "Velas"
export token = \vlx
export image = "data:image/png;base64,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"
export usd-info = "url(https://www.bw.com/exchange/config/controller/website/pricecontroller/getassistprice).datas.usd.vlx"