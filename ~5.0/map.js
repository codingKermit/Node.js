const namesWithGender = ['a','b','c','d','e','f','g'];

const map = namesWithGender.map((v,idx,arr)=>{
    console.log(this)
    return v;
},{'cry':'애용'});

console.log(map);