const express = require('express');
const app = express();
const { PORT } = process.env;

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
    // const utxos = await blockchain.utxos(Address.fromString(req.params.address).toTxOutScript().toHex())
    const resp = await fetch(`https://ordinals.gorillapool.io/api/txos/address/${address.toString()}/unspent?limit=${req.params.limit || 25}&offset=${req.params.offset || 0}`);
    if (resp.status !== 200) {
        throw new Error('Transaction not found');
    }
    const utxos = await resp.json();

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

app.listen(PORT || 3000, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
