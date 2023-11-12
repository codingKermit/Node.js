const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () =>{
    passport.use(new KakaoStrategy({
        // 카카오 디벨로퍼에서 얻는 클라이언트 ID
        clientID : process.env.KAKAO_ID,
        // 로그인 결과가 반환될 콜백 URL
        callbackURL : '/auth/kakao/callback',
    }, async(accessToken,refreshToken, profile, done) => {
        console.log('kakao profile',profile);
        try {
            const exUser = await User.findOne({
                where : { snsId : profile.id, provider : 'kakao'},
            });
            if(exUser){
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email : profile._json?.kakao_account?.email, // email은 없는 경우도 있어서 옵셔널 체이닝 사용
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider : 'kakao'
                });
                done(null,newUser);
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};