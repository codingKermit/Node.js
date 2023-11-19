const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async (req,api) => {
    try {
        if(!req.session.jwt){ // 세션에 토큰이 없으면
            const tokenResult = await axios.post(`${URL}/token`,{
                clientSecret : process.env.CLIENT_SECRET,
            })
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`${URL}${api}`,{
            headers : { authorization : req.session.jwt },
        });
    } catch (error) {
        if(error.response?.status === 419){ // 토큰 만료 시 토큰 재발급하기
            delete req.session.jwt;
            return request(req,api);
        } // 419 이외 다른 에러라이면
        return error.response;
    }
}

exports.getMyPosts = async (req,res,next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.searchByHashtag = async (req,res,next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getMyFollwerList = async (req,res,next) => {
    try {
        const result = await request(req,'/followerList');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.getMyFollowingList = async (req,res,next) => {
    try {
        const result = await request(req,'/followingList');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.renderMain = (req,res) => {
    res.render('main', { key : process.env.CLIENT_SECRET});
};