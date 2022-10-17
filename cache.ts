import AWS from 'aws-sdk'
import Run from 'run-sdk'

const BUCKET = '';
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const localCache =  new Run.plugins.LocalCache({maxSizeMB: 100});

export interface ICache {
    get(key: string): Promise<any>;
    set(key:string, value: any): Promise<void>;
}
export class Cache {
    constructor(
        public redis,
    ) {}
    async get(key: string) {
        if(!key.startsWith('jig://')) return;

        const value = await localCache.get(key);
        if(value) return value;

        const cacheKey = `state/${key}`;
        let valueString = await this.redis.get(cacheKey);
        if (!valueString) {
            console.log('Cache Miss:', key);
            const obj = await s3.getObject({
                Bucket: BUCKET,
                Key: cacheKey
            }).promise().catch(() => null);
            if (obj && obj.Body) {
                valueString = obj.Body.toString('utf8');
                this.redis.set(cacheKey, valueString);
            }
        }
        if(valueString) {
            localCache.set(key, value);
            return JSON.parse(valueString);
        }
    }
    async set(key:string, value: any) {
        if(key.startsWith('jig://')) return;
        localCache.set(key, value);
        
        const cacheKey = `state/${key}`;
        const valueString = JSON.stringify(value);
        await this.redis.set(cacheKey, valueString);
        await s3.putObject({
            Bucket: BUCKET,
            Key: cacheKey,
            Body: valueString
        }).promise();
    }
}

