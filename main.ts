import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import Run from 'run-sdk';

import { Blockchain } from './blockchain';
import { Cache } from './cache';

const { PORT, REDIS } = process.env;

let redis = new Redis({
    port: 6379,
    host: REDIS,
    reconnectOnError: (e) => 2,
});
const cache = new Cache(redis);
const blockchain = new Blockchain();
const run = new Run({
    network: 'main',
    blockchain,
    cache,
    timeout: 60000,
    trust: '*',
    state: new Run.plugins.LocalState(),
});

const app = express();
app.listen(PORT || 8080, () => {
    console.log(`listening on *:${PORT}`);
});

app.get('/', (req, res, next) => {
    res.status(200).send('OK');
});

app.get('/health', (req, res, next) => {
    res.status(200).send('OK');
});

app.post('/:txid', async (req: Request, res: Response, next: NextFunction) => {
    const { txid } = req.params;

    console.time(`Indexing: ${txid}`);
    try {
        const rawtx = await blockchain.fetch(txid);
        const t = await run.import(rawtx, { trust: true });
        await t.cache();
    } finally {
        console.timeEnd(`Indexed: ${txid}`);
    }
});

process.on('exit', () => console.log('Shut down'));

