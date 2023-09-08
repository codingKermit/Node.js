const fs = require('fs').promises;

async function readFileAwait(){
    console.log('시작');
    try {
        let data = await fs.readFile('./readme2.txt')
        console.log('1번',data.toString());
        data = await fs.readFile('./readme2.txt');
        console.log('2번',data.toString());
        data = await fs.readFile('./readme2.txt');
        console.log('3번',data.toString());
    } catch (error) {
        console.error(error)    
    }
    console.log('끝')
}

readFileAwait();