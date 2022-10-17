import Run from 'run-sdk'
const localCache =  new Run.plugins.LocalCache({maxSizeMB: 100});

export class Blockchain {
    public network = 'main';

    async broadcast(rawtx) {
        throw new Error('Not Implemented')
    }

    async fetch(txid: string): Promise<string> {
        const cacheKey = `tx/${txid}`;
        let rawtx = localCache.get(cacheKey)
        if(!rawtx) {
            // rawtx = getRawTx(txid)
    
            localCache.set(cacheKey, rawtx)
        }

        return rawtx;
    };

    async time(txid: string): Promise<number> {
        throw new Error('Not Implemented')
    }

    async spends(txid: string, vout: number): Promise<string | null> {
        throw new Error('Not Implemented')
    }

    async utxos(scriptHex: string): Promise<any[]> {
        throw new Error('Not Implemented')
    };
}
