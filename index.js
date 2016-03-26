var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var counter = 0;

app.use(bodyParser.urlencoded({ extended: true }));

function log (req, res) {
   console.log(['[', new Date().toISOString(), '] ', req.method, ' request from ', req.ip].join(''));
}
function htmlgen(lastinc, msg, err) {
   msg = msg || '';
   return [ "<!DOCTYPE html>",
      , '<html>'
      , '<head>'
         , '<meta charset="utf-8" />'
         , '<meta name="viewport" content="width=device-width, initial-scale=1" />'
         , '<title>Express.js Counter</title>'
         , '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />'
      , '</head>'
      , '<body>'
      , '<div class="container">'
         , '<div class="row">'
            , '<div class="col-xs-8 col-xs-offset-2">'
               , '<h1>Express.js Counter</h1>'
               , '<p>Current value is <strong class="text-success">', counter, '</strong></p>'
               , '<p class="', err ? "text-danger" : "text-primary", '">', msg, '</p>'
               , '<form class="form" method="post">'
                  , '<div class="form-group', err ? " has-error" : '', '">'
                  , '<label class="control-label">Incremental Value:</label>'
                  , '<input class="form-control" autocomplete="off"'
                        , ' value="', lastinc, '"'
                        , ' name="inc" type="text" />'
                  , '</div>'
                  , '<input class="btn btn-primary" type="submit" value="Increment" />'
               , '</form>'
            , '</div>' // col
         , '</div>' // row
      , '</div>' // container
      , '</body>'
      , '</html>'
      ].join('');
}

app.get('/', function(req, res) {
   log(req, res);
   res.send(htmlgen(1, null));
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
   res.send(htmlgen(lastinc, msg, err));
});

app.listen(5900);
