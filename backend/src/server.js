import dotenv from 'dotenv'

import app from './app.js'
import { connectDb } from './config/db.js'
dotenv.config()

const port = process.env.PORT || 5000

async function start () {
  await connectDb()
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${port}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err)
  process.exit(1)
})
