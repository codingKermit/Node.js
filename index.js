const {odd,even} = require('./var');
const checkOddEven = require('./func');

function checkStringOddEven(str){
    if(str.length % 2 ){
        return odd;
    }
    return even;
}

console.log(checkOddEven(10));
console.log(checkStringOddEven('hello'));