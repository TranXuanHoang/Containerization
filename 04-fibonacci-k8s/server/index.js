import cors from 'cors'
import express from 'express'
import PostgreSQLClient from 'pg'
import redis from 'redis'
import {
  pgDatabase,
  pgHost,
  pgPassword,
  pgPort,
  pgUser,
  redisHost,
  redisPort
} from './keys.js'

// Express app setup
const app = express()

// CORS config - allowing the client React app running on
// a different domain to call APIs hosted on this server side
// Express app
app.use(cors())

// Convert the body of the request to JSON data
app.use(express.json())

// PostgreSQL client setup
const { Pool } = PostgreSQLClient
const pgClient = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort
})

// Create a table in the PG DB
// Table name = 'values'
pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.error(err))
})

// Redis client setup
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate()

// Express route handlers
app.get('/', (req, res) => {
  res.send('Hi')
})

// Retrieve all submitted values from the PostgreSQL DB
app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values')

  // Just send back values.rows that contains only table row records
  res.send(values.rows)
})

// Retrieve current value submitted from the client React app
app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    if (err) {
      return res.send({})
    }
    res.send(values ? values : {})
  })
})

// Handle request of calculating Fibonacci
app.post('/values', async (req, res) => {
  const index = req.body.index

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high')
  }

  // At the begining, just set the value as 'Nothing yet!'
  redisClient.hset('values', index, 'Nothing yet!')

  // Pulish a new insert event to wake up the worker process
  // to calculate the Fibonacci
  redisPublisher.publish('insert', index)

  // Save the submitted 'index' to the PostgreSQL DB
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index])

  res.send({ working: true })
})

app.listen(5000, err => {
  if (err) {
    console.log(err)
  }
  console.log('Server is listening on port 5000!')
})
