var express = require('express');
var router = express.Router();
var db = require('../models/loginDB');

router.post('/Add', (req, res, next) => {
    db.AddPoints({ name: req.session.name, point: parseInt(req.body.point)},
        function () {
            res.redirect('/adminpage');
        })
}) // DB에 포인트 추가

module.exports = router;