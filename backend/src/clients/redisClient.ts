import Redis from 'ioredis';

// Create a Redis client instance
const redisClient = new Redis({
  host: 'redis',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
});

export default redisClient;
