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

exports.GoodsList = function (callback) {
    var goods = database.collection('goods');
    var result = goods.find();
    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }
            if (data) {
                callback(null, data);
                console.log('있음');
            }
            else {
                callback(null, null);
                console.log('없음');
            }
        }
    );

}; //로그인
