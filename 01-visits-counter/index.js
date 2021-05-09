import express from 'express'
import redis from 'redis'

const app = express()
const client = redis.createClient()
client.set('visits', 0)

app.get('/', (req, res) => {
  client.get('visits', (err, visits) => {
    res.send(`Number of visits is ${visits}`)

    client.set('visits', +visits + 1)
  })
})

app.listen(8081, () => {
  console.log('Listening on port 8081')
})
