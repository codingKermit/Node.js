import { odd, even } from './var.mjs';
import checkNumber from './func.mjs';

function checkStringOddOrEven(str){
    if(str.length){
        return odd;
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('Hello'));
