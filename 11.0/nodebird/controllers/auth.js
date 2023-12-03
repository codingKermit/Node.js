const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
const cashModule = require('../passport/index');

exports.join = async (req,res,next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({where:{email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password,12);
        await User.create({
            email,
            nick,
            password : hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

exports.login = (req,res,next) => {
    passport.authenticate('local', {session : false}, (authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next);
};

exports.logout = (req,res) => {

    const id = req.user.id;
    
    const cash = cashModule.getCash();
    if(cash){
        cashModule.removeCash(id);
    }

    req.logout(()=>{
        res.redirect('/');
    });
};

exports.update = async (req,res,next) => {
    try {
        const { nick, password, passwordChk} = req.body;
        const id = req.user.id;
        if(password != passwordChk){
            return res.redirect('/update?error=password check fail');
        }
        const nickname = await User.findOne({where : {nick}});
        if(nickname){
            return res.redirect('/update?error=duplicated nick');
        } 
        const user = await User.findOne({where : {id}});
        if(nick){
            user.update({'nick':nick},{where : {id}});
        };
        if(password){
            const hash = await bcrypt.hash(password,12);
            user.update({'password':hash},{where:{id}});
        }
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
}