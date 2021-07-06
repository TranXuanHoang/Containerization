import redis from 'redis';
import { redisHost, redisPort } from './keys.js';

const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000 // reconnect every 1000 ms
})

const sub = redisClient.duplicate()

// Function to calculate Fibonacci numbers
const fib = (index) => {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2)
}

sub.on('message', (channel, message) => {
  // Calculate a Fib number, then add a pair of
  // <key = message, value = fib()>
  // into a hash whose name is 'values'
  redisClient.hset('values', message, fib(parseInt(message)))
})
// Any time a value is inserted into Redis, get that value
// and pass it to the sub.on('message')'s callback function
// as the 'message' argument
sub.subscribe('insert')
