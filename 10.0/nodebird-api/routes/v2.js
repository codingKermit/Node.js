const express = require('express');
const cors = require('cors');


const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag, getFollowerList, getFollowingList} = require('../controllers/v2')

const router = express.Router();

router.use(corsWhenDomainMatches);

// router.use(cors({
//     credentials : true, // 다른 도메인간의 쿠키 공유 옵션
// }))

// POST /v2/token
router.post('/token',apiLimiter, createToken);

// POST /v2/test
router.get('/test',apiLimiter, verifyToken, tokenTest);

// GET /v2/posts/my
router.get('/posts/my', apiLimiter, verifyToken, getMyPosts);

// GET /v2/posts/hashtag/:title
router.get('/posts/hashtag/:title', apiLimiter, verifyToken, getPostsByHashtag);

// GET /v2/followerList
router.get('/followerList',apiLimiter,verifyToken, getFollowerList)

// GET /v2/followingList
router.get('/followingList',apiLimiter,verifyToken, getFollowingList)

module.exports = router;