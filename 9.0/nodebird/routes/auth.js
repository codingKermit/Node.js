const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout, update } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout',isLoggedIn, logout);

// POST /auth/update
router.post('/update',isLoggedIn, update);

// GET /auth/kakao
router.get('/kakao',passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback',passport.authenticate('kakao',{
    failureRedirect : '/?loginError=카카오로그인 실패',
}),(req,res)=>{
    res.redirect('/'); // 로그인 성공시에는 /로 이동
})


module.exports = router;