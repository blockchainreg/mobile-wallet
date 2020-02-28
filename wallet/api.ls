require! {
    \./providers.js
    \mobx : { toJS }
    \prelude-ls : { pairs-to-obj, obj-to-pairs }
}
action = (func)-> (config, cb)->
    return cb "provider is not defined" if not config?network?api?provider?
    provider = providers[config.network.api.provider] ? insight
    func provider, config, cb
export calc-fee = action (provider, config, cb)->
    provider.calc-fee config, cb
export get-keys = action (provider, config, cb)->
  //getKeys is very slow on mobile wallet
  //So we add caching. It is now Implemented is js
  //I bet it can be done sipmplier with standard ls library
    provider.get-keys config, cb
export get-balance = action (provider, config, cb)->
    provider.get-balance config, cb
export get-transactions = action (provider, config, cb)->
    provider.get-transactions config, cb
export create-transaction = action (provider, config, cb)->
    provider.create-transaction config, cb
export push-tx = action (provider, config, cb)->
    provider.push-tx config, cb
