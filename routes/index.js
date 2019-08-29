var express = require('express');
var router = express.Router();
var db = require('../models/DB')

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.user_id != null) {
    res.render('../views/index.ejs', { islogin: 'login' });
  } else {
    res.render('../views/index.ejs', { islogin: 'no' });
  }
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
module.exports = router;
