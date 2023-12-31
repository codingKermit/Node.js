const express = require('express');
const { searchByHashtag, getMyPosts, getMyFollwerList, getMyFollowingList, renderMain } = require('../controllers');

const router = express.Router();

router.get('/myposts',getMyPosts);

router.get('/myfollower', getMyFollwerList);

router.get('/myfollowing', getMyFollowingList)

router.get('/search/:hashtag',searchByHashtag);

router.get('/',renderMain);

module.exports = router;