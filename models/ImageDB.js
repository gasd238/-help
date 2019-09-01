const MongoClient = require('mongodb').MongoClient;
var databaseUrl = 'mongodb://localhost:27017';
var ObjectId = require('mongodb').ObjectID;
var multer = require('multer')
var fs = require('fs-extra')
var upload = multer({ limits: { fileSize: 2000000 }, dest: '/uploads/' })
var db;

exports.connectDB = function () {
    MongoClient.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, database) {
        if (err) throw err;

        console.log('MongoDB 접속 성공: ' + databaseUrl);
        db = database.db('help');
    });
}; //DB 연결

exports.uploadPicture = function (filepath, description, mimetype, filesize, callback) {
    // read the img file from tmp in-memory location
    var newImg = fs.readFileSync(filepath);
    // encode the file as a base64 string.
    var encImg = newImg.toString('base64');
    // define your new document
    var newItem = {
        description: description,
        contentType: mimetype,
        size: filesize,
        img: Buffer(encImg, 'base64')
    };
    db.collection('image')
        .insert(newItem, function (err, result) {
            callback(err, result);
        });
}

exports.getPicture = function (filename, callback) {
    var filename = filename;

    db.collection('image')
        .findOne({ '_id': ObjectId(filename) }, function (err, results) {
            callback(err, results);
    });
}