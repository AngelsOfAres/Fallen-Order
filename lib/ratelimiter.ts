import { pRateLimit } from 'p-ratelimit';

export const rateLimiter = pRateLimit({
  interval: 1000,
  rate: 50,
  concurrency: 25,
})