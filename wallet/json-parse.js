// Generated by LiveScript 1.6.0
(function () {
  module.exports = function (obj, cb) {
    var err;
    try {
      return cb(null, JSON.parse(obj));
    } catch (e$) {
      err = e$;
      return cb(err);
    }
  };
}.call(this));
