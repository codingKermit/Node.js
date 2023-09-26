const passport = require('passport');
const local = require('passport-local');
const kakao = require('passport-kakao');
const User = require('../models/user');

module.exports = () =>{
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        user.findOne({where:{id}})
        .then(user=>done(null,user))
        .catch(err => done(err));
    });

    local();
    kakao();
}
