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

router.get('/Add/:name/:code/:price', (req,res,next)=>{
  db.AddGoods({name : req.params.name, code: req.params.code, price: req.params.price},
  function(){
    res.redirect('/');
  })
}) // DB에 데이터 넣는 법.

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