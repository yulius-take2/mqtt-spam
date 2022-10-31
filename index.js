const { WebSocket } = require('ws');
const ora = require('ora');
const chalk = require('chalk');
const yargs = require('yargs');

// create buffer to send to websocket
const bufferBytes = [0xcb, 0xfc, 0x5d, 0xd4];
const bufferData = []
for (let i = 0; i < 3904; i++) {
  bufferData.push(...bufferBytes);
}
const buffer = new Uint8Array(bufferData);

function sleep(t) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, t);
  });
}

async function main() {
  const url = 'wss://social-service-develop.d2dragon.net/mqtt';
  const ws = new WebSocket(url, 'mqtt', {});
  const spinner = ora();
  spinner.start();
  spinner.text = `Connecting to ${url}`;

  ws.on('error', (err) => {
    console.log('error', err);
  })
  
  ws.on('open', async () => {
    spinner.text = `Connected`;
    const total = 100;
    // const total = 100000000;
    for (let i = 0; i < total; i++) {
      spinner.text = `sending ${chalk.yellow(i)}/${chalk.yellow(total)} size ${chalk.cyan(buffer.length)} to ${chalk.cyan(url)}`;
      ws.send(buffer);
      await sleep(100);
    }
    spinner.stopAndPersist();
    spinner.succeed('done');
  });

}
main();
