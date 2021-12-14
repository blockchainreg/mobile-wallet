// Generated by LiveScript 1.6.0
(function () {
  var ref$,
    objToPairs,
    pairsToObj,
    each,
    map,
    filter,
    writeFile,
    readFile,
    exists,
    Command,
    translate,
    newword,
    sync,
    filename,
    cb,
    program;
  (ref$ = require('prelude-ls')),
    (objToPairs = ref$.objToPairs),
    (pairsToObj = ref$.pairsToObj),
    (each = ref$.each),
    (map = ref$.map),
    (filter = ref$.filter);
  (ref$ = require('fs')),
    (writeFile = ref$.writeFile),
    (readFile = ref$.readFile),
    (exists = ref$.exists);
  Command = require('commander').Command;
  translate = require('./translate.js');
  newword = require('./newword.js');
  sync = require('./sync.js');
  readFile = require('fs').readFile;
  filename = './langs/langs.json';
  cb = console.log;
  program = new Command();
  program.option('--newword <word>', 'enter word');
  program.option(
    '--sync',
    'sync all words with https://docs.google.com/spreadsheets/d/1CsISZgog2swmXOarx418BNN-Zy_9zBptWOXqsutzRWs/edit#gid=0'
  );
  program.parse(process.argv);
  readFile(filename, function (err, content) {
    var body;
    if (err != null) {
      return cb(err);
    }
    body = JSON.parse(content);
    return newword(
      {
        filename: filename,
        program: program,
        body: body,
      },
      function (err, body) {
        var languages;
        if (err != null) {
          return cb(err);
        }
        languages = (function (it) {
          return it.languages;
        })(body);
        return translate(filename, languages, body, function (err, result) {
          if (err != null) {
            return cb(err);
          }
          return sync(
            {
              filename: filename,
              program: program,
            },
            function (err) {
              if (err != null) {
                return cb(err);
              }
              return cb(null);
            }
          );
        });
      }
    );
  });
}.call(this));
