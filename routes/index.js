var express = require('express');
var router = express.Router();
var db = require('../models/writeDB');

/* GET home page. */
router.get('/', function(req, res) {
  db.getpost(
    function (err, data) {
      if (req.session.user_id != null) {
        res.render('../views/index.ejs', { islogin: 'login', post: data})
      } else {
        res.render('../views/index.ejs', { islogin: 'no', post: data});
      } 
  });
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

router.get('/test', function (req, res) {
  res.render('../views/User/test.ejs');
});

router.get('/mypage', function(req, res){
  if (req.session.user_id != null) {
    var id = req.session.user_id;

    db.profile(id, function (err, show) {
      if (err) {
        console.log('오류 발생!');
        res.send('<script type="text/javascript">alert("에러가 발생했습니다."); document.location.href="/";</script>');
        res.end();
        return;
      }

      if (show) {
        console.log("이름: " + show[0].nickname);
        res.render('../views/User/MyPage.ejs', { name: show[0].nickname, islogin: 'login'});
        res.end();
      }
    });
  } else {
    res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
    res.end();
  }
});

router.get('/writebooks', function(req, res){
  res.render('../views/Post/writepost.ejs');
});

router.post('/writebooks', function(req, res){
  // try{
  
  //   var writepost = {title : req.body.Title, writedate : writedate, name: req.session.Name, post: req.body.Post, field: req.body.Field, town: req.body.Town}

  //   // console.log('제목 : ' + title + ', 수정 날짜 : ' + writedate + ', 닉네임: ' + name + ', 내용: ' + post + ', 분류: ' + field + ', 지역: ' + town);

  //   post.insertOne(writepost);
  //   res.send('<script type="text/javascript">alert("글쓰기가 완료되었습니다."); document.location.href="/";</script>');
  // }
  // catch(exception){
  //   res.send('<script type="text/javascript">alert("글쓰기를 실패하였습니다."); document.location.href="/writebooks";</script>');
  // }
  var title = req.body.title || req.query.title;
  var date = new Date();
  var writedate = String(date.getFullYear()) + '년 ' + String(date.getMonth() + 1) + '월 ' + String(date.getDate()) + '일';
  var name = req.body.name || req.query.name;
  var post = req.body.post || req.query.post;
  var field = req.body.field || req.query.field;
  var town = req.body.town || req.query.town;
  console.log('제목 : ' + title + ', 날짜 : ' + writedate + ', 이름: ' + name + ', 내용: ' + post + ', 분류: ' + field + ', 지역: ' + town);

      if (db) {
        db.addpost(title, writedate, name, post, field, town,
          function (err, result) {
            if (err) {
              console.log(err);
              res.send('<script type="text/javascript">alert("에러가 발생했습니다.")document.location.href="/";</script>');
              res.end();
              return;
            }

            if (result) {
              console.log("글쓰기 성공!");
              res.send('<script type="text/javascript">alert("글이 정상적으로 등록되었습니다!"); document.location.href="/";</script>');
              res.end();
              return;
            } else {
              console.log('문제 발생!');
              res.send('<script type="text/javascript">alert("추가에 실패했습니다.")document.location.href="/";</script>');
              res.end();
              return;
            }
          }
        );
      } else {
        console.log('DB 연결 안됨');
        res.send('<script type="text/javascript">alert("DB가 연결되어 있지 않습니다!"); document.location.href="/";</script>');
        res.end();
        return;
      }
});  //글 작성

module.exports = router;
