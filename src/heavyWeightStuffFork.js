const { hash } = require('bcryptjs');

const doHeavyWeightStuff = async (value=process.env.VALUE) => {
  const hashval = await hash(value, 12);
  
  process.send(hashval)
}

doHeavyWeightStuff();

module.exports = doHeavyWeightStuff
