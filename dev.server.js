'use strict';

(function firebaseServer(){
	var FirebaseServer = require('firebase-server');
	var server = new FirebaseServer(5000, 'localhost.firebaseio.test');
	server.setRules(require('./firebase.rules'));
})();

var express = require('express');
var app = express();

app.use('/vendor', express.static('./node_modules'));
app.use('/', express.static('./public'));

app.get('/', function(req, res){
	app.sendFile('./index.html');
});

app.listen('3000', function(){
	console.log('Running on 3000.');
});
