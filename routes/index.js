var express = require('express');
var router = express.Router();
var db = require('../models/DB')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Help'});
}); //메인 화면(로그인 페이지)

router.get('/findpw', function (req, res) {
  res.render('../views/Login_Helper/FindPW.ejs')
}); //비밀번호 찾기 창

router.get('/signup', function (req, res) {
  res.render('../views/Login_Helper/SignUp.ejs');
}); //회원가입 창

module.exports = router;
