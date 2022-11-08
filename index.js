const { WebSocket } = require('ws');
const ora = require('ora');
const chalk = require('chalk');
const yargs = require('yargs');
const fs = require('fs');
const mqtt = require('mqtt');
const crypto = require('crypto');
require('dotenv').config();

const bufferData = fs.readFileSync('./connectpacket.bin');
const buffer = new Uint8Array(bufferData);
const dataSize = 1*1024*1024*1024; // add gigabyte
const badData = crypto.randomBytes(dataSize);
const largeBuffer = Buffer.concat([bufferData, badData], bufferData.length + badData.length);

function sendConnect(prefix = '\t') {
  return new Promise((resolve, reject) => {
    const url = process.env['MQTT_URL'];
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
      const buffer = largeBuffer;
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
  await sendConnect();
}
main();
