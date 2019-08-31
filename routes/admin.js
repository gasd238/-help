var express = require('express');
var router = express.Router();
var db = require('../models/loginDB');

router.post('/add', (req, res, next) => {
    console.log(req.body.name + " | " + parseInt(req.body.add_point));
    db.CurrentSet(req.body.name, function(err, data){
        var cur_points = parseInt(data.point);
        var add_points = parseInt(req.body.add_point);
        var result = 0;

        if (err){
            console.log(err);
        } else {
            console.log(cur_points);
            console.log(add_points);
            result = cur_points + add_points;
            console.log(result);
            db.AddPoints({ name: req.body.name, point: result }, function(err, data){
                if (err){
                    console.log(err);
                } else {
                    res.redirect('/adminpage');
                }
            });
        }
    });
}); // DB에 포인트 추가

router.post('/v_add', (req, res, next) => {
    console.log(req.body.name + " | " + parseInt(req.body.add_vtime));
    db.CurrentSet(req.body.name, function (err, data) {
        var cur_v_time = parseInt(data.vtime);
        var add_v_time = parseInt(req.body.add_vtime);
        var result = 0;

        if (err) {
            console.log(err);
        } else {
            console.log(cur_v_time);
            console.log(add_v_time);
            result = cur_v_time + add_v_time;
            console.log(result);
            db.v_time({ name: req.body.name, vtime: result }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/adminpage');
                }
            });
        }
    });
}) //DB에서 포인트 삭제

module.exports = router;