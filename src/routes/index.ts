import express, { Router } from 'express'
import { krateRouter } from './krate.routes'
import { metaRouter } from './meta.routes'

export const parentRouter: Router = express.Router()

const isDev = process.env.NODE_ENV === 'development'
const host = isDev ? 'https://alb3lla.ngrok.io' : 'https://krates-frontend-dev-glc8m.ondigitalocean.app'

parentRouter.get('/', (req, res) => {
  res.redirect(301, `${host}`)
})
parentRouter.get('/health', (req, res) => {
  res.json({ uptime: process.uptime(), message: 'OK', timestamp: Date.now() })
})
parentRouter.use('/meta', metaRouter)
parentRouter.use('/', krateRouter)
