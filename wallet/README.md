# Velas Multi-Currency Wallet

### Install Web Wallet on your server

1. mkdir wallet-area
2. cd wallet-area
3. git clone https://github.com/velas/JsWallet wallet
4. git clone http://github.com/web3space/web3t
5. cd web3t
6. npm i
7. cd ../wallet
8. npm i
9. npm i lsxc -g
10. npm run wallet-start
11. open http://127.0.0.1:8080

Tested with `node --version` v11.10.1

### Features

- All coins managed by single mnemonic pharse
- Ability to install/uninstall other coins from github repository
- Web3 api support for multi-currency

### Supported Browsers:

- Chrome
- Mozilla
- Opera
- Safari

### Supported Sreens:

- Mobile - Compact Design
- Desktop - Extended Design with Transaction History

### Supported Coins

- VLX
- BTC (+ All OMNI)
- LTC
- DASH
- ETH (+ All ERC20)
- ETC
- USDT (+ USDT_ERC20)
- and other less known
