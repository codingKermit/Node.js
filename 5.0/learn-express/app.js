const express = require('express');
const path = require('path');

const app = express();
app.set('port',process.env.PORT||3000); // 환경변수가 없으면 3000번을 포트 번호로 사용

app.get('/',(req,res)=>{
    // res.send('Hello Express') send()로 문자열을 보냈다
    res.sendFile(path.join(__dirname,'./index.html')); // sendFile() 으로 파일을 전달했다
})

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
})