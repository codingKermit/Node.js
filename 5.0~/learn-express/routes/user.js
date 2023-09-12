const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/',(req,res)=>{
    res.send('Hello, User');
})

router.get('/:id',(req,res,next)=>{
    console.log(req.params,req.query);
    res.send(`id : ${req.params.id}<br>id : ${req.query.id}`)
})

module.exports = router;