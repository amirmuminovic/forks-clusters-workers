const axios = require('axios');
const { appendFile } = require('fs')

const interval = 200; //1000

const pollApi = async (interval, route, i, port=3000) => {
  if (i < 100) {
    console.log(route + ' ' + i)
    const caller = i;
    const { data } = await axios.get(`http://localhost:${port}/${route}/${parseInt(String(Math.random()*10000), 16)}`);
    appendFile(`./generated/${route}.txt`, caller + ' ' + data.duration + '\n', (err) => {
      if (err) {
        throw new Error(err)
      }
    })
  } else{
    clearInterval(interval)
  }
}

let i = [0, 0, 0, 0];
const intervalSingleThread = setInterval(async () => {
  i[0] += 1
  await pollApi(intervalSingleThread, 'single-thread', i[0])
}, interval)

const intervalFork = setInterval(async () => {
  i[1] += 1
  await pollApi(intervalFork, 'fork', i[1])
}, interval)

const intervalCluster = setInterval(async () => {
  i[2] += 1;
  await pollApi(intervalCluster, 'cluster', i[2], 8000)
}, interval)

const intervalWorker = setInterval(async () => {
  i[3] += 1
  await pollApi(intervalWorker, 'worker-thread', i[3])
}, interval)
