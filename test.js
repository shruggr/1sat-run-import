const fs = require('fs')
const path = require('path')
const Blockchain = require('./blockchain')
const Cache = require('./cache')
const Run = require('run-sdk')
const { Address } = require('@ts-bitcoin/core')

async function main() {
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

    // const jig = await run.load('5dae7f3d2143bc6e5f0061c8367d2e592bf172e21dac7e429e4e18f7550d4837_o3')
    // console.log(jig)

    // fs.writeFileSync(`jigs/${jig.location}.json`, JSON.stringify({
    //     ...jig,
    //     constructor: {
    //         ...jig.constructor
    //     }
    // }, null, 2))
    
    const limit = 100;
    let offset = 0;
    let utxos = [];
    let hasMore = true;
    
    while (hasMore) {
        const batch = await blockchain.utxos(Address.fromString('18bSDTn4wxTVwMyNpthTEyfwW7afeeiWbN').toTxOutScript().toHex(), offset, limit);
        utxos = [...utxos, ...batch];
        hasMore = batch.length === limit;
        offset += limit;
    }
    
    console.log("utxos", utxos.length);

    const jigs = [];
    for await (const utxo of utxos) {
        const jigLocation = `${utxo.txid}_o${utxo.vout}`;
        const jigFilePath = path.join('jigs', `${jigLocation}.json`);
    
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

main().catch(console.error).then(() => process.exit(0))