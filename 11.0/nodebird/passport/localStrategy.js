const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () =>{
    /*
        각각의 필드에 req.body에서 사용할 사용자의 아이디/비밀번호 속성 값을 입력한다.
        passReqToCallback는 express의 req 객체 접근 가능 여부를 체크한다.
        true로 사용한다면 콜백함수의 첫번째 인수로 req가 추가된다
        ex) (req, email, password, done)
        */
    passport.use(new LocalStrategy({ 
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : false,
    }, 
    // 실질적으로 passport-local의 로그인 전략을 수립하는 단계의 시작
    async (email, password, done)=>{
        try {
            const exUser = await User.findOne({where : {email} });
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null,exUser);
                } else {
                    done(null,false,{message : '비밀번호가 일치하지 않습니다'});
                }
            } else {
                done(null, false, {message : '가입되지 않은 회언입니다.'});
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};