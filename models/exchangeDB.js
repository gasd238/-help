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

}; //굿즈 전부 가져오는 코드

exports.AddGoods = function (obj, callback) {
    var goods = database.collection('goods');
    goods.findOne({G_id:obj.code}, function(err,docs){
        if(docs){
            callback();
        }else{
            goods.insertOne({Name: obj.name, G_id: obj.code, Price: obj.price, Src:`http://localhost/exchange/imgs/${obj.code}.png`},
                function(err, result){
                    if(err){
                        console.log(err.message)
                    }else{
                        console.log('data inserted')
                        callback();
                    }
                })
        }
    });
}; //굿즈 추가하는 코드

exports.LoadGoods = function (obj) {
    var goods = database.collection('goods');
    goods.findOne(obj.query, function(err,docs){
        if(err){
            console.log(err.message)
        }else{
            obj.callback(docs);
        }
    });
}; //굿즈 추가하는 코드