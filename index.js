var express = require('express');
function log (req, res) {
  console.log(['[', new Date().toISOString(), '] ', req.method, ' request from ', req.ip].join(''));
}
var bodyParser = require('body-parser');
var pug = require('pug');
var app = express();
var counter = 0;

var logplease = require('logplease');
var logger = logplease.create('express', { color: logplease.Colors.yellow });

app.use(bodyParser.urlencoded({ extended: true }));

var indexpug = pug.compileFile("index.pug");

app.get('/', function(req, res) {
  logger.info(`${req.method} from ${req.ip}`);
  log(req, res);
  res.send(indexpug({ counter: counter, lastinc: 1, msg: '', err: false }));
});

app.post('/inc', function(req, res) {
  log(req, res);
  var msg = null;
  var err = false;
  var lastinc = 0;
  if (req.body && req.body.incval) {
    var trimed = req.body.incval.replace(/(^\s*)|(\s*$)/g, '');
    if (err = !/^-?[0-9]+(\.[0-9]*)?$/.test(trimed))
      msg = ['"', lastinc = trimed, "' cannnot be parsed to numerical data." ].join('');
    else
      msg = [counter, '+', lastinc = parseFloat(trimed), '=', counter += lastinc].join(' ');
  }
  else {
    msg = "Unexpected post request.";
  }
  res.json({ count: counter, msg: msg, err: err });
});

app.listen(5900);
