const { Post, Hashtag } = require('../models');

exports.afterUploadImage = (req,res) =>{
    console.log(req.file);
    res.json({url:`/img/${req.file.filename}`});
};

exports.uploadPost = async (req,res,next) => {
 try {
    const post = await Post.creeat({
        content : req.body.content,
        img : req.body.url,
        UserId : req.body.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if(hashtags){
        const result = await Promise.all(
            hashtags.map(tag => {
                // findOrCreate 함수는 없으면 생성해준다
                return Hashtag.findOrCreate({
                    where : { title : tag.slice(1).toLowerCase() },
                })
            }),
        );
        // hashtag 모델에서 사용자가 따로 넘겨줘야 하는 값은 title 뿐이므로 하나만 넘겨주어야 한다.
        // result에는 [모델, 생성 여부]가 반환되어 있으므로 map을 통해 Hashtag 모델만 사용한다
        await Post.addHashtags(result.map(r=>r[0]));
    }
    res.redirect('/')
 } catch (error) {
    console.error(error);
    next(error);
 }   
};