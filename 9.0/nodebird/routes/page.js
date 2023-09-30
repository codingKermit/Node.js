const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderProfile, renderJoin, renderMain } = require('../controllers/page');

const router = express.Router();

router.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.followerCount = 0;
    res.locals.follwingCount = 0;
    res.locals.followingIdList = [];
    next();
})

// isLoggedIn의 내부에서 isAuthenticated() 값이 true일 경우 next가 동작하여 renderProfile로 넘어간다.
// 하지만 false일 경우 next()는 동작하지 않고 '로그인 필요' 라는 문구가 나온다
router.get('/profile', isLoggedIn, renderProfile); 
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/',renderMain);

module.exports = router;