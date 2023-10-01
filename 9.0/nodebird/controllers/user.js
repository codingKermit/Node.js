const User = require('../models/user');

exports.follow = async (req,res,next) => {
    try {
        const user = await User.findOne({where : { id : req.user.id }});
        if(user){
            await user.addFollowing(parseInt(req.params.id,10));
            res.send('success')
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

exports.unfollow = async (req,res,next)=>{
    try {
        const user = await User.findOne({where : {id : req.user.id}});
        const unfollow = await User.findOne({where : {id : req.params.id}});
        console.log('user : ' , user);
        console.log('unfollow : ' , unfollow);
        if(user && unfollow){
            await user.removeFollowing(unfollow);
            res.send('success')
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}