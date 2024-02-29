const express = require('express');
const app = express();
const port = 3000;

const Blockchain = require('./blockchain')
const Cache = require('./cache')
const Run = require('run-sdk')
const { Address } = require('@ts-bitcoin/core')

const blockchain = new Blockchain()
const cache = new Cache()
const run = new Run({
    network: 'main',
    blockchain,
    timeout: 600000,
    cache,
    trust: '*',
    state: new Run.plugins.LocalState(),
})

app.get('/address/:address', async (req, res) => {
    const utxos = await blockchain.utxos(Address.fromString(req.params.address).toTxOutScript().toHex())

    const jigs = [];
    for (const utxo of utxos) {
        // if(utxo.value != 273) continue
        try {
            const jig = await run.load(`${utxo.txid}_o${utxo.vout}`)
            jigs.push(jig)
        } catch (e) {
            console.error(e)
        }
    }
    res.json(jigs);
});

app.get('/location/:location', async (req, res) => {
    const jig = await run.load(req.params.location)
    res.json(jig);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
