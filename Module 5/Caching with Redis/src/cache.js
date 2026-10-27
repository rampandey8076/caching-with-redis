const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true,
  retryStrategy: () => null,
});

async function cacheGet(key) {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }

    const value = await redis.get(key);
    return value === null ? null : JSON.parse(value);
  } catch (error) {
    console.error('[cache] GET error:', error.message);
    return null;
  }
}

async function cacheSet(key, data, ttlSeconds) {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }

    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (error) {
    console.error('[cache] SET error:', error.message);
  }
}

async function cacheDel(key) {
  try {
    if (redis.status === 'wait') {
      await redis.connect();
    }

    await redis.del(key);
  } catch (error) {
    console.error('[cache] DEL error:', error.message);
  }
}

module.exports = { redis, cacheGet, cacheSet, cacheDel };
