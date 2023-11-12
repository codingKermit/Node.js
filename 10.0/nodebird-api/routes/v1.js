const express = require('express');

const { verifyToken } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1')

const router = express.Router();

// GET /v1/posts/my
router.get('/posts/my',verifyToken,getMyPosts);

// GET /v1/posts/hashtag/:title
router.get('/posts/hashtag/:title',verifyToken,getPostsByHashtag);

// POST /v1/token
router.post('/token',createToken);

// POST /v1/test
router.get('/test',verifyToken,tokenTest);

module.exports = router;