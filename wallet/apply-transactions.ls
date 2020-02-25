require! {
    \prelude-ls : { sort-by, reverse, filter }
}
module.exports = (store)->
    filt  = store.current.filter
    filt2 = store.current.filter-val.apply
    filter-val = (tx)->
        return yes if (filt2 ? "").length is 0
        (tx.from ? "").index-of(filt2) > -1 or (tx.to ? "").index-of(filt2) > -1
    filter-txs = (tx)->
        return yes if filt.index-of('*') > -1
        { type, token } = tx
        r = type in filt and token in filt
        r2 = filter-val tx
        r and r2

    store.transactions.applied =
        store.transactions.all
            |> filter filter-txs
            |> sort-by (.time)
            |> reverse
    # console.log \tx-length, store.transactions.all.length
    # console.log \atx-length, store.transactions.applied.length
