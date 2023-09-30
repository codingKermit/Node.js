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
        User.findOne({
            where:{id},
            // 관계 메서드를 통해 관계 되어있는 팔로잉, 팔로워 데이터까지 조회해온다
            include : [{
                model : User,
                attributes : ['id','nick'], // User의 비밀번호까지 조회되지 않기 하기 위해서 컬럼명을 확실히 명시
                as : 'Followers',
            }, {
                model : User,
                attributes : ['id','nick'],
                as : 'Followings'
            }]
        })
        .then(user=>done(null,user)) // 에러 발생시 => null, 정상 동작시 req.user에 정보 저장
        .catch(err => done(err));
    });

    local();
    kakao();
}
