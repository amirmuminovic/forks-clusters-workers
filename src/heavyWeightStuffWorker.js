const { hash } = require('bcryptjs');
const {
  parentPort, workerData
} = require('worker_threads');

const doHeavyWeightStuff = async () => {
  const hashval = await hash(workerData.value, 12);
  
  parentPort.postMessage(hashval)
}

doHeavyWeightStuff();

module.exports = doHeavyWeightStuff
