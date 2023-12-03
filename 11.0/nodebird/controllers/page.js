const { hash } = require('bcrypt');
const { User, Post, Hashtag } = require('../models');
const { post } = require('../routes/post');

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
            let posts = [];
            const hashtag = await Hashtag.findOne({where : {title:query}});
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

exports.renderUpdate = async (req,res,next)=>{
    res.render('update', {title : '회원 수정 - NodeBird'})
}

exports.renderWriter = async (req,res,next)=>{
    const writerId = req.query.writerId;
    if(!writerId){
        return res.redirect('/');
    } else {
        try {
            let posts = [];
            const user = await User.findOne({where : {id:writerId}});
            if(user){
                posts = await user.getPosts({include:[{model:User}]});
            }
            return res.render('main',{
                title: `${writerId} | NordBird`,
                twits : posts,
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }
}