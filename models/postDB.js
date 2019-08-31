const MongoClient = require('mongodb').MongoClient;
const dbName = 'help'; // Database Name

var database;

exports.connectDB = function () {
    var databaseURL = 'mongodb://localhost:27017';
    MongoClient.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true },
        function (err, client) {
            if (err) {
                console.log('MongoDB 접속 실패: ', err);
                return;
            }
            database = client.db(dbName);
            console.log('MongoDB 접속 성공: ' + databaseURL);
        }
    );
}; //DB 연결

exports.getpost = function(callback){
    var post = database.collection('post');
    var result = post.find({});

    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }

            if (data.length > 0) {
                callback(null, data);
            }
            else {
                callback(null, null);
            }
        }

    );
}; //글 가져오기

exports.readpost = function(query, callback){
    var post = database.collection('post');
    post.findOne(query, (err, docs)=>{
        if(err){
            console.log(err.message);
        }else{
            callback(err, docs);
        }
    })
}

exports.getmypost = function (name, callback) {
    var post = database.collection('post');
    var result = post.find({"name": name});
    
    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            if (data.length > 0) {
                callback(null, data);
            }
            else {
                callback(null, null);
            }
        }

    );
}; //자신의 글

exports.addpost = function (obj, callback) {
    var posts = database.collection('post');
    posts.insertMany([{ "title": obj.title, "writedate": obj.writedate, "name": obj.name,
     "post": obj.post, "field": obj.field, "town": obj.town,
    "latitude":parseFloat(obj.latitude), "longitude":parseFloat(obj.longitude), "key":obj.key }],
        function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }
            if (result.insertedCount > 0) {
                callback(null, result);
            }
            else {
                callback(null, null);
            }
        }
    );
}; //글 작성하기
