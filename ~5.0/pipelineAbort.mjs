import {pipeline} from 'stream/promises';
import zlip from 'zlib';
import fs from 'fs';

const ac = new AbortController();
const signal = ac.signal;

setTimeout(()=>ac.abort(),1); // 1ms 후에 중단
await pipeline(
    fs.createReadStream('./readme4.txt'),
    zlip.createGzip(),
    fs.createWriteStream('./readme4.txt.gz'),
    {signal}
)