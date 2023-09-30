const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () =>{
    /* 
    "로그인 시" 실행. 세션에 어떤 데이터를 저장할지 정하는 메서드
    매개 변수로 user를 받는다
    */
    passport.serializeUser((user,done)=>{
        // done 함수의 첫번째에는 에러 발생시 사용, 
        // 두번째는 저장하고 싶은 데이터
        done(null,user.id);
    });


    /* 
    "각 요청마다" 실행
    serializeUser의 done에서 사용된 두번째 데이터가 여기서 인자로 사용
    */
    passport.deserializeUser((id,done)=>{
        User.findOne({where:{id}})
        .then(user=>done(null,user)) // 에러 발생시 => null, 정상 동작시 req.user에 정보 저장
        .catch(err => done(err));
    });

    local();
    kakao();
}
