const app = require('express')();

const {
  startTimer, generateHash, endTimer, generateHashFork, generateHashWorkerThreads
} = require('./functions')

app.get('/single-thread/:value', startTimer, generateHash, endTimer)
app.get('/fork/:value', startTimer, generateHashFork, endTimer)
app.get('/worker-thread/:value', startTimer, generateHashWorkerThreads, endTimer)

app.listen(3000, () => {
  console.log('+++++++++++++++++++++++++++++');
  console.log('Server is live on port 3000!');
  console.log('+++++++++++++++++++++++++++++');
})