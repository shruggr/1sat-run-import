const Blockchain = require('../blockchain')
const Cache = require('../cache')
const fs = require('fs')
const path = require('path')
const Run = require('run-sdk')
const { Address } = require('@ts-bitcoin/core')

async function importAddress(address) {
    console.log("importAddress", address)
  // address needs to come from cli arg

  const blockchain = new Blockchain()
  const cache = new Cache()
  const run  = new Run({ 
      network: 'main', 
      blockchain, 
      timeout: 600000, // 10 minutes per load
      cache,
      trust: '*',
      state: new Run.plugins.LocalState(),
  })
  
  const limit = 100;
  let offset = 0;
  let utxos = [];
  let hasMore = true;
  
  while (hasMore) {
      const batch = await blockchain.utxos(Address.fromString(address).toTxOutScript().toHex(), offset, limit);
      utxos = [...utxos, ...batch];
      hasMore = batch.length === limit;
      offset += limit;
  }
  
  console.log("utxos", utxos.length);

  const jigs = [];
  for await (const utxo of utxos) {
      const jigLocation = `${utxo.txid}_o${utxo.vout}`;

      // make directory if it doesn't exist already
      if (!fs.existsSync(path.join('jigs', address))) {
          fs.mkdirSync(path.join('jigs', address), { recursive: true });
      }
      
      const jigFilePath = path.join('jigs', address, `${jigLocation}.json`);
  
      // Skip if the jig file already exists
      if (fs.existsSync(jigFilePath)) {
          console.log(`Jig ${jigLocation} already downloaded, skipping...`);
          continue;
      }
  
      try {
          console.log("loading", jigLocation);
          const jig = await run.load(jigLocation);
          jigs.push(jig);
          console.log("jig", jig.constructor.metadata?.name || "Unknown");
          fs.writeFileSync(jigFilePath, JSON.stringify({
              ...jig,
              constructor: {
                  ...jig.constructor
              }
          }, null, 2));
      } catch (e) {
          console.error(e);
      }
  }
}

module.exports = { importAddress }
