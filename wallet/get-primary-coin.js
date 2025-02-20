// Generated by LiveScript 1.5.0
(function () {
  var ref$,
    head,
    drop,
    take,
    find,
    loadFirst,
    max,
    getList,
    getImportant,
    getWalletByIndex;
  (ref$ = require('prelude-ls')),
    (head = ref$.head),
    (drop = ref$.drop),
    (take = ref$.take),
    (find = ref$.find);
  loadFirst = function (store) {
    if (store.coins.length === 0) {
      return null;
    }
    return head(store.coins);
  };
  max = 4;
  getList = function (store) {
    var ref$, list;
    if (((ref$ = store.current) != null ? ref$.account : void 8) == null) {
      return [];
    }
    list = store.current.list;
    return take(max)(drop(list)(store.current.account.wallets));
  };
  getImportant = function (store) {
    var this$ = this;
    if (store.coins.length === 0) {
      return null;
    }
    return find(function (it) {
      var ref$;
      return (ref$ = it.branding) != null ? ref$.important : void 8;
    })(store.coins);
  };
  getWalletByIndex = function (store) {
    var ref$, send, account, walletIndex, items;
    (ref$ = store.current),
      (send = ref$.send),
      (account = ref$.account),
      (walletIndex = ref$.walletIndex);
    items = getList(store);
    return (ref$ = items[walletIndex]) != null ? ref$.coin : void 8;
  };
  module.exports = function (store) {
    var ref$, send, account, walletIndex, ref1$;
    (ref$ = store.current),
      (send = ref$.send),
      (account = ref$.account),
      (walletIndex = ref$.walletIndex);
    return (ref$ = getImportant(store)) != null
      ? ref$
      : (ref$ =
          send != null
            ? (ref1$ = send.wallet) != null
              ? ref1$.coin
              : void 8
            : void 8) != null
      ? ref$
      : (ref$ = getWalletByIndex(store)) != null
      ? ref$
      : loadFirst(store);
  };
}.call(this));
