var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/sex', (req, res, next)=>{
  console.log('8080포트에서 머기중')
})

module.exports = router;
