const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.set('port',process.env.PORT||3000); // 환경변수가 없으면 3000번을 포트 번호로 사용


// 아래 처럼 한번에 여러개의 미들웨어를 장착시킬 수 있다
app.use(
    morgan('dev'),
    express.static('/',path.join(__dirname,'public')),
    express.json(),
    express.urlencoded({extended:false}),
    cookieParser(process.env.COOKIE_SECRET),
    session({
        resave : false,
        saveUninitialized : false,
        secret : process.env.COOKIE_SECRET,
        cookie:{
            httpOnly : true,
            secure : false
        },
        name : 'session-cookie'
    }),
)

// app.use(morgan('dev'));
// app.use('/',express.static(path.join(__dirname,'public')));
// app.use(express.json());
// app.use(express.urlencoded({extended : false}));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//     resave : false,
//     saveUninitialized : false,
//     secret : process.env.COOKIE_SECRET,
//     cookie : {
//         httpOnly : true,
//         secure : true,
//     },
//     name : 'session-cookie'
// }));


app.use((req,res,next)=>{
    console.log('모든 요청에 다 실행됩니다.');
    next();
});

app.get('/',(req,res,next)=>{
    console.log('GET / 요청에서만 실행됩니다');
    next();
}, (req,res)=>{
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});

app.use((err,req,res,next)=>{
    console.error(err);
    res.status(500).send(err.message);
})

// app.get('/',(req,res)=>{
//     // res.send('Hello Express') send()로 문자열을 보냈다
//     res.sendFile(path.join(__dirname,'./index.html')); // sendFile() 으로 파일을 전달했다
// })

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
})