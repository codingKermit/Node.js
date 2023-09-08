const spawn = require('child_process').spawn;

const process = spawn('java',['HelloWorld.java']);

process.stdout.on('data',data=>{
    console.log(data.toString());
})


process.stderr.on('data',data=>{
    console.log(data.toString())
})