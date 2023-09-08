const express = require('express');
const path = require('path');

const app = express();
app.set('port',process.env.PORT||3000); // 환경변수가 없으면 3000번을 포트 번호로 사용

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