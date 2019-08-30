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

exports.addUser = function (id, passwords, nick, email, phone, callback) {
    var members = database.collection('members');

    members.insertMany([{ "id": id, "passwords": passwords, "nickname": nick, "email": email, "phone": phone, "point": 0 }],
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
}; //회원가입

exports.sameUser = function (id, callback) {
    var members = database.collection('members');
    var result = members.find({ "id": id });

    result.toArray(
        function (err, data) {
            if (err) {
                callback(err, null);
                return;
            }

            if (data.length > 0) {
                console.log('일치하는 유저: ' + result.count());
                console.log(data);
                callback(null, data);
            }
            else {
                console.log('일치하는 유저 없음');
                callback(null, true);
            }
        }

    );
}; //아이디 중복 확인

exports.profile = function (id, callback) {
    var members = database.collection('members');

    var result = members.find({ "id": id });
    console.log(result);
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
}; //마이페이지 프로필 가져오기

exports.editprofile = function (id, password, callback){
    var members = database.collection('members');
    var result = members.updateMany({"id": id}, {$set: {"id": id, "passwords": password}});

    console.log("업데이트 성공!");
    callback(null, true);
}; //프로필 수정