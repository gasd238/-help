var express = require('express');
var router = express.Router();
var db = require('../models/exchangeDB')

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user_id != null) {
    db.LoadPoint(req.session.user_id, (docs) => {
      db.GoodsList((err, data) => {
        res.render('../views/Exchange/exchange.ejs', { title: "!help", goods: data, point: docs.point });
      });
    });
  } else {
    res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
    res.end();
  }
}); //메인 화면(교환소 페이지)

router.get('/Add/:name/:code/:price/:amount', (req,res,next)=>{
  db.AddGoods({name : req.params.name, code: parseInt(req.params.code), price: parseInt(req.params.price), amount: parseInt(req.params.amount)},
  function(){
    res.redirect('/');
  })
}) // DB에 데이터 넣는 법.

router.get('/Remove/:code', (req,res,next)=>{
  db.RemoveGoods({G_id : req.params.code}, ()=>{
    res.redirect('/exchange');
  })
}) //삭제하는 코드

router.get('/Buy/:G_id', (req, res, next)=>{
  db.LoadPoint(req.session.user_id, (docs)=>{
    db.LoadGoods({query:{G_id: parseInt(req.params.G_id)}, callback: function(doc2){
      if(docs.point < doc2.Price){
        res.send('<script type="text/javascript">alert("잔액이 부족합니다"); document.location.href="/exchange";</script>');
        res.end();
      }else{
        db.BuyGoods(docs.id, doc2.G_id, ()=>{
          res.render('../views/Exchange/e-result.ejs', {title: '!help',
            point: docs.point - doc2.Price});
        })
      }
    }})
  })
})

router.get('/goods/:code', (req, res, next)=>{
  if (req.session.user_id != null) {
    db.LoadPoint(req.session.user_id, (docp) => {
      db.LoadGoods({query:{G_id: parseInt(req.params.code)}, callback: function(docs){
        if(!docs){
          res.send('<script type="text/javascript">alert("없어욧!"); document.location.href="/exchange";</script>');
          res.end();
        }else{
          res.render('../views/Exchange/goods.ejs', {title: '!help',
          GoodsData: docs, point: docp.point});
        }
      }})
    });
  } else {
    res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/login";</script>');
    res.end();
  }
})

module.exports = router;