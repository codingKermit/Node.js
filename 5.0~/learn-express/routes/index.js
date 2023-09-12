const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/',(req,res)=>{
    res.send('Hello, Express');
})

// 주소가 같고 메서드가 다른 코드는 한가지 route로 묶을 수 있다
// router.get('/abc',(req,res)=>{
//     res.send('GET /abc');
// });

// router.post('/abc',(req,res)=>{
//     res.send('POST /abc')
// });


router.route('/abc')
    .get((req,res)=>{
        res.send('GET /abc')
    })
    .post((req,res)=>{
        res.send('POST /abc')
    });

module.exports = router;