require! {
    \./calc-wallet.js
    \./transactions.js : { load-all-transactions }
    \./load-rates.js
    \./workflow.js : { run, task }
}
refresh-wallet = (web3, store, cb)->
    store.current.refreshing = yes
    task1 = task (cb)->
        load-rates store, cb
    task2 = task (cb)->
        load-all-transactions store, cb
    task3 = task (cb)->
        calc-wallet store, cb 
    <- run [{ task1, task2 }, task3] .then
    store.current.refreshing = no
    cb null
module.exports = refresh-wallet