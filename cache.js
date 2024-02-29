require('dotenv').config();
const Redis = require('ioredis');
const redis = new Redis(`${process.env.REDIS_URL}`);

class Cache {
    async get(key) {
        if (!key.startsWith('jig://') && !key.startsWith('berry://')) return;

        let valueString = await redis.get(key);
        if (valueString) {
            return JSON.parse(valueString);
        }
    }

    async set(key, value) {
        if (!key.startsWith('jig://') && !key.startsWith('berry://')) return;

        const valueString = JSON.stringify(value);
        await redis.set(key, valueString);
    }
}

module.exports = Cache;
