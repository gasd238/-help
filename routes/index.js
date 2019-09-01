var express = require('express');
var router = express.Router();
var postdb = require('../models/postDB');
var logindb = require('../models/loginDB');

/* GET home page. */
router.get('/', function(req, res) {
  postdb.getpost(
    function (err, data) {
      if (req.session.user_id != null) {
        res.render('../views/index.ejs', { islogin: 'login', post: data})
      } else {
        res.render('../views/index.ejs', { islogin: 'no', post: data});
      } 
  });
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

router.get('/test', function (req, res) {
  res.render('../views/User/test.ejs');
});

router.get('/test2', function (req, res) {
  res.render('../views/User/test2.ejs');
});

router.get('/adminpage', function(req, res){
  if (req.session.user_id != null) {
  logindb.allprofile((err, data)=>{
    logindb.profile(req.session.user_id, (err, docs)=>{
      if(docs.grade == 'admin'){
        res.render('../views/User/administerpage.ejs', {profile: data})
      }else{
        res.send('<script type="text/javascript">alert("관리자 전용 사이트입니다"); document.location.href="/";</script>');
        res.end();
      }
    })
  })
  } else {
    res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
    res.end();
  }
});

router.post('/mypage', (req, res, next)=>{
  logindb.profile(req.session.user_id, (err, docs)=>{
    if(err){
      console.log(err.message);
    }else{
      logindb.editprofile_vol(docs, (err, docs)=>{
        if(err){
          console.log(err.message);
        }else{
          res.redirect('/');
        }
      })
    }
  })
})

router.get('/mypage', function(req, res){
  if (req.session.user_id != null) {
    var id = req.session.user_id;
    logindb.profile(req.session.user_id, function (err, data) {
      if (err) {
        console.log(err);
      }
      if (data) {
        req.session.name = data.name;
      }
    });
    var post_count = 0;
    console.log(id + ", " + req.session.name);
    logindb.profile(id, function (err, show) {
      if (err) {
        console.log("logindb: " + err);
        res.send('<script type="text/javascript">alert("에러가 발생했습니다."); document.location.href="/";</script>');
        res.end();
        return;
      }
      postdb.getmypost(show.name, function (err, data){
        if(data){
          for(i=0; i < data.length; i++){
            post_count += 1;
          }
          console.log("이름: " + show.name + ", 글 개수: " + post_count);
        }else{
          console.log("이름: " + show.name + ", 글 개수: " + 0);
        }
        res.render('../views/User/MyPage.ejs', { post: data, PInfo: show, islogin: 'login' });
        res.end();
      });
    });
  } else {
    res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
    res.end();
  }
});

router.get('/writepost', function(req, res){
  res.render('../views/Post/writepost.ejs');
});

router.get('/readpost/:key', function(req, res, next){
  if (req.session.user_id != null) {
    postdb.readpost({"key" : req.params.key},(err, docs)=>{
      if(err){
        console.log(err.message);
      }else{
        logindb.profile(req.session.user_id, (err, data)=>{
          res.render('../views/Post/readpost.ejs', {post : docs, islogin : 'login', user : data});
        })
      }
    })
  }else{
    res.send('<script type="text/javascript">alert("로그인을 먼저 해주세요!"); document.location.href="/";</script>');
    res.end();
  }
});

router.post('/delpost', function(req,res,next){
  postdb.delpost({"key":req.body.key}, (err, data)=>{
    res.send(`<script type="text/javascript">alert("글이 정상적으로 삭제되었습니다!"); document.location.href="/post_result/${data.attender}";</script>`);
    res.end();
    return;
  })
});

router.get('/post_result/:attender', function(req,res,next){
  res.render('../views/Post/post_result.ejs', {title: '!help', attender:parseInt(req.params.attender)});
});

router.post('/attend', function(req,res,next){
  postdb.attendpost({"key":req.body.key}, (err, data)=>{
    res.send('<script type="text/javascript">alert("참가되었습니다!"); document.location.href="/";</script>');
    res.end();
    return;
  })
});

router.post('/writeposts', function(req, res){
  var date = new Date();
  var writedate = String(date.getFullYear()) + '년 ' + String(date.getMonth() + 1) + '월 ' + String(date.getDate()) + '일';
  var key = Math.round( Math.random() * 0xFFFFFF ).toString(16);

  logindb.profile(req.session.user_id, function (err, data) {
    if (err) {
      console.log(err);
    }
    if (data) {
      if (postdb) {
        postdb.addpost({title:req.body.title, "writedate":writedate, name:data.name, post:req.body.post,
           field:req.body.field, town:req.body.town, latitude:req.body.latitude,
            longitude:req.body.longitude, "key":key},
          function (err, result) {
            if (err) {
              console.log(err);
              res.send('<script type="text/javascript">alert("에러가 발생했습니다.")document.location.href="/";</script>');
              res.end();
              return;
            }

            if (result) {
              console.log("글쓰기 성공!");
              res.send('<script type="text/javascript">alert("글이 정상적으로 등록되었습니다!"); document.location.href="/";</script>');
              res.end();
              return;
            } else {
              console.log('문제 발생!');
              res.send('<script type="text/javascript">alert("추가에 실패했습니다.")document.location.href="/";</script>');
              res.end();
              return;
            }
          }
        );
      } else {
        console.log('DB 연결 안됨');
        res.send('<script type="text/javascript">alert("DB가 연결되어 있지 않습니다!"); document.location.href="/";</script>');
        res.end();
        return;
      }
    }
  });
});  //글 작성

module.exports = router;
