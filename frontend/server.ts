// server.ts
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { processAIResponses } from './process-ai-responses'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
    
    // Start the RabbitMQ consumer
    processAIResponses().catch(error => {
      console.error('Failed to start RabbitMQ consumer:', error)
    })
  })
})