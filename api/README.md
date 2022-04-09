### Ethnamed Registry API

[Website](https://ethnamed.io) | [Discuss](https://t.me/ethnamed) | [Demo](https://ethnamed.io/wallet)

#### Use API

```
npm i ethnamed
```

### INIT (Backend, Frontend)

```Javascript

var web3 = if window ? window.web3 : require('web3');

var ethnamed = require('ethnamed')(window.web3);

var showResult = function(err, result) {
    console.log(err, result);
}
```

#### CHECK NAME

```Javascript

ethnamed.verifyRecord("some@email.com", showResult);  // yourname == yourname.ethnamed.io

```

#### REGISTER NAME

You can set of update record by yourself once you get the

```Javascript

var request = {
    amountEthers: 0.01,               //=> Please checkout the pricing table in Smart Contract. Also it could be 0 in case when you have Ethnamed tokens.
    name: "some@email.com",           //=> It could be a different domain like microsoft.com, ethername.io, ...
    record: '0x123...'                //=> Verification Record with Standard ETH_ADDRESS,BTC_ADDRESS,...
};

// 1. In case when you use custom domain please send this request only when you put the meta tag in to the head of your website `yourname.domain.io`
// <meta property='ethnamed' content='0x123...'>

// 2. In case you use nickname.ethnamed.io you can just do nothing for verification

ethnamed.setupRecord(request, showResult);

```

#### TRANSFER OWNERSHIP

Assign another owner when you sell the domain name

```Javascript

ethnamed.transferOwnership("some@email.com", '0x123...', showResult);

```

#### SEND TO (PAYPAL like functionality in crypto)

You can send funds to NON-existent address and let withdraw it when user registers it

```Javascript

var request = {
    amountEthers: 0.01,                     //=> Please checkout the pricing table on ethnamed.io
    name: "some@email.com",                 //=> It could be a different domain like microsoft.com, ethername.io, ...
};

ethnamed.sendTo(request, showResult);

```

---

ethnamed.io
