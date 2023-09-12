const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const indexRouter = require('./routes');
const userRouter = require('./routes/user');


dotenv.config();
const app = express();
app.set('port',process.env.PORT||3000); // 환경변수가 없으면 3000번을 포트 번호로 사용

app.use('/',indexRouter);
app.use('/user',userRouter);

app.use((req,res,next)=>{
    res.status(404).send('Not Found');
});

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination (req,file,done){
            done(null,'uploads/');
        },
        filename(req,file,done){
            const ext = path.extname(file.originalname);
            done(null,path.basename(file.originalname,ext)+Date.now()+ext);
        },
    }),
    limits : { fileSize : 5*1024*1024},
})

// 아래 처럼 한번에 여러개의 미들웨어를 장착시킬 수 있다
app.use(
    morgan('dev'),
    express.json(),
    express.urlencoded({extended:false}),
    // express.static('/',path.join(__dirname,'public')), 이 부분만큼은 되지 않는다. 원인이 무엇일까?
    cookieParser(process.env.COOKIE_SECRET),
    session({
        resave : false,
        saveUninitialized : false,
        secret : process.env.COOKIE_SECRET,
        cookie:{
            httpOnly: true,
            secure : false,
        },
        name : 'session-cookie',
    }),
)

app.use('/',express.static(path.join(__dirname,'public')));

// app.use(morgan('dev'));
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

app.get('/upload',(req,res)=>{
    res.sendFile(path.join(__dirname,'multipart.html'));
})

// 하나의 파일을 업로드 하는 경우
// app.post('/upload',upload.single('image'),(req,res)=>{
//     console.log(req.file, req.body);
//     res.send('ok');
// })

// 여러개의 파일을 업로드 하는 경우 ( 하나의 input 을 사용한 경우 )
// app.post('/upload',upload.array('many'),(req,res)=>{
//     console.log(req.files, req.body);
//     res.send('ok');
// })


// 여러개의 파일을 업로드 하는 경우 ( 다수의 input을 사용한 경우 )
app.post('/upload',
    upload.fields([{name : 'image1'}, {name : 'image2'}]),
    (req,res) => {
        console.log(req.files, req.body);
        res.send('ok');
    }
)


// 파일을 업로드 하지 않는데 multipart를 사용하는 경우
// app.post('/upload',upload.none(),(req,res)=>{
//     console.log(req.body);
//     res.send('ok');
// })




// app.get('/',(req,res)=>{
//     // res.send('Hello Express') send()로 문자열을 보냈다
//     res.sendFile(path.join(__dirname,'./index.html')); // sendFile() 으로 파일을 전달했다
// })

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기 중');
})