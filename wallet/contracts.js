
var ref$, abis, Web3, createTransaction, times, minus, div, plus, pushTx;

Web3 = require('web3');
ref$ = require('./api.js'), createTransaction = ref$.createTransaction, pushTx = ref$.pushTx;
ref$ = require('./math.js'), times = ref$.times, minus = ref$.minus, div = ref$.div, plus = ref$.plus;
var ref$ = require('prelude-ls'), sortBy = ref$.sortBy, reverse = ref$.reverse, filter = ref$.filter, find = ref$.find, keys = ref$.keys, map = ref$.map;
var confirm = require('./pages/confirmation.js').confirm;
const BN = require('ethereumjs-util').BN;

abis = {
	Staking: require("../web3t/contracts/StakingAuRa.json").abi,
	EvmToNativeBridge: require("../web3t/contracts/EvmToNativeBridge.json").abi,
	HomeBridgeNativeToErc: require("../web3t/contracts/HomeBridgeNativeToErc.json").abi,
	ForeignBridgeNativeToErc: require("../web3t/contracts/ForeignBridgeNativeToErc.json").abi,
	ERC20BridgeToken: require("../web3t/contracts/ERC20BridgeToken.json").abi,
	ERC677BridgeToken: require("../web3t/contracts/ERC20BridgeToken.json").abi,
	HomeERC677Bridge: require("../web3t/contracts/HomeBridgeNativeToErc.json").abi,
	ForeignBridgeErcToErc: require("../web3t/contracts/ForeignBridgeErcToErc.json").abi
};

module.exports = function({ store, web3t}) {

	var lang, wallets, chosenNetworkWallet, send, wallet, vlx_evm_to_vlx_erc20_swap, velas_evm_to_heco_swap, 
		bsc_velas_to_velas_evm_swap, velas_eth_to_eth_swap, eth_to_velas_eth_swap, vlx_erc20_to_velas_swap, velas_evm_to_bsc_swap, 
		heco_to_velas_evm_swap, usdc_to_usdc_velas_swap, usdc_velas_to_usdc_swap, busd_velas_to_busd_swap, busd_to_busd_velas_swap, 
		checkingAllowed, checkAllowedAmount, eth_usdtUsdt_velasSwap, usdt_velasEth_usdtSwap,HOME_BRIDGE, FOREIGN_BRIDGE_TOKEN,
		FOREIGN_BRIDGE, receiver, web3, contract;
	
	if (store == null || web3t == null) {
		console.log("! store == null || web3t == null");
		return null;
	}
	
	const toHex = function(it){
		return new BN(it);
	};
	

	send = store.current.send;
	wallet = send.wallet;
	if (wallet == null) {
		console.log("! wallet == null");
		return null;
	}
	var up = function(str){
		return (str != null ? str : "").trim().toUpperCase();
	};
	var isSelfSend = up(wallet.address) === up(store.current.send.to);
	
	const isNotBridge = function(){
		var token, chosenNetwork, ref$;
		token = store.current.send.wallet.coin.token;
		chosenNetwork = store.current.send.chosenNetwork;
		return ((ref$ = chosenNetwork.referTo) === 'vlx_evm' || ref$ === 'vlx2' || ref$ === 'vlx_native') && (token === 'vlx_evm' || token === 'vlx2' || token === 'vlx_native');
	};
	
	/* 
	* Swap from USDC to USDC VELAS
	*/
	usdc_to_usdc_velas_swap = function (token, chosenNetwork, cb) {
		var web3, ref$, FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN, value, receiver, contract, allowed, coin, gas, gasPrice, amountSend, amountSendFee, feeType, network, txType, ref1$, ref2$, ref3$, minPerTxRaw, minPerTx, maxPerTxRaw, maxPerTx;
		if (!(token === 'usdc' && chosenNetwork.id === 'vlx_usdc')) {
			return cb(null);
		}
		ref$ = wallet.network, FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN;
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 6));
		receiver = send.to;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet.network.api.web3Provider));
		web3.eth.providerUrl = wallet.network.api.web3Provider;
		contract = web3.eth.contract(abis.ForeignBridgeErcToErc).at(FOREIGN_BRIDGE_TOKEN);
		/*---*/
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 6));
		receiver = send.to;
		/* Check for allowed amount for contract */
		contract.allowance(wallet.address, FOREIGN_BRIDGE, function (err, allowedRaw){
			allowed = div(allowedRaw, Math.pow(10, wallet.network.decimals));
			coin = send.coin, gas = send.gas, gasPrice = send.gasPrice, amountSend = send.amountSend, amountSendFee = send.amountSendFee, feeType = send.feeType, network = send.network, txType = send.txType;
			web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref$ = wallet.network) != null ? (ref1$ = ref$.api) != null ? ref1$.web3Provider : void 8 : void 8 : void 8));
			web3.eth.providerUrl = wallet != null ? (ref2$ = wallet.network) != null ? (ref3$ = ref2$.api) != null ? ref3$.web3Provider : void 8 : void 8 : void 8;
			contract = web3.eth.contract(abis.ForeignBridgeErcToErc).at(FOREIGN_BRIDGE);
			contract.minPerTx(function(err, minPerTxRaw) {
				minPerTx = div(minPerTxRaw, Math.pow(10, 6));
				if (+send.amountSend < +minPerTx) {
					return cb("Min amount per transaction is " + minPerTx + " USDC");
				}
				contract.maxAvailablePerTx(function(err, maxPerTxRaw) {
					maxPerTx = div(maxPerTxRaw, Math.pow(10, 6));
					if (+send.amountSend > +maxPerTx) {
						return cb("Max amount per transaction is " + maxPerTx + " USDC");
					}
					return checkAllowedAmount({
						contract: contract,
						wallet: wallet,
						amount: send.amountSend,
						allowed: allowed,
						bridge: FOREIGN_BRIDGE,
						bridgeToken: FOREIGN_BRIDGE_TOKEN
					}, function (err) {
						var data, contractAddress;
						if (err != null) {
							return cb(err);
						}
						data = (function () {
							switch (false) {
								case isSelfSend !== true:
									return contract.transfer.getData(FOREIGN_BRIDGE, value);
								default:
									return contract.relayTokens.getData(receiver, value);
							}
						}());
						contractAddress = (function () {
							switch (false) {
								case isSelfSend !== true:
									return FOREIGN_BRIDGE_TOKEN;
								default:
									return FOREIGN_BRIDGE;
							}
						}());
						store.current.send.contractAddress = contractAddress;
						store.current.send.data = data;
						return cb(null, data);
					});
				});
			});
		});
	};
	/* DONE! */
	/* 
	* Swap from USDC VELAS to USDC
	*/
	usdc_velas_to_usdc_swap = function (token, chosenNetwork, cb) {
		var web3, ref$, HOME_BRIDGE, HOME_BRIDGE_TOKEN, value, receiver, ref1$, ref2$, ref3$, contract, network,
				minPerTxRaw, minPerTx, maxPerTxRaw, maxPerTx, err, data;
		if (!(token === 'vlx_usdc' && chosenNetwork.id === 'usdc')) {
			return cb(null);
		}
		ref$ = wallet.network, HOME_BRIDGE = ref$.HOME_BRIDGE, HOME_BRIDGE_TOKEN = ref$.HOME_BRIDGE_TOKEN;
		if (HOME_BRIDGE == null) {
			return cb("HOME_BRIDGE is not defined");
		}
		if (HOME_BRIDGE_TOKEN == null) {
			return cb("HOME_BRIDGE_TOKEN is not defined");
		}
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 6));
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref$ = wallet.network) != null ? (ref1$ = ref$.api) != null ? ref1$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref2$ = wallet.network) != null ? (ref3$ = ref2$.api) != null ? ref3$.web3Provider : void 8 : void 8 : void 8;
		contract = web3.eth.contract(abis.ERC20BridgeToken).at(HOME_BRIDGE);

		contract.minPerTx(function(err, minPerTxRaw) {
			minPerTx = div(minPerTxRaw, Math.pow(10, 6));
			if (+send.amountSend < +minPerTx) {
				return cb("Min amount per transaction is " + minPerTx + " USDC");
			}
			contract.maxAvailablePerTx(function(err, maxPerTxRaw) {
				maxPerTx = div(maxPerTxRaw, Math.pow(10, 6));
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " USDC");
				}

				data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
				store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
				store.current.send.data = data;
				cb(null, data);
			})
		})
	};
	
	/* ! */
	busd_velas_to_busd_swap = function (token, chosenNetwork, cb) {
		var web3, ref$, HOME_BRIDGE, HOME_BRIDGE_TOKEN, value, ref1$, ref2$, ref3$, contract,
				minPerTx, maxPerTx, data;
		if (!(token === 'vlx_busd' && chosenNetwork.id === 'busd')) {
			return cb(null);
		}
		ref$ = wallet.network, HOME_BRIDGE = ref$.HOME_BRIDGE, HOME_BRIDGE_TOKEN = ref$.HOME_BRIDGE_TOKEN;
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 18));
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref$ = wallet.network) != null ? (ref1$ = ref$.api) != null ? ref1$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref2$ = wallet.network) != null ? (ref3$ = ref2$.api) != null ? ref3$.web3Provider : void 8 : void 8 : void 8;
		contract = web3.eth.contract(abis.ERC20BridgeToken).at(HOME_BRIDGE);
		contract.minPerTx(function (err, minPerTxRaw) {
			minPerTx = div(minPerTxRaw, Math.pow(10, 18));
			if (+send.amountSend < +minPerTx) {
				return cb("Min amount per transaction is " + minPerTx + " BUSD");
			}
			contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
				maxPerTx = div(maxPerTxRaw, Math.pow(10, 18));
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " BUSD");
				}
				data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
				store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
				store.current.send.data = data;
				cb(null, data);
			});
		});
	};
	
	busd_to_busd_velas_swap = function(token, chosenNetwork, cb){
		var wallets, chosenNetworkWallet, ref$, FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN, web3, contract, value, receiver, allowed, minPerTx, maxPerTx;
		if (!(token === 'busd' && chosenNetwork.id === 'vlx_busd')) {
			return cb(null);
		}
		wallets = store.current.account.wallets;
		chosenNetworkWallet = find(function(it){
			return it.coin.token === chosenNetwork.id;
		})(
			wallets);
		if (chosenNetworkWallet == null) {
			return cb("[Swap error]: wallet " + chosenNetwork.id + " is not found!");
		}
		ref$ = wallet.network, FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet.network.api.web3Provider));
		web3.eth.providerUrl = wallet.network.api.web3Provider;
		contract = web3.eth.contract(abis.ForeignBridgeErcToErc).at(FOREIGN_BRIDGE_TOKEN);
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 18));
		receiver = send.to;
		
		/* Check for allowed amount for contract */
		contract.allowance(wallet.address, FOREIGN_BRIDGE, function(err, allowedRaw){
			allowed = div(allowedRaw, Math.pow(10, 0));
			contract = web3.eth.contract(abis.ForeignBridgeErcToErc).at(FOREIGN_BRIDGE);
			contract.minPerTx(function (err, minPerTxRaw) {
				minPerTx = div(minPerTxRaw, Math.pow(10, 18));
				if (+send.amountSend < +minPerTx) {
					return cb("Min amount per transaction is " + minPerTx + " BUSD");
				}
				contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
					maxPerTx = div(maxPerTxRaw, Math.pow(10, 18));
					if (+send.amountSend > +maxPerTx) {
						return cb("Max amount per transaction is " + maxPerTx + " BUSD");
					}
					return checkAllowedAmount({
						contract: contract,
						wallet: wallet,
						amount: send.amountSend,
						allowed: allowed,
						bridge: FOREIGN_BRIDGE,
						bridgeToken: FOREIGN_BRIDGE_TOKEN
					}, function(err) {
						var data, contractAddress;
						if (err != null) {
							return cb(err);
						}
						data = (function () {
							switch (false) {
								case isSelfSend !== true:
									return contract.transfer.getData(FOREIGN_BRIDGE, value);
								default:
									return contract.relayTokens.getData(receiver, value);
							}
						}());
						contractAddress = (function () {
							switch (false) {
								case isSelfSend !== true:
									return FOREIGN_BRIDGE_TOKEN;
								default:
									return FOREIGN_BRIDGE;
							}
						}());
						store.current.send.contractAddress = contractAddress;
						store.current.send.data = data;
						return cb(null, data);
					});
				});
			});
		});
	};
	checkingAllowed = false;
	/* Check for allowed amount for contract */
	checkAllowedAmount = function (arg$, cb) {
		var contract, wallet, amount, allowed, bridge, bridgeToken, token, ref$, ref1$;
		contract = arg$.contract, wallet = arg$.wallet, amount = arg$.amount, allowed = arg$.allowed, bridge = arg$.bridge, bridgeToken = arg$.bridgeToken;
		if (checkingAllowed) {
			return;
		}
		if (isSelfSend === true) {
			return cb(null);
		}
		if (bridge == null) {
			return cb("bridge is not defined");
		}
		if (bridgeToken == null) {
			return cb("bridgeToken is not defined");
		}
		if (allowed >= amount) {
			return cb(null);
		}
		
		token = ((ref$ = wallet != null ? (ref1$ = wallet.coin) != null ? ref1$.nickname : void 8 : void 8) != null ? ref$ : "").toUpperCase();
		var confirmText = "To execute this swap please approve that bridge contract can withdraw your " + token + " and automate payments for you.";
		confirm(store, confirmText, function (agree) {
			var UINT_MAX_NUMBER, coin, gas, gasPrice, amountSend, amountSendFee, feeType, network, txType, data, txObj;
			if (!agree) {
				return cb("Canceled by user");
			}
			UINT_MAX_NUMBER = times(4294967295, Math.pow(10, wallet.network.decimals));
			coin = send.coin, gas = send.gas, gasPrice = send.gasPrice, amountSend = send.amountSend, amountSendFee = send.amountSendFee, feeType = send.feeType, network = send.network, txType = send.txType;
			data = contract.approve.getData(bridge, UINT_MAX_NUMBER);
			txObj = {
				account: {
					address: wallet.address,
					privateKey: wallet.privateKey
				},
				recipient: bridgeToken,
				network: network,
				token: token,
				coin: coin,
				amount: "0",
				amountFee: "0.002",
				data: data,
				gas: 50000,
				gasPrice: gasPrice,
				feeType: feeType
			};
			return createTransaction(txObj, function(err, txData){
				var checkingAllowed;
				if (err != null) {
					return cb(err);
				}
				checkingAllowed = true;
				return pushTx((import$({
					token: token,
					txType: txType,
					network: network
				}, txData)), function(err, tx){
					var checkingAllowed;
					if (err != null) {
						return cb(err);
					}
					checkingAllowed = false;
					return cb(null);
				});
			});
		});
	};
	
	
	/* CHECKED!
	* Swap from USDT ETHEREUM to USDT VELAS 
	*/
	eth_usdtUsdt_velasSwap = function(token, chosenNetwork, cb){
		var web3, ref$, FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN, value, receiver, ref1$, ref2$, ref3$, contract, allowedRaw, allowed, network, minPerTxRaw, minPerTx, maxPerTxRaw, maxPerTx;
		if (!(token === 'usdt_erc20' && chosenNetwork.id === 'vlx_usdt')) {
			return cb(null);
		}
		ref$ = wallet.network, FOREIGN_BRIDGE = ref$.FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN = ref$.FOREIGN_BRIDGE_TOKEN;
		if (FOREIGN_BRIDGE == null) {
			return cb("FOREIGN_BRIDGE is not defined");
		}
		if (FOREIGN_BRIDGE_TOKEN == null) {
			return cb("FOREIGN_BRIDGE_TOKEN is not defined");
		}
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 6));
		receiver = send.to;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref$ = wallet.network) != null ? (ref1$ = ref$.api) != null ? ref1$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref2$ = wallet.network) != null ? (ref3$ = ref2$.api) != null ? ref3$.web3Provider : void 8 : void 8 : void 8;
		
		contract = web3.eth.contract(abis.ForeignBridgeErcToErc).at(FOREIGN_BRIDGE_TOKEN);
		contract.allowance(wallet.address, FOREIGN_BRIDGE, function (err, allowedRaw) {
			if(err !== null){
				return cb(err);
			}
			allowed = div(allowedRaw, Math.pow(10, 0));
			network = wallet.network;
			contract = web3.eth.contract(abis.ForeignBridgeErcToErc).at(FOREIGN_BRIDGE);
			
			contract.minPerTx(function (err, minPerTxRaw) {
				minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
				
				if (+send.amountSend < +minPerTx) {
					return cb("Min amount per transaction is " + minPerTx + " USDT");
				}
				
				contract.maxAvailablePerTx(function(err, maxPerTxRaw){
					maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
					
					if (+send.amountSend > +maxPerTx) {
						return cb("Max amount per transaction is " + maxPerTx + " USDT");
					}
					
					/* Check for allowed amount for contract */
					return checkAllowedAmount({
						contract: contract,
						wallet: wallet,
						amount: send.amountSend,
						allowed: allowed,
						bridge: FOREIGN_BRIDGE,
						bridgeToken: FOREIGN_BRIDGE_TOKEN
					}, function(err){
						var data, contractAddress;
						if (err != null) {
							return cb(err);
						}
						data = (function(){
							switch (false) {
								case isSelfSend !== true:
									return contract.transfer.getData(FOREIGN_BRIDGE, value);
								default:
									return contract.relayTokens.getData(receiver, value);
							}
						}());
						contractAddress = (function(){
							switch (false) {
								case isSelfSend !== true:
									return FOREIGN_BRIDGE_TOKEN;
								default:
									return FOREIGN_BRIDGE;
							}
						}());
						store.current.send.contractAddress = contractAddress;
						store.current.send.data = data;
						return cb(null, data);
					});
					
				});
				
			});
		});
		
		
		
	};
	/* 
	* Swap from USDT VELAS to USDT ETHEREUM
	*/
	usdt_velasEth_usdtSwap = function (token, chosenNetwork, cb) {
		var web3, ref$, HOME_BRIDGE, HOME_BRIDGE_TOKEN, value, ref1$, ref2$, ref3$, contract,
				minPerTxRaw, minPerTx, maxPerTxRaw, maxPerTx, data;
		if (!(token === 'vlx_usdt' && chosenNetwork.id === 'usdt_erc20')) {
			return cb(null);
		}
		ref$ = wallet.network, HOME_BRIDGE = ref$.HOME_BRIDGE, HOME_BRIDGE_TOKEN = ref$.HOME_BRIDGE_TOKEN;
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 6));
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref$ = wallet.network) != null ? (ref1$ = ref$.api) != null ? ref1$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref2$ = wallet.network) != null ? (ref3$ = ref2$.api) != null ? ref3$.web3Provider : void 8 : void 8 : void 8;
		contract = web3.eth.contract(abis.ERC20BridgeToken).at(HOME_BRIDGE);
		
		contract.minPerTx(function (err, minPerTxRaw) {
			
			if (err !== null) {
				return cb("[minPerTx] Error: " + err);
			}
			minPerTx = div(minPerTxRaw, Math.pow(10, 6));
			if (+send.amountSend < +minPerTx) {
				return cb("Min amount per transaction is " + minPerTx + " USDT");
			}
			
			contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
				if (err !== null) {
					return cb("[maxPerTx] Error: " + err);
				}
				maxPerTx = div(maxPerTxRaw, Math.pow(10, 6));
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " USDT");
				}
				data = contract.transferAndCall.getData(HOME_BRIDGE, value, send.to);
				store.current.send.contractAddress = HOME_BRIDGE_TOKEN;
				store.current.send.data = data;
				cb(null, data);
			})
		})
		
	};
	
	/*new*/
	/* Swap from VELAS EVM to HECO */
	velas_evm_to_heco_swap = function (token, chosenNetwork, cb) {
		var web3, ref$, receiver, ref1$, ref2$, ref3$, contract, network,
		  minPerTx, maxPerTx, data, HECO_SWAP__HOME_BRIDGE;
		if (!(token === 'vlx_evm' && chosenNetwork.id === 'vlx_huobi')) {
			return cb(null);
		}
		wallets = store.current.account.wallets;
		chosenNetworkWallet = find(function (it) {
			return it.coin.token === chosenNetwork.id;
		})(
		  wallets);
		if (chosenNetworkWallet == null) {
			return cb("[Swap error]: wallet " + chosenNetwork.id + " is not found!");
		}
		HECO_SWAP__HOME_BRIDGE = wallet.network.HECO_SWAP__HOME_BRIDGE;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref$ = wallet.network) != null ? (ref1$ = ref$.api) != null ? ref1$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref2$ = wallet.network) != null ? (ref3$ = ref2$.api) != null ? ref3$.web3Provider : void 8 : void 8 : void 8;
		contract = web3.eth.contract(abis.HomeBridgeNativeToErc).at(HECO_SWAP__HOME_BRIDGE);
		receiver = store.current.send.to;
		network = wallet.network;
		contract.minPerTx(function (err, minPerTxRaw) {
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
				data = contract.relayTokens.getData(receiver);
				if (+send.amountSend < +minPerTx) {
					return cb("Min amount per transaction is " + minPerTx + " VLX");
				}
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " VLX");
				}
				send.data = data;
				store.current.send.contractAddress = HECO_SWAP__HOME_BRIDGE;
				cb(null, data);
			});
		});
	};
	
	
	/* Swap from HECO to VELAS EVM */
	heco_to_velas_evm_swap = function (token, chosenNetwork, cb) {
		var web3, contract, network,minPerTx, maxPerTx, data, ref4$, ref5$, ref6$, ref7$;
		if (!(token === 'vlx_huobi' && chosenNetwork.id === 'vlx_evm')) {
			return cb(null);
		}
		let value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 18));
		ref4$ = wallet.network, FOREIGN_BRIDGE = ref4$.FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN = ref4$.FOREIGN_BRIDGE_TOKEN;
		if (FOREIGN_BRIDGE == null) {
			return cb("FOREIGN_BRIDGE is not defined");
		}
		if (FOREIGN_BRIDGE_TOKEN == null) {
			return cb("FOREIGN_BRIDGE_TOKEN is not defined");
		}
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref4$ = wallet.network) != null ? (ref5$ = ref4$.api) != null ? ref5$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref6$ = wallet.network) != null ? (ref7$ = ref6$.api) != null ? ref7$.web3Provider : void 8 : void 8 : void 8;
		contract = web3.eth.contract(abis.ForeignBridgeNativeToErc).at(FOREIGN_BRIDGE);
		network = wallet.network;
		/*  Get minPerTx from HomeBridge */
		contract.minPerTx(function (err, minPerTxRaw) {
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			/* Get maxPerTx from HomeBridge */
			contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
				if (+send.amountSend < +minPerTx) {
					return cb("Min amount per transaction is " + minPerTx + " VLX");
				}
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " VLX");
				}
				contract = web3.eth.contract(abis.ForeignBridgeNativeToErc).at(FOREIGN_BRIDGE_TOKEN);
				data = (function () {
					switch (false) {
						case isSelfSend !== true:
							return contract.transfer.getData(FOREIGN_BRIDGE, toHex(value), send.to);
						default:
							return contract.transferAndCall.getData(FOREIGN_BRIDGE, value, send.to);
					}
				}());
				send.data = data;
				send.contractAddress = FOREIGN_BRIDGE_TOKEN;
				cb(null, data);
			});
		});
	}
	
	
	/* Swap from VELAS EVM to BSC */
	velas_evm_to_bsc_swap = function (token, chosenNetwork, cb) {
		var web3, contract, network, value, contractAddress,
		  minPerTx, maxPerTx, data;
		if (!(token === 'vlx_evm' && chosenNetwork.id === 'bsc_vlx')) {
			return cb(null);
		}

		wallets = store.current.account.wallets;
		chosenNetworkWallet = find(function(it){
			return it.coin.token === chosenNetwork.id;
		})(
		  wallets);
		if (chosenNetworkWallet == null) {
			return cb("[Swap error]: wallet " + chosenNetwork.id + " is not found!");
		}
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 18));
		ref8$ = wallet.network, BSC_SWAP__HOME_BRIDGE = ref8$.BSC_SWAP__HOME_BRIDGE, ERC20BridgeToken = ref8$.ERC20BridgeToken;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref8$ = wallet.network) != null ? (ref9$ = ref8$.api) != null ? ref9$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref10$ = wallet.network) != null ? (ref11$ = ref10$.api) != null ? ref11$.web3Provider : void 8 : void 8 : void 8;
		contract = web3.eth.contract(abis.HomeBridgeNativeToErc).at(BSC_SWAP__HOME_BRIDGE);
		receiver = store.current.send.to;
		network = wallet.network;
		contract.minPerTx(function(err, minPerTxRaw) {
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			contract.maxAvailablePerTx(function(err, maxPerTxRaw){
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));

				contractAddress = (function () {
					switch (false) {
						case isSelfSend !== true:
							return ERC20BridgeToken;
						default:
							return BSC_SWAP__HOME_BRIDGE;
					}
				}());

				data = contract.relayTokens.getData(receiver);
				const amountToSend = plus(send.amountSendFee, send.amountSend);
				if (+send.amountSend < +minPerTx) {
					return cb("Min amount per transaction is " + minPerTx + " VLX");
				}
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " VLX");
				}
				send.data = data;
				store.current.send.contractAddress = BSC_SWAP__HOME_BRIDGE;
				cb(null, data);
			});
		});
	};
	
	
	/* Swap from BSC VELAS to VELAS EVM */
	bsc_velas_to_velas_evm_swap = function (token, chosenNetwork, cb) {
		var web3, contract, network, ref12$, ref13$, ref14$, ref15$,
		  value, minPerTx, maxPerTx, data;
		if (!(token === 'bsc_vlx' && chosenNetwork.id === 'vlx_evm')) {
			return cb(null);
		}
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 18));
		ref12$ = wallet.network, FOREIGN_BRIDGE = ref12$.FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN = ref12$.FOREIGN_BRIDGE_TOKEN;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref12$ = wallet.network) != null ? (ref13$ = ref12$.api) != null ? ref13$.web3Provider : void 8 : void 8 : void 8));
		web3.eth.providerUrl = wallet != null ? (ref14$ = wallet.network) != null ? (ref15$ = ref14$.api) != null ? ref15$.web3Provider : void 8 : void 8 : void 8;
		contract = web3.eth.contract(abis.ForeignBridgeNativeToErc).at(FOREIGN_BRIDGE);
		network = wallet.network;
		/* Get minPerTx from HomeBridge */
		contract.minPerTx(function(err, minPerTxRaw) {
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			/* Get maxPerTx from HomeBridge */
			contract.maxAvailablePerTx(function(err, maxPerTxRaw) {
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
				if (+send.amountSend < +minPerTx) {
					return cb("Min amount per transaction is " + minPerTx + " VLX");
				}
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " VLX");
				}
				contract = web3.eth.contract(abis.ForeignBridgeNativeToErc).at(FOREIGN_BRIDGE_TOKEN);
				data = (function () {
					switch (false) {
						case isSelfSend !== true:
							return contract.transfer.getData(FOREIGN_BRIDGE, toHex(value), send.to);
						default:
							return contract.transferAndCall.getData(FOREIGN_BRIDGE, value, send.to);
					}
				}());
				send.data = data;
				send.contractAddress = FOREIGN_BRIDGE_TOKEN;
				cb(null, data);
			});
		});
	};
	
	
	/* Swap from ETH to ETHEREUM (VELAS) */
	eth_to_velas_eth_swap = function (token, chosenNetwork, cb) {
		var web3, contract, network, minPerTx, maxPerTx, data;
		if (!(token === 'eth' && chosenNetwork.id === 'vlx_eth')) {
			return cb(null);
		}
		wallets = store.current.account.wallets;
		chosenNetworkWallet = find(function(it){
			return it.coin.token === chosenNetwork.id;
		})(wallets);
		if (chosenNetworkWallet == null) {
			return cb("[Swap error]: wallet " + chosenNetwork.id + " is not found!");
		}
		let value = store.current.send.amountSend;
		value = toHex(times(value, Math.pow(10, 18)));
		HOME_BRIDGE = wallet.network.HOME_BRIDGE;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet.network.api.web3Provider));
		web3.eth.providerUrl = wallet.network.api.web3Provider;
		contract = web3.eth.contract(abis.HomeBridgeNativeToErc).at(HOME_BRIDGE);
		store.current.send.contractAddress = HOME_BRIDGE;
		receiver = send.to;
		contract.minPerTx(function(err, minPerTxRaw) {
			network = wallet.network;
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			if (+send.amountSend < +minPerTx) {
				return cb("Min amount per transaction is " + minPerTx + " ETH");
			}
			contract.maxAvailablePerTx(function(err, maxPerTxRaw) {
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " ETH");
				}
				data = contract.relayTokens.getData(receiver);
				send.data = data;
				cb(null, data);
			});
		});
	};
	
	
	/* Swap from ETH (VELAS) to ETH  */
	velas_eth_to_eth_swap = function (token, chosenNetwork, cb) {
		var web3, contract, network,
		  minPerTxRaw, minPerTx, maxPerTxRaw, maxPerTx, data;
		if (!(token === 'vlx_eth' && chosenNetwork.id === 'eth')) {
			return cb(null);
		}
		value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 18));
		network = wallet.network;
		var ref16$ = wallet.network, FOREIGN_BRIDGE = ref16$.FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN = ref16$.FOREIGN_BRIDGE_TOKEN;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet.network.api.web3Provider));
		web3.eth.providerUrl = wallet.network.api.web3Provider;
		contract = web3.eth.contract(abis.ERC20BridgeToken).at(FOREIGN_BRIDGE);

		contract.minPerTx(function(err, minPerTxRaw) {
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			if (+send.amountSend < +minPerTx) {
				return cb("Min amount per transaction is " + minPerTx + " ETH");
			}
			contract.maxAvailablePerTx(function(err, maxPerTxRaw) {
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " ETH");
				}

				contract = web3.eth.contract(abis.ERC20BridgeToken).at(FOREIGN_BRIDGE_TOKEN);
				data = contract.transferAndCall.getData(FOREIGN_BRIDGE, value, send.to);
				send.data = data;
				send.contractAddress = FOREIGN_BRIDGE_TOKEN;
				cb(null, data);
			});
		});
	};
	
	/* CHECK */
	/* Swap from VLX ERC20 to COIN VLX */
	vlx_erc20_to_velas_swap = function (token, chosenNetwork, cb) {
		var web3, contract, network,
		  minPerTx, maxPerTx, data;
		if (!(token === 'vlx_erc20' && ((ref16$ = chosenNetwork.id) === 'vlx_evm' || ref16$ === 'vlx2'))) {
			return cb(null);
		}
		var value = store.current.send.amountSend;
		value = times(value, Math.pow(10, 18));
		network = wallet.network;
		var ref16$ = wallet.network, FOREIGN_BRIDGE = ref16$.FOREIGN_BRIDGE, FOREIGN_BRIDGE_TOKEN = ref16$.FOREIGN_BRIDGE_TOKEN;
		web3 = new Web3(new Web3.providers.HttpProvider(wallet.network.api.web3Provider));
		web3.eth.providerUrl = wallet.network.api.web3Provider;
		contract = web3.eth.contract(abis.ForeignBridgeNativeToErc).at(FOREIGN_BRIDGE);
		
		/* Get minPerTx */
		contract.minPerTx(function (err, minPerTxRaw) {
			
			if (err != null) {
				return cb(err);
			}
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			if (+send.amountSend < +minPerTx) {
				return cb("Min amount per transaction is " + minPerTx + " VLX");
			}
			
			/* Get maxPerTx  */
			contract.maxAvailablePerTx(function (err, maxPerTxRaw) {
				
				if (err != null) {
					return cb(err);
				}
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " VLX");
				}
				
				var sendingTo = (function () {
					switch (false) {
						case !send.to.startsWith('V'):
							return toEthAddress(send.to);
						default:
							return send.to;
					}
				}());
				contract = web3.eth.contract(abis.ERC20BridgeToken).at(FOREIGN_BRIDGE_TOKEN);
				data = contract.transferAndCall.getData(FOREIGN_BRIDGE, value, sendingTo);
				send.data = data;
				send.contractAddress = FOREIGN_BRIDGE_TOKEN;
				cb(null, data);
			});
		});
	}

	
	/* CHECK */
	/* Swap from COIN VLX to VLX ERC20 */
	vlx_evm_to_vlx_erc20_swap = async function (token, chosenNetwork, cb) {

		var network,  minPerTx,  maxPerTx, data;
		if (!((token === 'vlx_evm' || token === 'vlx2') && chosenNetwork.id === 'vlx_erc20')) {
			return cb(null);
		}
		wallets = store.current.account.wallets;
		chosenNetworkWallet = find(function(it){
			return it.coin.token === chosenNetwork.id;
		})(
		  wallets);
		if (chosenNetworkWallet == null) {
			return cb("[Swap error]: wallet " + chosenNetwork.id + " is not found!");
		}
		HOME_BRIDGE = wallet.network.HOME_BRIDGE;
		receiver = store.current.send.to;
		network = wallet.network;
	  
		web3 = new Web3(new Web3.providers.HttpProvider(wallet.network.api.web3Provider));
		web3.eth.providerUrl = wallet.network.api.web3Provider;
		contract = web3.eth.contract(abis.HomeBridgeNativeToErc).at(HOME_BRIDGE);
		data = contract.relayTokens.getData(receiver);
		
		contract.minPerTx(function (err, minPerTxRaw) {
			
			if (err != null) {
				return cb(err);
			}
			minPerTx = div(minPerTxRaw, Math.pow(10, network.decimals));
			if (+send.amountSend < +minPerTx) {
				return cb("Min amount per transaction is " + minPerTx + " VLX");
			}
			
			contract.maxAvailablePerTx(function(err, maxPerTxRaw){
				
				if (err != null) {
					return cb(err);
				}
				maxPerTx = div(maxPerTxRaw, Math.pow(10, network.decimals));
				if (+send.amountSend > +maxPerTx) {
					return cb("Max amount per transaction is " + maxPerTx + " VLX");
				}
				
				send.data = data;
				store.current.send.contractAddress = HOME_BRIDGE;
				cb(null, data);
			});
			
		});
		
	};
	
	
	const getBridgeInfo = function (cb) {
		//try {
			console.log("[getBridgeInfo]");
			var chosenNetwork, ref$, ref1$, token, ref2$, wallet, network, abi, web3, ref3$, ref4$, ref5$, HOME_BRIDGE,
				HECO_SWAP__HOME_BRIDGE, BSC_SWAP__HOME_BRIDGE, FOREIGN_BRIDGE, addr, contract, homeFeePercent, err,
				dailyLimit, remainingDailyLimit, minPerTx, maxPerTx;
			chosenNetwork = store != null ? (ref$ = store.current) != null ? (ref1$ = ref$.send) != null ? ref1$.chosenNetwork : void 8 : void 8 : void 8;
			if (chosenNetwork == null) {
				return cb(null);
			}
			token = store.current.send.coin.token;
			if (chosenNetwork == null || chosenNetwork.referTo === 'vlx_native' || token === 'vlx_native' && ((ref2$ = chosenNetwork.referTo) === 'vlx' || ref2$ === 'vlx2' || ref2$ === 'vlx_evm') || (token === 'vlx' || token === 'vlx_evm') && ((ref2$ = chosenNetwork.referTo) === 'vlx_native' || ref2$ === 'vlx2') || (token === 'vlx2' || token === 'vlx_native' || token === 'vlx_evm') && ((ref2$ = chosenNetwork.referTo) === 'vlx_native' || ref2$ === 'vlx2' || ref2$ === 'vlx_evm') || token === 'vlx_native' && ((ref2$ = chosenNetwork.referTo) === 'vlx' || ref2$ === 'vlx2' || ref2$ === 'vlx_evm')) {
				store.current.send.homeFeePercent = 0;
				return cb(null);
			}
			wallet = store.current.send.wallet;
			network = wallet.network;
			abi = [
				{
					"constant": true,
					"inputs": [],
					"name": "getHomeFee",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [],
					"name": "getForeignFee",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [],
					"name": "dailyLimit",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [],
					"name": "minPerTx",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [],
					"name": "maxPerTx",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [],
					"name": "executionDailyLimit",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [],
					"name": "maxAvailablePerTx",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [],
					"name": "getCurrentDay",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}, {
					"constant": true,
					"inputs": [{
						"name": "_day",
						"type": "uint256"
					}],
					"name": "totalSpentPerDay",
					"outputs": [{
						"name": "",
						"type": "uint256"
					}],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				}
			];
			web3 = new Web3(new Web3.providers.HttpProvider(wallet != null ? (ref2$ = wallet.network) != null ? (ref3$ = ref2$.api) != null ? ref3$.web3Provider : void 8 : void 8 : void 8));
			web3.eth.providerUrl = wallet.network.api.web3Provider;
			ref4$ = wallet.network, HOME_BRIDGE = ref4$.HOME_BRIDGE, HECO_SWAP__HOME_BRIDGE = ref4$.HECO_SWAP__HOME_BRIDGE, BSC_SWAP__HOME_BRIDGE = ref4$.BSC_SWAP__HOME_BRIDGE, FOREIGN_BRIDGE = ref4$.FOREIGN_BRIDGE;
			addr = (function () {
				switch (false) {
					case !(token === 'vlx_evm' && chosenNetwork.referTo === 'vlx_huobi'):
						return HECO_SWAP__HOME_BRIDGE;
					case !(token === 'vlx_evm' && chosenNetwork.referTo === 'bsc_vlx'):
						return BSC_SWAP__HOME_BRIDGE;
					case !(token === 'usdc' && chosenNetwork.referTo === 'vlx_usdc'):
						return FOREIGN_BRIDGE;
					case !(token === 'vlx_eth' && chosenNetwork.referTo === 'eth'):
						return FOREIGN_BRIDGE;
					case !(token === 'usdt_erc20' && chosenNetwork.referTo === 'vlx_usdt'):
						return FOREIGN_BRIDGE;
					case !(token === 'vlx_erc20' && chosenNetwork.referTo === 'vlx_evm'):
						return FOREIGN_BRIDGE;
					case !(token === 'bsc_vlx' && chosenNetwork.referTo === 'vlx_evm'):
						return FOREIGN_BRIDGE;
					case !(token === 'vlx_huobi' && chosenNetwork.referTo === 'vlx_evm'):
						return FOREIGN_BRIDGE;
					case !(token === 'busd' && chosenNetwork.referTo === 'vlx_busd'):
						return FOREIGN_BRIDGE;
					default:
						return HOME_BRIDGE;
				}
			}());
			contract = web3.eth.contract(abi).at(addr);
			homeFeePercent = 0;
			//try {
				contract.getHomeFee((err, homeFee) => {
					if (err) {
						homeFee = 0;
					}
					homeFeePercent = div(homeFee, Math.pow(10, wallet != null ? wallet.network.decimals : void 8));
					store.current.send.homeFeePercent = homeFeePercent;
					contract.dailyLimit((err, dailyLimit) => {
						dailyLimit = div(dailyLimit, Math.pow(10, wallet.network.decimals));
						store.current.send.homeDailyLimit = dailyLimit;
						
						contract.getCurrentDay((err, currentDay) => {
							if (err) {
								currentDay = "0x"
							}
							contract.totalSpentPerDay(currentDay, (err, totalSpentPerDay) => {
								totalSpentPerDay = div(totalSpentPerDay, Math.pow(10, wallet.network.decimals));
								remainingDailyLimit = minus(dailyLimit, totalSpentPerDay);
								
								contract.minPerTx((err, minPerTxRaw) => {
									minPerTx = div(minPerTxRaw, Math.pow(10, wallet.network.decimals));
									contract.maxPerTx((err, maxPerTxRaw) => {
										maxPerTx = div(maxPerTxRaw, Math.pow(10, wallet.network.decimals));
										
										importAll$(store.current.networkDetails, {
											dailyLimit: dailyLimit,
											homeFeePercent: homeFeePercent,
											minPerTx: minPerTx,
											maxPerTx: maxPerTx,
											remainingDailyLimit: remainingDailyLimit
										});
										if (token !== 'busd' && token !== 'usdc' && token !== 'usdt_erc20') {
                      return cb(null);
                    }
                    var wallets = store.current.account.wallets;
                    var walletTo = find(function(it){
                      return it.coin.token === chosenNetwork.referTo;
                    })(wallets);
                    var ref4$ = walletTo.network, HOME_BRIDGE = ref4$.HOME_BRIDGE, FOREIGN_BRIDGE = ref4$.FOREIGN_BRIDGE, BSC_SWAP__HOME_BRIDGE = ref4$.BSC_SWAP__HOME_BRIDGE, HECO_SWAP__HOME_BRIDGE = ref4$.HECO_SWAP__HOME_BRIDGE;
                    var web3 = new Web3(new Web3.providers.HttpProvider(walletTo != null ? (ref4$ = walletTo.network) != null ? (ref5$ = ref4$.api) != null ? ref5$.web3Provider : void 8 : void 8 : void 8));
                    web3.eth.providerUrl = walletTo.network.api.web3Provider;
                    var addr = HOME_BRIDGE;
                    var contract = web3.eth.contract(abi).at(addr);
                    var network = walletTo.network;
                    contract.getForeignFee((err, homeFee) => {
                      if (err) {
                        homeFee = 0;
                      }
                      homeFeePercent = div(homeFee, Math.pow(10, network.decimals));
                      store.current.send.homeFeePercent = homeFeePercent;
                      importAll$(store.current.networkDetails, {
                        homeFeePercent: homeFeePercent
                      });
                      return cb(null);
                    })
									});
								});
							});
						});
					});
				})
			// } catch (err) {
			// 	console.error("[getBridgeInfo] Error:", err);
			// }
		// } catch (e) {
		// 	console.error("[getBridgeInfo]1 Error:", e);
		// }
	};
	
	function import$(obj, src){
		var own = {}.hasOwnProperty;
		for (var key in src) if (own.call(src, key)) obj[key] = src[key];
		return obj;
	}
	function importAll$(obj, src){
		for (var key in src) obj[key] = src[key];
		return obj;
	}
	
	
	return {
		usdc_to_usdc_velas_swap: usdc_to_usdc_velas_swap, 
		usdc_velas_to_usdc_swap: usdc_velas_to_usdc_swap, 
		busd_velas_to_busd_swap: busd_velas_to_busd_swap, 
		busd_to_busd_velas_swap: busd_to_busd_velas_swap,
		eth_usdtUsdt_velasSwap : eth_usdtUsdt_velasSwap, 
		usdt_velasEth_usdtSwap : usdt_velasEth_usdtSwap,
		vlx_evm_to_vlx_erc20_swap: vlx_evm_to_vlx_erc20_swap,
		vlx_erc20_to_velas_swap: vlx_erc20_to_velas_swap,
		eth_to_velas_eth_swap: eth_to_velas_eth_swap,
		velas_eth_to_eth_swap: velas_eth_to_eth_swap,
		bsc_velas_to_velas_evm_swap: bsc_velas_to_velas_evm_swap,
		velas_evm_to_bsc_swap: velas_evm_to_bsc_swap,
		heco_to_velas_evm_swap: heco_to_velas_evm_swap,
		velas_evm_to_heco_swap: velas_evm_to_heco_swap,
		getBridgeInfo: getBridgeInfo,
		isNotBridge: isNotBridge
	}
}

 