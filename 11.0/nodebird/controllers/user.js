const { follow } = require('../service/user');
const User = require('../models/user');

exports.follow = async (req,res,next) => {
    try {
        const result = await follow(req.user.id,req.params.id);
        if(result === 'ok'){
            res.send('success');
        } else if ( result === 'no user'){
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