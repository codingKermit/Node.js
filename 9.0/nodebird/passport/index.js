const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User, Post } = require('../models');

const cashing = {};

exports.cashing = cashing;

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

        /*
        id에 해당 하는 캐싱이 되어 있고, 만료 시간이 지나지 않았다면 그대로 반환,
        조건에 해당하지 않는다면 새로운 만료 시간을 가진 데이터를 캐싱 하고, 데이터 반환

        로그아웃 시에는 cashing을 import 하여 사용자 id에 해당하는 값을 삭제
        */

        const cash = cashing.id||{};
        
        // 쿠키가 존재 하고, 만료시간이 지나지 않은 경우
        if(cash && cash.expire > Date.now()){
            return done(null,cash);
        } else {
            // 캐시가 존재하지 않거나, 만료시간이 지난경우 새로운 쿠키 제공 및 캐싱
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
                },{
                    model : Post,
                    attributes : ['id'],
                    as : 'Likes'
                }]
            })
            .then(user=>{
                done(null,user);
                // 캐싱 종료 시간 설정
                const expire = new Date();
                expire.setMinutes(expire.getMinutes()+5); // 캐싱 시간은 5분
                user.expire = expire; // 캐시 데이터의 expire 속성에 캐싱 종료 시간 명시
                cashing.id = user; // 캐시에 사용자 id 속성으로 값을 저장

                // 5분 후에 캐싱 데이터 삭제
                setTimeout(() => {
                    if (cashing.id && cashing.id.expire <= Date.now()) {
                      delete cashing.id;
                    }
                  }, 5 * 60 * 1000); // 캐싱 시간(5분) 후에 실행되도록 설정


            }) // 에러 발생시 => null, 정상 동작시 req.user에 정보 저장
            .catch(err => done(err));
        }
        


    });

    local();
    kakao();
}
