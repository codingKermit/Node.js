const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderProfile, renderJoin, renderMain, renderHashtag, renderUpdate, renderWriter } = require('../controllers/page');

const router = express.Router();

router.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f=>f.id)||[];
    res.locals.likeIdList = req.user?.Likes?.map(f=>f.id)||[];
    next();
})

// isLoggedIn의 내부에서 isAuthenticated() 값이 true일 경우 next가 동작하여 renderProfile로 넘어간다.
// 하지만 false일 경우 next()는 동작하지 않고 '로그인 필요' 라는 문구가 나온다
router.get('/profile', isLoggedIn, renderProfile); 
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/update',isLoggedIn, renderUpdate);
router.get('/hashtag',renderHashtag);
router.get('/writer',renderWriter);
router.get('/',renderMain);

module.exports = router;