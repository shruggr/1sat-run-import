require('dotenv').config();

const { Address, Script } = require('@ts-bitcoin/core');
require('isomorphic-fetch')

const Run = require('run-sdk');
const localCache = new Run.plugins.LocalCache({ maxSizeMB: 100 });

const Redis = require('ioredis');
const { REDIS_URL } = process.env;

const redis = new Redis(`${REDIS_URL}`);

class Blockchain {
    network = 'main';

    async broadcast(rawtx) {
        throw new Error('Not Implemented');
    }

    async fetch(txid) {
        const cacheKey = `tx:${txid}`;
        // console.log('fetching', txid, cacheKey)
        let rawtx = await localCache.get(cacheKey);
        if (!rawtx) {
            rawtx = await redis.get(cacheKey);
        }
        if (!rawtx) {
            const url = `https://junglebus.gorillapool.io/v1/transaction/get/${txid}/bin`
            // console.log('fetching', url)
            for (let i = 0; i < 5; i++) {
                try {
                    const resp = await fetch(url);
                    if (resp.status !== 200) {
                        throw new Error('Transaction not found');
                    }
                    rawtx = Buffer.from(await resp.arrayBuffer()).toString('hex');
                    break;
                } catch (e) {
                    if (i === 4) {
                        throw e;
                    }
                    // console.error(e);
                }
            }
            // const resp = await fetch(url);
            // if (resp.status !== 200) {
            //     throw new Error('Transaction not found');
            // }
            // rawtx = Buffer.from(await resp.arrayBuffer()).toString('hex');

            await redis.set(cacheKey, rawtx);
            localCache.set(cacheKey, rawtx);
        }

        // console.log('fetched', txid, cacheKey, rawtx)
        return rawtx;
    }

    async time(txid) {
        throw new Error('Not Implemented');
    }

    async spends(txid, vout) {
        throw new Error('Not Implemented');
    }

    async utxos(scriptHex, offset = 0, limit = 100) {
        const script = Script.fromHex(scriptHex);
        const address = Address.fromTxOutScript(script);
        let utxos = [];
        let hasMore = true;
    
        while (hasMore) {
            const resp = await fetch(`https://ordinals.gorillapool.io/api/txos/address/${address.toString()}/unspent?offset=${offset}&limit=${limit}`);
            if (resp.status !== 200) {
                throw new Error('Transaction not found');
            }
            const fetchedUtxos = await resp.json();
            utxos = [...utxos, ...fetchedUtxos.map(u => ({
                txid: u.txid,
                vout: u.vout,
                value: u.satoshis,
                script: scriptHex,
            }))];
    
            hasMore = fetchedUtxos.length === limit;
            offset += limit;
        }
    
        return utxos;
    }
}

module.exports = Blockchain;
