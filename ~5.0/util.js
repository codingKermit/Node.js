const util = require('util');
const crypto = require('crypto');

const dontUseMe = util.deprecate((x,y)=>{
    console.log(x+y);
    }, 'dontUseMe 함수는 deprecated 되었으니 더 이상 사용하지 마세요!'
);
dontUseMe(1,2);

const randomByytesPromise = util.promisify(crypto.randomBytes);
randomByytesPromise(64)
.then((buf)=>{
    console.log(buf.toString('base64'));
})
.catch((err)=>{
    console.error(err)
})