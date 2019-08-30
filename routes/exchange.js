var express = require('express');
var router = express.Router();
var db = require('../models/exchangeDB')

/* GET home page. */
router.get('/', function(req, res, next) {
  db.GoodsList((err, data)=>{
    res.render('../views/Exchange/exchange.ejs', {title : "!help", goods : data/*DB로 연결된 데이터 보내기 */});
  })
}); //메인 화면(로그인 페이지)

router.get('/Add/:name/:code/:price', (req,res,next)=>{
  db.AddGoods({name : req.params.name, code: req.params.code, price: req.params.price},
  function(){
    res.redirect('/');
  })
})

router.get('/goods/:code', (req, res, next)=>{
  db.LoadGoods({query:{G_id: req.params.code}, callback: function(docs){
    if(!docs){
        alert("없어욧!");
        res.redirect('/exchange')
    }else{
      res.render('../views/Exchange/goods.ejs', {title: '!help',
      GoodsData : docs});
    }
  }})
})

module.exports = router;