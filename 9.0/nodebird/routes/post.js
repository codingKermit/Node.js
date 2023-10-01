const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost, like, unlike, remove, filter } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');    
}

const upload = multer({
    // 파일이 저장될 스토리지 설정
    storage : multer.diskStorage({
        // 파일의 저장 경로 설정
        destination(req,file,cb){
            cb(null, 'uploads/');
        },
        // 저장 파일의 이름 설정
        filename(req,file,cb){
            const ext = path.extname(file.originalname); // 확장자를 구하는 부분
            // path.basename() 의 두번째 인자를 넣어주면 해당 확장자를 지워준다. 단 올바른 확장자여야 지워준다
            cb(null, path.basename(file.originalname,ext)+Date.now()+ext); 
        },
    }),
    // 업로드할 파일의 크기 제한
    limits : { fileSize : 5*1024*1024 },
})

// POST /post/img
router.post('/img',isLoggedIn,upload.single('img'),afterUploadImage);


// POST /post/:id/like
router.post('/:id/like',isLoggedIn,like);

// POST /post/:id/unlike
router.post('/:id/unlike',isLoggedIn,unlike);

// POST /post/:id/remove
router.post('/:id/remove',isLoggedIn,remove);

// POST /post/:id
router.post('/:id',filter);


// POST /post
const upload2 = multer();
// multer 모듈의 none() 함수는 파일을 업로드 하지 않겠다는 의미
router.post('/',isLoggedIn,upload2.none(),uploadPost);

module.exports = router;