const cluster = require('cluster');
const app = require('express')();
const { hash } = require('bcryptjs');
const numCPUs = require('os').cpus().length;

const startTimer = (req, res, next) => {
  req.startTime = new Date();
  next()
}
const endTimer = (req, res) => {
  const response = {
    data: req.data,
    duration: new Date() - req.startTime
  }
  res.send(response);
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  app.get('/cluster/:value', startTimer, async (req, res, next) => {
    const { value } = req.params;
    req.data = await hash(value, 12);
    next()
  }, endTimer)

  app.listen(8000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}