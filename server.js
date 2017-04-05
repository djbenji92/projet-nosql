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


app.use('/styles', express.static(__dirname + '/styles'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/index.html');
});

app.get('/template', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/template.html');
});

app.get('/highchart', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/highchart.html');
});

function searchAndAddTweet(params){
  client.get('search/tweets', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);

			var insertDocuments = function(db, callback) {
			  // Get the documents collection
			  var collection = db.collection('tweets');
			  // Insert some documents
			  collection.insertMany([
			    tweets.statuses
			  ], function(err, result) {
			    callback(result);
			  });
			}

			var url = 'mongodb://localhost:27017/projet-nosql';
			// Use connect method to connect to the server
			MongoClient.connect(url, function(err, db) {
			  insertDocuments(db, function() {
          console.log("Nouvelle insertion réalisé");
			    db.close();
			  });
			});

      const nombreTweet = tweets.search_metadata.count;
      const lastId = tweets.statuses[0].id;
      const obj = {
        nbTweet: nombreTweet,
        id: lastId
      };

      return obj;

	  } else{
			console.log(error);
		}
	});
}

app.get('/api/twitter/recuperation', function(req, res){
	console.log("recherche de tweet...");
	const params = {q: 'fillon', lang:"fr", count:"100", result_type: "popular"};
	client.get('search/tweets', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);

			var insertDocuments = function(db, callback) {
			  // Get the documents collection
			  var collection = db.collection('tweets');
			  // Insert some documents
        /*
        collection.insertMany([
          tweets
          //tweets.statuses
        ],
        */
			  collection.insertMany(
          tweets.statuses
			  , function(err, result) {
			    callback(result);
			  });

        //var jsonparser = JSON.parse(tweets);

        /*for(tweet in tweets.statuses){
          console.log(tweet);
        }*/
        /*console.log('---------------------------------------------------');
        console.log(tweets.statuses);*/
        /*tweets.forEach(function(tweet){
          console.log(tweet);
        });*/
			}

			var url = 'mongodb://localhost:27017/projet-nosql';
			// Use connect method to connect to the server
			MongoClient.connect(url, function(err, db) {
			  console.log("Connected successfully to server");
        console.log("nb tweets : " + tweets.statuses.length );
			  insertDocuments(db, function() {
			    db.close();
			  });
			});

      var i = tweets.search_metadata.count;
      //const nombreTweet = tweets.search_metadata.count;
      const lastId = tweets.statuses[0].id;
      //console.log(nombreTweet);


      //const idFinal = tweets.search_metadata.next_results.split("=")[1].split('&')[0];
    /*  while(i < 1500){

        const newParams = {q: 'fillon', lang:"fr", count:"100", result_type: "popular", since_id: lastId}
        const newResult = searchAndAddTweet(newParams);

        i = i + 100;
        //i = i + newResult.nbTweet;

        console.log(lastId);
        //console.log("CODE 111111111111111111111 i : " . newResult.id);

      }*/

      //TEST
      //var count = 0;
      //FIN TEST


      //recuperation de l'id de fin

      //console.log("max result : " + idFinal);

      /*const nombreTweet = tweets.search_metadata.count;
      const lastId = tweets.statuses[0].id;
      console.log('--------------------RECUP ID--------------------')
      console.log(lastId);
      console.log();
      console.log('identifiant tableau dernier tweet : ' + nombreTweet);*/

	  } else{
			console.log(error);
		}
	});

	res.send('page de recuperation de tweet');
});

app.get('/api/twitter/popularite', function(req, res){

  var url = 'mongodb://localhost:27017/projet-nosql';
  // Use connect method to connect to the server
  var p1 = new Promise(function(resolve, reject){
    parcourCandidat();
    resolve("Succes");
  });

  p1.then(
    function(resolve, reject){
      console.log('parcour des candidats terminé');
    }, function(err){
      console.log("erreur parcour candidat");
    }
  )

  var countMacron = 0;
  var candidats = ['Macron', 'Fillon', 'Le Pen'];
  var data = [];
  candidats.forEach(function(candidat){
    var actualCandidat = candidat;

    var findDocuments = function(db, callback) {
      // Get the documents collection
      var collection = db.collection('tweets');
      // Find some documents
      var regexActuel = ".*" + actualCandidat;

      collection.find({"text": {$regex: regexActuel}}).count(function(err, count) {
          console.log(count);
          callback(count);
          countMacron = count;
        })
    }

    var f1 = new Promise(function(resolve, reject){
      MongoClient.connect(url, function(err, db) {
        console.log("Connected à MongoDB - Recherche de tweet");
        findDocuments(db, function(count) {
          db.close();
          countMacron = count;
          data.push({'name':actualCandidat, 'y':count});
          console.log(count);
          resolve("Succes");
        });
      })
    });

    f1.then(
      function(resolve, reject){
        console.log('ok');
        console.log(countMacron);
        if(data.length == candidats.length){
          res.json(data);
        }
      }, function(err){
        console.log("nok");
      }
    );

  });

});



const server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
