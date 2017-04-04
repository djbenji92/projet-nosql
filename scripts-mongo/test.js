//mongo localhost:27017/projet-nosql test.js 
var cursor = db.tweets.find();

while(cursor.hasNext()) {
  var obj = cursor.next();
  print("ok");
}
