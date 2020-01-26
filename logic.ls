require!{
	\prelude-ls : { keys, map }
}

const build-coin = (token)=> {
          token: token
          logo: web3t[token].getConfig!.image
          balance: "0"
}

export refreshWallets = ({ store, web3t }, cb)->
	store.wallets =
		web3t
			|> keys 
			|> map build-coin