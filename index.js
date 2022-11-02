const { WebSocket } = require('ws');
const ora = require('ora');
const chalk = require('chalk');
const yargs = require('yargs');
const fs = require('fs');

const bufferData = fs.readFileSync('./connectpacket.bin');
const buffer = new Uint8Array(bufferData);

function sendConnect(prefix = '\t') {
  return new Promise((resolve, reject) => {
    const url = 'wss://social-service-integration.d2dragon.net/mqtt';
    const ws = new WebSocket(url, 'mqtt', {});
    console.log(prefix, 'connecting to', url);
  
    ws.on('error', (err) => {
      console.log(prefix, 'error', err);
      reject();
    });
  
    ws.on('message', (data, binary) => {
      console.log(prefix, 'data', binary, data);
    });
    
    ws.on('open', async () => {
      console.log(prefix, 'sending buffer', buffer.length);
      const options =  {
        compress: false,
        binary: true,
      };
      ws.send(buffer, options, (err) => {
        console.log(prefix, 'send complete. error', err);
      });   
    });
  
    ws.on('close', (code, reason) => {
      console.log(prefix, 'websocket closed', code, reason.toString());
      resolve();
    });  
  });
}

async function main() {
  for (let i = 0; i < 1000000; i++) {
    console.log('iteration', i+1);
    await sendConnect();
  }
}
main();
