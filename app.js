var http = require('http');
var https = require('https');
var qs = require('querystring');
var express = require("express");
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.ect' });
var app = express();
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.use(express.static(__dirname + '/public'));

app.get("/",function(req,res){
  res.render("index.ect");
});
app.get("/translate",function(req,res){
  if(req.query.text){
    var text = req.query.text;
    getAccessToken(function (token) {
      translate(token, text, function (translated) {
        res.send(translated);
      });
    });
  }
});
function getAccessToken(callback) {
  var body = '';
  var req = https.request({
    host: 'datamarket.accesscontrol.windows.net',
    path: '/v2/OAuth2-13',
    method: 'POST'
    }, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      }).on('end', function () {
        var resData = JSON.parse(body);
        callback(resData.access_token);
      });
    }).on('error', function (err) {
      console.log(err);
    });
  var data = {
    'client_id': 'client id',
    'client_secret': 'input your app password',
    'scope': 'http://api.microsofttranslator.com',
    'grant_type': 'client_credentials'
  };
  req.write(qs.stringify(data));
  req.end();
}

function translate(token, text, callback) {
  var options = '&to=en' + '&text=' + qs.escape(text) + '&oncomplete=translated';
  var body = '';
  var req = http.request({
    host: 'api.microsofttranslator.com',
    path: '/V2/Ajax.svc/Translate?' + options,
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    }
  }, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    }).on('end', function () {
      eval(body);
    });
  }).on('error', function (err) {
    console.log(err);
  });
  req.end();
  function translated(text) {
    callback(text);
  }
}

app.listen(3000);