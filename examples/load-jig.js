const Blockchain = require('../blockchain')
const Cache = require('../cache')
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

    const jig = await run.load('507601c31a6d3979e61f6bc35c48f11ee56250f24fac1a8580381de5711b0ba1_o3')
    console.log("jig", jig)
    console.log("meta:", jig.constructor.metadata)
}

main().catch(console.error).then(() => process.exit(0))