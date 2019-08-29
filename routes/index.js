var express = require('express');
var router = express.Router();
var db = require('../models/loginDB')
var database
var post

//글 불러오기
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, client){
  database = client.db('help');
  post = database.collection('post');
}); 


/* GET home page. */
router.get('/', function(req, res) {
  post.find({}).toArray((err, posts)=>{
    if (req.session.user_id != null) {
      res.render('../views/index.ejs', { islogin: 'login', post: posts});
    } else {
      res.render('../views/index.ejs', { islogin: 'no', post: posts});
    }
  })
}); //메인 화면(로그인 페이지)

router.get('/findpw', function (req, res) {
  res.render('../views/Login_Helper/FindPW.ejs')
}); //비밀번호 찾기 창

router.get('/signup', function (req, res) {
  res.render('../views/Login_Helper/SignUp.ejs');
}); //회원가입 창

router.get('/login', function (req, res) {
  res.render('../views/User/login.ejs');
});

router.get('/Mypage', function(req, res){
  res.render('../views/User/MyPage.ejs');
});

router.post('/writebooks', (req, res)=>{
  try{
    var date = new Date();
    var writedate = String(date.getFullYear()) + '년 ' + String(date.getMonth() + 1) + '월 ' + String(date.getDate()) + '일';
    var writepost = {title : req.body.title, writedate : writedate, name: req.session.name, post:req.body.post, field: req.body.field, town: req.body.town}
    post.insertOne(writepost);
    res.status(200).send('<script type="text/javascript">alert("글쓰기가 완료되었습니다."); document.location.href="/";</script>');
  }
  catch(exception){
    res.status(401).send('<script type="text/javascript">alert("글쓰기를 실패하였습니다."); document.location.href="/write";</script>');
  }
})

module.exports = router;
