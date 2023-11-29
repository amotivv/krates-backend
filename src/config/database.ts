import dotenv from 'dotenv'

dotenv.config()

export const mongoConfig = {
  databaseName: process.env.DB_NAME ? process.env.DB_NAME : 'krates_dev',
  mongoUrl: process.env.MONGO_HOST ? process.env.MONGO_HOST : 'mongodb://localhost:27017',
}

export const redisConfig = {
  url: process.env.REDIS_URL || '',
}
