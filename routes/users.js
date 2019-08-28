var express = require('express');
var router = express.Router();
var db = require('../models/DB')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (req, res) {
  console.log('user/login 호출됨');
  var ID = req.body.id || req.query.id;                  //아이디를 받아옴
  var PW = req.body.password || req.query.password;      //비밀번호를 받아옴
  console.log('ID : ' + ID + ', PW : ' + PW);

  if (db) {
    db.authUser(ID, PW, function (err, data) {
      if (db) {
        if (err) {           //에러를 표시해줌
          console.log(err);
          res.status(401).send('<script type="text/javascript">alert("에러 발생!"); document.location.href="/";</script>');
          res.end();
          return;
        }

        if (data) {          //성공시 작동함
          // console.dir(data);
          console.log("로그인 성공!");
          req.session.user_id = req.body.user, // 아이디
            req.session.name = req.body.name // 이름
          res.status(200).send('<script type="text/javascript">alert("로그인 성공!"); document.location.href="/";</script>');
          res.end();

        }
        else {                //유저가 없을 경우
          console.log('유저가 존재하지 않음');
          res.status(401).send('<script type="text/javascript">alert("유저가 존재하지 않습니다!"); document.location.href="/";</script>');
          res.end();
        }
      }
      else {                  //DB가 연결이 안되었을 경우
        console.log('DB 연결 안됨');
        res.status(401).send('<script type="text/javascript">alert("DB 연결 실패!"); document.location.href="/";</script>');
        res.end();
      }
    }
    );
  }
}); //로그인

router.get('/signup', function(req, res){
  res.send('Success!')
  res.end();
}); //회원가입

router.get('/findpw', function (req, res) {
  res.send('FindPW Success!')
  res.end();
}); //비밀번호 찾기
module.exports = router;
