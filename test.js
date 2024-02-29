const fs = require('fs')
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
        timeout: 600000,
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
    
    const utxos = await blockchain.utxos(Address.fromString('18bSDTn4wxTVwMyNpthTEyfwW7afeeiWbN').toTxOutScript().toHex())
    console.log("utxos", utxos.length)
    const jigs = [];
    for (const utxo of utxos) {
        // if(utxo.value != 273) continue
        try {
            const jig = await run.load(`${utxo.txid}_o${utxo.vout}`)
            jigs.push(jig)
            console.log("jig", jig, "meta:", jig.constructor.metadata)
            fs.writeFileSync(`jigs/${jig.location}.json`, JSON.stringify({
                ...jig,
                constructor: {
                    ...jig.constructor
                }
            }, null, 2))
        } catch (e) {
            console.error(e)
        }
    }
}

main().catch(console.error).then(() => process.exit(0))