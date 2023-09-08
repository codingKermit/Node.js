const ids = ['a','b','c','d','e','f','g','h'];

const map = ids.reduce((acc, cur, idx, arr)=>{
	acc[cur] = idx;
    return acc;
},{})

console.log(map); // {'a':0,'b':1,'c':2',d':3,'e':4,'f':5,'g':6,'h':7};