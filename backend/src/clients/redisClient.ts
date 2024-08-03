import Redis from 'ioredis';

// Create a Redis client instance
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  // Add any other Redis configuration options here
});

export default redisClient;
