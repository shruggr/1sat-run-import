const Blockchain = require('./blockchain')
const Cache = require('./cache')
const Run = require('run-sdk')

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

    const utxos = await blockchain.utxos('76a9144b57366a650609d7f297271d7fb5f305485f7f9888ac')
    for (const utxo of utxos) {
        // if(utxo.value != 273) continue
        try {
            const jig = await run.load(`${utxo.txid}_o${utxo.vout}`)
            console.log("jig", jig, "meta:", jig.constructor.metadata)
        } catch (e) {
            // console.error(e)
        }
    }
}

main().catch(console.error).then(() => process.exit(0))