import dayjs from 'dayjs';
import init from '.';

const main = async () => {
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
    },
  });

  const pools = await engine.listPools();
  console.log(pools);
  const reward = await engine.draw({ poolIds: pools.map((pool) => pool._id.toString()) });
  console.log(reward);
};

main();
