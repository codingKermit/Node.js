const { hash } = require('bcrypt');
const { User, Post, Hashtag } = require('../models');

exports.renderProfile = (req,res) =>{
    res.render('profile',{title : '내 정보 - NodeBird'});
};

exports.renderJoin = (req,res) =>{
    res.render('join',{title : '회원 가입 - NodeBird'});
}
exports.renderMain = async (req,res,next) =>{
    try {
        const posts = await Post.findAll({
            include : {
                model : User,
                attribute : ['id','nick'],
            },
            order: [['createdAt','DESC']],
        })
        res.render('main',{
            title : 'NordBird',
            twits : posts,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.renderHashtag = async (req,res, next) => {
    const query = req.query.hashtag;
    if(!query){
        return res.redirect('/');
    } else {
        try {
            const hashtag = await Hashtag.findOne({where : {title:query}});
            let posts = [];
            if(hashtag){
                posts = await hashtag.getPosts({include:[{model:User}]});
            }
            return res.render('main',{
                title:`${query} | NordBird`,
                twits : posts,
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    } 
}