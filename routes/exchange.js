var express = require('express');
var router = express.Router();
var db = require('../models/DB')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/Exchange/exchange.ejs', {title : "!help"/*DB로 연결된 데이터 보내기 */});
}); //메인 화면(로그인 페이지)

module.exports = router;
