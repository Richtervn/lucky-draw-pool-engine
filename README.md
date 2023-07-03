# Installation

```
npm i lucky-draw-pool-engine
```

# Usage

```js

import { init } from 'lucky-draw-pool-engine'

const engine = await init({
  mongoUrl: 'mongodb://0.0.0.0:27017/lucky-draw-pool-engine',
  debug: true,
  cleanUpPools: true,
});

await engine.createPool({
  name: 'Example',
  initialAmount: 10,
  startTime: dayjs().toDate(),
  endTime: dayjs().add(10, 'd').toDate(),
  config: {
    minRate: 0,
    maxRate: 100,
    controlPoints: [[0,0],[1,1]]
  },
});
const pools = await engine.listPools();
console.log(pools);
const reward = await engine.draw({ poolIds: pools.map((pool) => pool._id.toString()), timestamp: new Date() });
console.log(reward);

```