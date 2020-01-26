require! {
    \./browser/window.js
    #\./pages.js
    \./seed.js : { saved }
    \./oldseed.js
    \mobx : { transaction }
    \./scroll-top.js
}
pages = {}
get-page = (store, page, prev)->
    return page if page isnt \:init
    return \terms if prev is \newseed
    stage2 = not saved!
    store.current.seed = oldseed! if stage2
    return \newseed if stage2
    \wallets
init-control = (scope, name, cb)->
    #<- set-timeout _, 1
    control = pages[name] 
    return cb null if typeof! control?init isnt \Function
    control.init scope, cb
focus-control = (scope, name, cb)->
    scroll-top!
    control = pages[name] 
    return cb null if typeof! control?focus isnt \Function
    control.focus scope, cb
module.exports = (store, web3t, page)->
    return alert "store is required" if not store?
    return alert "web3t is required" if not web3t?
    scroll-top!
    <- set-timeout _, 1
    prev = store.current.page
    store.current.page = \loading
    store.current.loading = yes
    name = get-page store, page, prev
    <- init-control { store, web3t }, name
    store.current.page = name
    store.current.loading = no
    <- focus-control { store, web3t }, name