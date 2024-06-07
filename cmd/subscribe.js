const fs = require('fs');

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

  const onPublish = function (tx) {
    // console.log("TRANSACTION", tx);
    // create folder if it doesnt exist 
    if (!fs.existsSync(`${homeDir}/runto1sat/runlocks/${address}`)) {
      fs.mkdirSync(`${homeDir}/runto1sat/runlocks/${address}`, { recursive: true });
    }
    // save raw tx to file
    fs.writeFileSync(`${homeDir}/runto1sat/runlocks/${address}/${tx.id}.json`, tx.transaction);

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
    // console.log("TRANSACTION", tx);
  };

  await client.Subscribe(process.env.JUNGLEBUS_RUNLOCK_SUB_ID, 720000, onPublish, onStatus, onError, onMempool);
}

module.exports = {
  subscribeToRunLock
}
