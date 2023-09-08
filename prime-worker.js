const { Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const min = 2;
let primes = [];

function findPrimes(start,range){
    let isPrime = true;
    const end = start + range;
    for(let i = start ;i<end;i++){
        for(let j = min; j < Math.sqrt(end);j++){
            if(i !== j && i%j === 0){
                isPrime = false;
                break;
            }
        }
        if(isPrime){
            primes.push(i);
        }
        isPrime= true;
    }
}

if(isMainThread){
    const max = 10000000;
    const threadCount = 8;
    const threads = new Set();
    const range = Math.floor((max - min)/threadCount);
    let start = min;
    console.time('prime');
    // 7개의 워커 스레드 생성
    for(let i =0;i < threadCount-1;i++){
        const wStart = start;
        threads.add(new Worker(__filename,{workerData:{start : wStart,range}}));
        start += range;
    }
    // 마지막 워커 스레드는 최대값까지
    threads.add(new Worker(__filename,{workerData:{start, range : max - start}}));
    for(let worker of threads){
        
        // 에러 발생 감지
        worker.on('error',(err)=>{
            throw err;
        });

        // 스레드 종료시 set에서도 해당 스레드 삭제
        // 모든 스레드가 종료시 최종 수행 시간 , 소수의 갯수 출력
        worker.on('exit',()=>{
            threads.delete(worker);
            if(threads.size === 0 ){
                console.timeEnd('prime');
                console.log(primes.length);
            }
        });
        
        // 스레드가 반환해준 array를 병합
        worker.on('message',(msg)=>{
            primes = primes.concat(msg);
        });
    }
} else {
    findPrimes(workerData.start, workerData.range);
    parentPort.postMessage(primes);
}