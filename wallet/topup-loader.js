// Generated by LiveScript 1.5.0
(function () {
  var ref$,
    filter,
    reverse,
    head,
    foldl,
    find,
    getInstallList,
    getPrimaryCoin,
    common,
    verifyFields,
    getMethods,
    support,
    replace,
    put,
    filterByImportance,
    getTopupAddress,
    toString$ = {}.toString,
    out$ = (typeof exports != 'undefined' && exports) || this;
  (ref$ = require('prelude-ls')),
    (filter = ref$.filter),
    (reverse = ref$.reverse),
    (head = ref$.head),
    (foldl = ref$.foldl),
    (find = ref$.find);
  getInstallList = require('./install-plugin.js').getInstallList;
  getPrimaryCoin = require('./get-primary-coin.js');
  common = [
    require('../web3t/plugins/gobyte-topup.js'),
    require('../web3t/plugins/trycrypto-topup.js'),
  ];
  verifyFields = function (t) {
    if (t.type !== 'topup') {
      return false;
    }
    if (t.enabled !== true) {
      return false;
    }
    if (toString$.call(t.topupCoinsByMask).slice(8, -1) !== 'String') {
      return false;
    }
    if (toString$.call(t.networks).slice(8, -1) !== 'String') {
      return false;
    }
    if (toString$.call(t.token).slice(8, -1) !== 'String') {
      return false;
    }
    if (toString$.call(t.image).slice(8, -1) !== 'String') {
      return false;
    }
    if (toString$.call(t.address).slice(8, -1) !== 'String') {
      return false;
    }
    return true;
  };
  getMethods = function (cb) {
    var base;
    base = filter(verifyFields)(common);
    return getInstallList(function (err, items) {
      var installed,
        all,
        this$ = this;
      if (err != null) {
        return cb(err);
      }
      installed = filter(function (it) {
        return it.type === 'topup';
      })(items);
      all = installed.concat(base);
      return cb(null, all);
    });
  };
  support = curry$(function (arg$, arg1$) {
    var token, network, topupCoinsByMask, networks;
    (token = arg$.token), (network = arg$.network);
    (topupCoinsByMask = arg1$.topupCoinsByMask), (networks = arg1$.networks);
    if (networks.split(', ').indexOf(network) === -1) {
      return false;
    }
    if (topupCoinsByMask === '*') {
      return true;
    }
    if (topupCoinsByMask.split(', ').indexOf(token) > -1) {
      return true;
    }
    return false;
  });
  replace = function (params) {
    return function (str, key) {
      var mask, val, ref$;
      mask = '{' + key + '}';
      val = (ref$ = params[key]) != null ? ref$ : '';
      return str.replace(mask, val);
    };
  };
  put = curry$(function (params, address) {
    var keys;
    keys = Object.keys(params);
    if (keys.length === 0) {
      return address;
    }
    return foldl(replace(params), address)(keys);
  });
  filterByImportance = function (store) {
    return function (arr, item) {
      var coin,
        all,
        ref$,
        important,
        this$ = this;
      coin = getPrimaryCoin(store);
      all = arr.concat([item]);
      if (
        (coin != null
          ? (ref$ = coin.branding) != null
            ? ref$.topup
            : void 8
          : void 8) == null
      ) {
        return all;
      }
      important = find(function (it) {
        var ref$;
        return (
          it.token ===
          (coin != null
            ? (ref$ = coin.branding) != null
              ? ref$.topup
              : void 8
            : void 8)
        );
      })(all);
      if (important != null) {
        return [important];
      }
      return all;
    };
  };
  out$.getTopupAddress = getTopupAddress = function (store, arg$, cb) {
    var token, network, address;
    (token = arg$.token), (network = arg$.network), (address = arg$.address);
    return getMethods(function (err, methods) {
      var method;
      if (err != null) {
        return cb(err);
      }
      method = head(
        reverse(
          filter(
            support({
              token: token,
              network: network,
            })
          )(foldl(filterByImportance(store), [])(methods))
        )
      );
      if (method == null) {
        return null;
      }
      return put({
        token: token,
        address: address,
        network: network,
      })(method.address);
    });
  };
  function curry$(f, bound) {
    var context,
      _curry = function (args) {
        return f.length > 1
          ? function () {
              var params = args ? args.concat() : [];
              context = bound ? context || this : this;
              return params.push.apply(params, arguments) < f.length &&
                arguments.length
                ? _curry.call(context, params)
                : f.apply(context, params);
            }
          : f;
      };
    return _curry();
  }
}.call(this));
