const { hash } = require('bcryptjs');
const { fork } = require('child_process')
const {
  Worker
} = require('worker_threads');

const startTimer = (req, res, next) => {
  req.startTime = new Date();
  next()
}

const generateHash = async (req, res, next) => {
  const { value } = req.params;
  req.data = await hash(value, 12);
  
  next();
}

const generateHashFork = async (req, res, next) => {
  const { value } = req.params;
  const hashService = fork('./src/heavyWeightStuffFork.js', {
    env: {
      VALUE: value,
    }
  })
  hashService.on('message', (data) => {
    req.data = data;
    next()
  })
}

const generateHashWorkerThreads = async(req, res, next) => {
  const { value } = req.params;
  const worker = new Worker('./src/heavyWeightStuffWorker.js', {
    workerData: {
      value
    }
  });
  worker.on('message', (data) => {
    req.data = data;
    next()
  });
  worker.on('error', (err) => {
    throw new Error(err);
  });
  worker.on('exit', (code) => {
    if (code !== 0)
      reject(new Error(`Worker stopped with exit code ${code}`));
  });
}

const endTimer = (req, res) => {
  const response = {
    data: req.data,
    duration: new Date() - req.startTime
  }
  res.send(response);
}

module.exports = {
  startTimer, 
  generateHash, 
  endTimer, 
  generateHashFork,
  generateHashWorkerThreads
}