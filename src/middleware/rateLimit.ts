// Import the necessary dependencies
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'
import { RequestHandler } from 'express'
import Redis from 'ioredis'
import { CreateError } from './errorHandler'
import { redisConfig } from '../config/database'
import { globalConfig } from '../config/global'

const redisClient = new Redis(redisConfig.url) // Use the url from the redisConfig object

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: globalConfig.rateLimitPoints,
  duration: globalConfig.rateLimitDuration,
})

export const rateLimit: RequestHandler = async (req, res, next) => {
  try {
    await rateLimiter
      .consume(req.ip, 1) // consumes 1 point
      .then((info: RateLimiterRes) => {
        const rateLimiterHeaders = {
          'Retry-After': info.msBeforeNext / 1000,
          'X-RateLimit-Limit': rateLimiter.points,
          'X-RateLimit-Remaining': info.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + info.msBeforeNext),
        }
        res.set(rateLimiterHeaders)
        next()
      })
      .catch((info: RateLimiterRes) => {
        const rateLimiterHeaders = {
          'Retry-After': info.msBeforeNext / 1000,
          'X-RateLimit-Limit': rateLimiter.points,
          'X-RateLimit-Remaining': info.remainingPoints,
          'X-RateLimit-Reset': new Date(Date.now() + info.msBeforeNext),
        }
        res.set(rateLimiterHeaders)
        throw CreateError.TooManyRequests('Rate limit exceeded')
      })
  } catch (error) {
    next(error)
  }
}
