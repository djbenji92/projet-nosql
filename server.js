const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
//const mongoose = require('mongoose');
const Twitter = require('twitter');

const app = express();
const MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/projet-nosql2';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db.close();
});



const client = new Twitter({
	consumer_key: 'ZT9bytz9m5drtuKSqAlw7c1rK',
	consumer_secret: 'hgeAQUlcV2m52ssEVUzPcWGEJIIL9A2BPLYX7aZXagl2BWTB6A',
	access_token_key: '3172502963-euf7wilvY7ml9g7WPOZ1MXtXh3eoc8a7Na7FB17',
	access_token_secret: 'n1e7ucnHullRYK7g9l4I21yNllBDZKrCdKICIqHL0phAj'
})


app.get('/', function (req, res) {
	console.log(db);
	res.sendFile(__dirname + '/index.html');
});

app.get('/api/twitter/recuperation', function(req, res){
	console.log("recherche de tweet...");
	const params = {q: 'presidentiel', lang:"fr", count:"100", result_type: "popular"};
	client.get('search/tweets', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);

			var insertDocuments = function(db, callback) {
			  // Get the documents collection
			  var collection = db.collection('tweets');
			  // Insert some documents
			  collection.insertMany([
			    tweets
			  ], function(err, result) {
			    callback(result);
			  });
			}

			var url = 'mongodb://localhost:27017/projet-nosql';
			// Use connect method to connect to the server
			MongoClient.connect(url, function(err, db) {
			  console.log("Connected successfully to server");
			  insertDocuments(db, function() {
			    db.close();
			  });
			});

	  } else{
			console.log(error);
		}
	});

	res.send('page de recuperation de tweet');
});



const server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
