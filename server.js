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

app.get('/popularite', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/stats-popularite.html');
});

app.get('/favoris', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/stats-favoris.html');
});

app.get('/appreciation', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/stats-appreciation.html');
});

app.get('/prediction', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/stats-prediction.html');
});

app.get('/influence', function (req, res) {
	//console.log(db);
	res.sendFile(__dirname + '/stats-influence.html');
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
	const params = {q: 'Fillon', lang:"fr", count:"100"};
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
      while(i < 1500){

        const newParams = {q: 'Fillon', lang:"fr", count:"100", since_id: lastId}
        const newResult = searchAndAddTweet(newParams);

        i = i + 100;
        //i = i + newResult.nbTweet;

        console.log(lastId);
        //console.log("CODE 111111111111111111111 i : " . newResult.id);

      }

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

//Get Tweets from the all world
app.get('/api/twitter/recuperation-mondiale', function(req, res){
  console.log("recherche de tweet...");
  const params = {q: 'fillon+OR+macron+OR+Poutou+OR+Le pen+OR+Hamon+OR+Melenchon+OR+Dupont-Aignan', count:"100"};
  client.get('search/tweets', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);

      var insertDocuments = function(db, callback) {
        // Get the documents collection
        var collection = db.collection('tweetsworld');
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
      while(i < 1500){

        const newParams = {q: 'fillon+OR+macron+OR+Poutou+OR+Le pen+OR+Hamon+OR+Melenchon+OR+Dupont-Aignan', count:"100", since_id: lastId}
        const newResult = searchAndAddTweet(newParams);

        i = i + 100;
        //i = i + newResult.nbTweet;

        console.log(lastId);
        //console.log("CODE 111111111111111111111 i : " . newResult.id);

      }

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

  var candidats = ['Macron', 'Fillon', 'Le Pen', 'Hamon', 'Melenchon', 'Dupont-Aignan', 'Poutou'];

  var data = [];
  candidats.forEach(function(candidat){
    var actualCandidat = candidat;

    var findDocuments = function(db, callback) {
      // Get the documents collection
      var collection = db.collection('presidentielle');
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

app.get('/api/twitter/count-tweets', function(req, res){
  var url = 'mongodb://localhost:27017/projet-nosql';

  var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('tweets');
    // Find some documents

    collection.find().count(function(err, count) {
        console.log(count);
        callback(count);
        countMacron = count;
      })
  }

  MongoClient.connect(url, function(err, db) {
    console.log("Connected à MongoDB - compte les tweets");
    findDocuments(db, function(count) {
      db.close();
      res.json(count);
      //data.push(count);
      console.log(count);
    });
  });

});

//Candidates popularity through the world
app.get('/api/twitter/popularite-mondiale', function(req, res){

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

  var countTweets = 0;

  //var candidats = ['Macron', 'Fillon', 'Le Pen', 'Hamon', 'Melenchon', 'Dupont-Aignan', 'Poutou'];

  //var data = '';
  //candidats.forEach(function(candidat){
    //var actualCandidat = candidat;

    var findDocuments = function(db, callback) {
      // Get the documents collection
      var collection = db.collection('tweetsworld');
      // Find some documents
      //var regexActuel = ".*" + actualCandidat;

      /**************       Regex à changer     **********************************/
      /*db.tweetsworld.aggregate([
        { $group: {
           _id: '$lang',
           count: {$sum: 1}
         }},

         {$sort: {
          count: -1
      }}
      ]);*/
      collection.aggregate([
          { $group: {
             _id: '$lang',
             count: {$sum: 1}
           }},

           {$sort: {
            count: -1
        }}
      ],
      function(err, count) {
          console.log(count);
          callback(count);
          countTweets = count;
      });

    }

    var f1 = new Promise(function(resolve, reject){
      MongoClient.connect(url, function(err, db) {
        console.log("Connected à MongoDB - Recherche de tweet");
        findDocuments(db, function(count) {
          db.close();
          countTweets = count;
          data = count;
          //data.push(count);
          console.log(count);
          resolve("Succes");
        });
      })
    });

    f1.then(
      function(resolve, reject){
        console.log('ok');
        console.log(countTweets);
        //if(data.length == candidats.length){
          res.json(data);
        //}
      }, function(err){
        console.log("nok");
      }
    );

  //});

});

//Tweets retweeted more than 100 times in France by
app.get('/api/twitter/retweeted', function(req, res){

  var url = 'mongodb://localhost:27017/projet-nosql';
  // Use connect method to connect to the server
  var p1 = new Promise(function(resolve, reject){
    parcourCandidat();
    resolve("Succes");
  });

  p1.then(
    function(resolve, reject){
      console.log('calcul des likes terminé');
    }, function(err){
      console.log("erreur calcul des likes")
  });

  var countCandidates = 0;

  var candidats = ['Macron', 'Fillon', 'Le Pen', 'Hamon', 'Melenchon', 'Dupont-Aignan', 'Poutou'];

  var data = [];
  candidats.forEach(function(candidat){
    var actualCandidat = candidat;

    var findDocuments = function(db, callback) {
      // Get the documents collection
      var collection = db.collection('presidentielle');
      // Find some documents
      var regexActuel = ".*" + actualCandidat;

      collection.find({retweet_count: {$gte: 100}, text: {$regex: regexActuel}}).count(function(err, count) {
          console.log(count);
          callback(count);
          countCandidates = count;
        })
    }

    var f1 = new Promise(function(resolve, reject){
      MongoClient.connect(url, function(err, db) {
        console.log("Connected à MongoDB - Recherche de tweet");
        findDocuments(db, function(count) {
          db.close();
          countCandidates = count;
          //data.push({'name':actualCandidat, 'y':count});
          data.push([actualCandidat, count]);
          console.log(data);
          resolve("Succes");
        });
      })
    });

    f1.then(
      function(resolve, reject){
        console.log('ok');
        console.log(countCandidates);
        if(data.length == candidats.length){
          res.json(data);
        }
      }, function(err){
        console.log("nok");
      }
    );

  });

});
//all tweets by person


//recuperation hashtag predisentielle
app.get('/api/twitter/recuperation/presidentielle', function(req, res){
	console.log("recherche de tweet...");
	const params = {q: 'presidentielle', lang:"fr", count:"100", result_type:"recent"};
	client.get('search/tweets', params, function(error, tweets, response) {
	  if (!error) {
	    console.log(tweets);

			var insertDocuments = function(db, callback) {
			  // Get the documents collection
			  var collection = db.collection('presidentielle');
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
      while(i < 1500){
        const newParams = {q: 'presidentielle', lang:"fr", count:"100", result_type:"recent", since_id: lastId}
        const newResult = searchAndAddTweet(newParams);

        i = i + 100;
        //i = i + newResult.nbTweet;

        console.log(lastId);
        //console.log("CODE 111111111111111111111 i : " . newResult.id);

      }

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
//FIN deuxieme recuperation


//tweet aimé ou pas
app.get('/api/twitter/like', function(req, res){

  var url = 'mongodb://localhost:27017/projet-nosql';
  // Use connect method to connect to the server

  var candidats = ['Macron', 'Fillon', 'Le Pen', 'Hamon', 'Melenchon', 'Dupont-Aignan', 'Poutou'];

  var data = [];

  var listeTweet = [];

  candidats.forEach(function(candidat){
    console.log(candidat);
  });


  candidats.forEach(function(candidat){
    var actualCandidat = candidat;

    var findDocuments = function(db, callback) {
      // Get the documents collection
      var collection = db.collection('tweets');
      // Find some documents
      var regexActuel = ".*" + actualCandidat;
      var motPositif = ["fort", "bon", "soutien", "satisfait", "triompher", "réjoui", "bonheur", "joie", "passionnant", "enthousiasme", "idéal", "candidat idéal", "fier", "admirable", "adroit", "atout", "bienveillant" ];
      var motNegatif = ["negatif", "aime pas", "deteste", "stupide", "debile", "aucun", "égoïste", "voleur", "vol", "menteur", "escroc", "amnésique", "flou", "trahi", "trahison"];

      collection.find({"text": {$regex: regexActuel}}).toArray(function(err, results) {
          //console.log(results);
          var countPositif = 0;
          var countNegatif = 0;
          results.forEach(function(result){
            motPositif.forEach(function(mot){
              if(result.text.indexOf(mot) !== -1){
                console.log(mot);
                console.log(result.text);
                countPositif = countPositif +1;
              }
            });
            motNegatif.forEach(function(mot){
              if(result.text.indexOf(mot) !== -1){
                console.log(mot);
                console.log(result.text);
                countNegatif = countNegatif +1;
              }
            });
            //console.log(result.text);
          });
          //console.log(countPositif);
          //console.log(countNegatif);
          data.push({'candidat':actualCandidat, 'countPositif':countPositif, 'countNegatif':countNegatif});
          //console.log(data);
          callback(results);
        })
    }

    var f1 = new Promise(function(resolve, reject){
      MongoClient.connect(url, function(err, db) {
        console.log("Connected à MongoDB - Recherche de tweet");
        findDocuments(db, function(tweets) {
          db.close();
          //listeTweet.push(tweets);
          /*data.push({'name':actualCandidat, 'y':count});
          console.log(count);*/
          resolve("Succes");
        });
      })
    });

    f1.then(
      function(resolve, reject){
        console.log('ok');
        console.log(data);
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
