
(function() {
    var velas = require("./providers/solana.js");
    console.log("dd");

    var cb = function (err, res) {
        if (err) {
            console.error("ERR: " + err)
            return;
        }
        console.log(res);
    }
    var arg$ = {
        network: {
            "decimals": 18,
            "txFee": "0.0014",
            "txFeeOptions": {
                "auto": "0.0020",
                "cheap": "0.0020"
            },
            "messagePrefix": "Ethereum",
            "mask": "V0000000000000",
            "api": {
                "provider": "velas2",
                web3Provider: 'https://explorer.testnet.velas.com/rpc',
                url: 'https://native.velas.com',
                apiUrl: 'https://explorer.testnet.velas.com/api',
                cluster: 'testnet'
            }
        },
        address: "3f3A7qJ9TEDf45VkWNpb1diyKZtKyLikJcNwkKXvKEJU" // V6fSrQCGy5AEt1ULuuuGTJvZQcoJGgyVVY  //3f3A7qJ9TEDf45VkWNpb1diyKZtKyLikJcNwkKXvKEJU
    }
    velas.getTransactions(arg$, cb);
})();
