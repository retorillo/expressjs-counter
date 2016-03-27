var express = require('express');
var bodyParser = require('body-parser');
var pug = require('pug');
var app = express();
var counter = 0;

app.use(bodyParser.urlencoded({ extended: true }));

var indexpug = pug.compileFile("index.pug");

function log (req, res) {
  console.log(['[', new Date().toISOString(), '] ', req.method, ' request from ', req.ip].join(''));
}

app.get('/', function(req, res) {
  log(req, res);
  res.send(indexpug({ counter: counter, lastinc: 1, msg: '', err: false }));
});

app.post('/', function(req, res) {
  log(req, res);
  var msg = null;
  var err = false;
  var lastinc = 0;
  if (req.body && req.body.inc) {
    var trimed = req.body.inc.replace(/(^\s*)|(\s*$)/g, '');
    if (err = !/^-?[0-9]+(\.[0-9]*)?$/.test(trimed))
      msg = ['"', lastinc = trimed, "' cannnot be parsed to numerical data." ].join('');
    else
      msg = [counter, '+', lastinc = parseFloat(trimed), '=', counter += lastinc].join(' ');
  }
  else {
    msg = "Unexpected post request.";
  }
  res.send(indexpug({ counter: counter, lastinc: lastinc, msg: msg, err: err }));
});

app.listen(5900);
