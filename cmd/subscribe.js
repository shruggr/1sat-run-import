const fs = require('fs');
const Run = require('run-sdk');
const Blockchain = require('../blockchain');
const Cache = require('../cache');

const blockchain = new Blockchain()
const cache = new Cache()
const run = new Run({
  network: 'main',
  blockchain,
  timeout: 600000, // 10 minutes per load
  cache,
  trust: '*',
  state: new Run.plugins.LocalState(),
})


// process.env.JUNGLEBUS_RUNLOCK_SUB_ID
const homeDir = require('os').homedir();

const { JungleBusClient, ControlMessageStatusCode } = require("@gorillapool/js-junglebus");

async function subscribeToRunLock(address) {

  const client = new JungleBusClient("junglebus.gorillapool.io", {
    useSSL: true,
    onConnected(ctx) {
      console.log("CONNECTED", ctx);
    },
    onConnecting(ctx) {
      console.log("CONNECTING", ctx);
    },
    onDisconnected(ctx) {
      console.log("DISCONNECTED", ctx);
    },
    onError(ctx) {
      console.error(ctx);
    },
  });

  const onPublish = async function (tx) {
    // console.log("TRANSACTION", tx);
    // create folder if it doesnt exist 
    if (!fs.existsSync(`${homeDir}/runto1sat/runlocks/${address}`)) {
      fs.mkdirSync(`${homeDir}/runto1sat/runlocks/${address}`, { recursive: true });
    }

    // sync run token to figure out if its spent
    const t = await run.import(tx.transaction, { trust: true });
    await t.cache()

    for (const jig of t.outputs) {
      // console.log({ jig });
      if (jig.sender !== address) {
        console.log("This wasnt me")
        continue
      }

      // was it spent?
      const txid = jig.location.split("_")[0]
      const vout = jig.location.split("_")[1].replace('o', '')
      const spent = await blockchain.spends(txid, vout)
      if (spent) {
        console.log("This was spent", spent)
        continue
      }

      console.log("Not spent!!", jig.location)
      const jigFilePath = `${homeDir}/runto1sat/runlocks/${address}/${jig.location}.json`
      // save raw tx to file
      fs.writeFileSync(jigFilePath, JSON.stringify({
        ...jig,
        constructor: {
          ...jig.constructor
        }
      }, null, 2));

    }

    // save raw tx to file
    // fs.writeFileSync(`${homeDir}/runto1sat/runlocks/${address}/${txid}_${vout}.json`, jig);
  };

  const onStatus = function (message) {
    if (message.statusCode === ControlMessageStatusCode.BLOCK_DONE) {
      console.log("BLOCK DONE", message.block);
    } else if (message.statusCode === ControlMessageStatusCode.WAITING) {
      console.log("WAITING FOR NEW BLOCK...", message);
    } else if (message.statusCode === ControlMessageStatusCode.REORG) {
      console.log("REORG TRIGGERED", message);
    } else if (message.statusCode === ControlMessageStatusCode.ERROR) {
      console.error(message);
    }
  };

  const onError = function (err) {
    console.error(err);
  };

  const onMempool = function (tx) {
    console.log("MEMPOOL TRANSACTION", tx);

  };

  await client.Subscribe(process.env.JUNGLEBUS_RUNLOCK_SUB_ID, 720000, onPublish, onStatus, onError, onMempool);
}

module.exports = {
  subscribeToRunLock
}
