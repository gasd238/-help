const MongoClient = require('mongodb').MongoClient;
const dbName = 'help'; // Database Name

var database;

exports.connectDB = function () {
    var databaseURL = 'mongodb://localhost:27017';
    MongoClient.connect(databaseURL, { useNewUrlParser: true },
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

exports.authUser = function (id, password, callback) {
    var members = database.collection('members');
    var result = members.find({ "id" : id, "passwords" : password });

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

}; //로그인

exports.findPassword = function (id, callback) {
    var members = database.collection('members');
    var result = members.find({ "id": id });
    
    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }

            if (data.length > 0) {
                console.log('사용자를 찾았어요: ' + result.count());
                callback(null, data);
            }
            else {
                console.log('사용자를 찾지 못했어요..');
                callback(null, null);
            }
        }

    );
}; //비밀번호 찾기