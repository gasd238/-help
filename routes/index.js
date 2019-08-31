var express = require('express');
var router = express.Router();
var writedb = require('../models/writeDB');
var logindb = require('../models/loginDB');

/* GET home page. */
router.get('/', function(req, res) {
  writedb.getpost(
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

router.get('/test2', function (req, res) {
  res.render('../views/User/test2.ejs');
});

router.get('/adminpage', function(req, res){
  logindb.allprofile((err, data)=>{
    console.log(data)
    res.render('../views/User/administerpage.ejs', {profile: data})
  })
});

router.get('/mypage', function(req, res){
  if (req.session.user_id != null) {
    var id = req.session.user_id;

    logindb.profile(id, function (err, show) {
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
  var title = req.body.title || req.query.title;
  var date = new Date();
  var writedate = String(date.getFullYear()) + '년 ' + String(date.getMonth() + 1) + '월 ' + String(date.getDate()) + '일';
  var post = req.body.post || req.query.post;
  var field = req.body.field || req.query.field;
  var town = req.body.town || req.query.town;

  logindb.profile(req.session.user_id, function (err, data) {
    if (err) {
      console.log(err);
    }

    if (data) {
      console.log('제목 : ' + title + ', 날짜 : ' + writedate + ', 이름: ' + data[0].name + '     , 내용: ' + post + ', 분류: ' + field + ', 지역: ' + town);

      if (writedb) {
        writedb.addpost(title, writedate, data[0].name, post, field, town,
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
    }
  });
});  //글 작성

module.exports = router;
