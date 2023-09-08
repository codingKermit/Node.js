const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// 클라이언트에게 cookie를 받겠지만, cookie가 없다면 cookie의 디폴트 값은 `` 으로 하겠다는 의미
const parseCookies = (cookie = '')=>
    cookie
    .split(';') // 쿠키를 세미콜론을 기준으로 하여 나누어 배열로 만든다
    .map( v => v.split('=')) // 배열의 요소를 = 을 기준으로 나누어 다시 배열로 반환
    .reduce((acc,[k,v])=>{ // 객체로 만들어서 반환
        acc[k.trim()] = decodeURIComponent(v);
        return acc;
    },{}); // 빈 객체가 초기값임을 명시

http.createServer(async (req,res) => {
    const cookies = parseCookies(req.headers.cookie);

    // 주소가 /login으로 시작하는 경우
    if(req.url.startsWith('/login')){
        const url = new URL(req.url,'http://localhost:8084');
        const name = url.searchParams.get('name');
        const expires = new Date();
        // 쿠키 유효 시간을 현재 시간 + 5분으로 설정
        expires.setMinutes(expires.getMinutes()+5);
        res.writeHead(302,{ // 임시 리디렉션 http 상태 코드
            Location : '/',
            'Set-Cookie' : `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        })
        res.end();

    // 주소가 /이면서 name이라는 쿠키가 있는 경우
    } else if (cookies.name){
        res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
        res.end(`${cookies.name}님 안녕하세요`)
    } else { // 주소가 /이면서 name이라는 쿠키가 없는 경우
        try {
            const data = await fs.readFile(path.join(__dirname,'cookie2.html'));
            res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
            res.end(data);
        } catch (error) {
            res.writeHead(500,{'Content-Type':'text/plain; charset=utf-8'});
            res.end(error.message);
        }
    }
})
.listen(8084,()=>{
    console.log('8084번 포트에서 서버 대기 중입니다!')
})