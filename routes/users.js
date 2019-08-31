var express = require('express');
var router = express.Router();
var db = require('../models/loginDB')

/* GET users listing. */
router.post('/login', function (req, res) {
  var ID = req.body.id || req.query.id;                  //아이디를 받아옴
  var PW = req.body.password || req.query.password;      //비밀번호를 받아옴
  console.log('ID : ' + ID + ', PW : ' + PW);

  if (db) {
    db.authUser(ID, PW, function (err, data) {
      if (db) {
        if (err) {           //에러를 표시해줌
          console.log(err);
          res.send('<script type="text/javascript">alert("에러 발생!"); document.location.href="/";</script>');
          res.end();
          return;
        }

        if (data) {          //성공시 작동함
          console.log("로그인 성공!");
          req.session.user_id = ID, // 아이디
          req.session.password = PW //비밀번호
          console.log(ID + ", " + PW);
          res.redirect('/');
          res.end();
        } else {                //유저가 없을 경우
          console.log('아이디/비밀번호 틀림');
          res.send('<script type="text/javascript">alert("아이디 또는 비밀번호가 틀렸습니다!"); document.location.href="/";</script>');
          res.end();
        }
      } else {                  //DB가 연결이 안되었을 경우
        console.log('DB 연결 안됨');
        res.send('<script type="text/javascript">alert("DB 연결 실패!"); document.location.href="/";</script>');
        res.end();
      }
    });
  }
}); //로그인

router.post('/search', function (req, res) {
  var ID = req.body.user || req.query.user;
  console.log('요청한 ID : ' + ID);

  if (db) {
    db.findPassword(ID, function (err, data) {
      if (db) {
        if (err) {
          console.log(err);
          res.send('<script type="text/javascript">alert("에러 발생!"); document.location.href="/";</script>');
          res.end();
          return;
        }

        if (data) {
          console.log("비밀번호 발견: " + data);
          res.send('<script type="text/javascript">alert("당신의 비밀번호는 ' + data[0].passwords + ' 입니다."); document.location.href="/";</script>');
          res.end();
        }
        else {
          console.log('유저가 존재하지 않음');
          res.send('<script type="text/javascript">alert("유저가 존재하지 않습니다!"); document.location.href="/";</script>');
          res.end();
        }
      }
      else {
        console.log('DB 연결 안됨');
        res.send('<script type="text/javascript">alert("DB가 연결되어 있지 않습니다!"); document.location.href="/";</script>');
        res.end();
      }
    }
    );
  }
}); //비밀번호 찾기

router.post('/adduser', function (req, res) {
  var ID = req.body.user || req.query.user;
  var PW = req.body.password || req.query.password;
  var Name = req.body.name || req.query.name;
  var PW_Correct = req.body.pass_correct || req.query.pass_correct;
  var Phone = req.body.phone || req.body.phone;
  console.log('ID : ' + ID + ', PW : ' + PW + ' Name: ' + Name + ' PW_Correct ' + PW_Correct);

  if (ID == null || PW == null) {
    res.send('<script type="text/javascript">alert("아이디 또는 비밀번호를 입력해주세요!"); document.location.href="/signup";</script>');
    res.end();
  } else {
    if (PW == PW_Correct) {
      if (db) {
        db.sameUser(ID,
          function (err, show) {
            if (err) {
              console.log(err);
              res.send('<script type="text/javascript">alert("에러가 발생했습니다."); document.location.href="/singup";</script>');
              res.end();
              return;
            }

            if (show) {
              if (show != true) {
                console.log('유저가 이미 존재함!');
                res.send('<script type="text/javascript">alert("이미 있는 회원입니다."); document.location.href="/";</script>');
                res.end();
                return;
              } else {
                db.addUser(ID, PW, Name, Phone,
                  function (err, result) {
                    if (err) {
                      console.log(err);
                      res.send('<script type="text/javascript">alert("에러가 발생했습니다.")document.location.href="/";</script>');
                      res.end();
                      return;
                    }

                    if (result) {
                      console.log("회원가입 성공!");
                      res.send('<script type="text/javascript">alert("회원가입 성공! 로그인해주시기 바랍니다."); document.location.href="/login";</script>');
                      res.end();
                      return;
                    }
                    else {
                      console.log('문제 발생!');
                      res.send('<script type="text/javascript">alert("추가에 실패했습니다.")document.location.href="/";</script>');
                      res.end();
                      return;
                    }
                  }
                );
              }
            }
          }
        );
      } else {
        console.log('DB 연결 안됨');
        res.send('<script type="text/javascript">alert("DB가 연결되어 있지 않습니다!"); document.location.href="/";</script>');
        res.end();
        return;
      }
    } else {
      res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다!"); document.location.href="/";</script>');
      res.end();
      return;
    }
  }
}); //회원가입 정보 전송

router.get('/logout', function (req, res) {
  delete req.session.user_id;
  delete req.session.name;
  res.redirect('/');
}); //로그아웃

router.get('/editprofile', function(req, res){
  res.render('../views/User/editprofile.ejs')
});

router.post('/editprofileprocess', function(req, res){
  var current_pass = req.body.current_pass;
  var change_pass = req.body.change_pass;
  var pass_correct = req.body.pass_correct;
  if(current_pass == req.session.password){
    if(change_pass == pass_correct){
      db.editprofile(req.session.user_id, change_pass, function (err, success) {
        if (err) {
          console.log(err);
        }

        if (success) {
          if (success == true) {
            console.log('success');
            if (req.session.user_id != null) {
              res.send('<script type="text/javascript">alert("정보가 성공적으로 업데이트 되었습니다!"); document.location.href="/";</script>');
            }
            } else {
              res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
              res.end();
            }
          } else {
            console.log('오류 발생');
          }
      });
    } else {
      res.send('<script type="text/javascript">alert("비밀번호가 일치하지 않습니다!"); document.location.href="/users/editprofile";</script>');
      res.end();
      return;
    }
  } else {
    res.send('<script type="text/javascript">alert("현재 비밀번호와 다릅니다!"); document.location.href="/users/editprofile";</script>');
    res.end();
    return;
  }
});

module.exports = router;
