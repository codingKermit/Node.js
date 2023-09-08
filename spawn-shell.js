const spawn = require('child_process').spawn;

const process = spawn('dir',[],{shell:true})

process.stdout.on('data',(data)=>{
    console.log(data.toString());
})

process.stderr.on('data',function(data){
    console.log(data.toString());
})

process.on('close',code=>{
    console.log(`종료 코드 : ${code}`)
})