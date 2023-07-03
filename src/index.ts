import mongoose from 'mongoose';
import { ERRORS, PoolConfig, PoolStatus, Reward } from './types';
import PoolSchema from './models/Pool.schema';
import dayjs from 'dayjs';
import { randomInt } from './utils';
//@ts-ignore;
import bezier from 'cubic-bezier';

const init = async ({
  mongoUrl,
  debug,
  cleanUpPools,
}: {
  mongoUrl: string;
  debug?: boolean;
  cleanUpPools?: boolean;
}) => {
  let db: typeof mongoose;
  const RATE_DEMICAL_PLACES = 2;
  const RATE_DEMICAL_PLACES_MULTIPLIER = Math.pow(RATE_DEMICAL_PLACES, 10);

  try {
    db = await mongoose.connect(mongoUrl);
  } catch (e) {
    throw new Error(ERRORS.ERR_DB_CONN);
  }

  const Pool = db.model('Pool', PoolSchema, 'Pool');
  if (cleanUpPools) {
    await Pool.deleteMany({});
  }

  const listPools = async () => {
    const pools = await Pool.find();
    return pools;
  };

  const createPool = async ({
    name,
    startTime,
    endTime,
    initialAmount,
    config,
    data,
  }: {
    name: string;
    startTime: Date;
    endTime: Date;
    initialAmount: number;
    config?: PoolConfig;
    data?: { [key: string]: any };
  }) => {
    const pool = await Pool.create({
      name,
      startTime,
      endTime,
      initialAmount,
      unclaimed: initialAmount,
      status: PoolStatus.ACTIVE,
      config,
      data,
    });
    return pool;
  };

  const disablePool = async (poolId: string) => {
    await Pool.updateOne({ _id: poolId }, { $set: { status: PoolStatus.DISABLED, disabledAt: Date.now() } });
  };
  const enablePool = async (poolId: string) => {
    await Pool.updateOne({ _id: poolId }, { $set: { status: PoolStatus.ACTIVE } });
  };

  const draw = async ({
    poolIds,
    accessRate,
    timestamp,
  }: {
    poolIds: string[];
    accessRate?: number;
    timestamp?: Date;
  }) => {
    const handlingData: { [key: string]: any } = {};
    handlingData.accessRate = 100;
    if (accessRate || accessRate === 0) {
      handlingData.accessRate = accessRate;
    }
    handlingData.accessRollResult = randomInt(0, 100 * RATE_DEMICAL_PLACES_MULTIPLIER - 1);
    handlingData.poolsAccessed =
      handlingData.accessRollResult < handlingData.accessRate * RATE_DEMICAL_PLACES_MULTIPLIER;
    if (!handlingData.poolsAccessed) {
      if (debug) {
        console.log(handlingData);
      }
      return;
    }

    const currentTime = dayjs(timestamp);
    let reward: Reward | undefined = undefined;
    const pools = await Pool.find({ _id: { $in: poolIds }, status: PoolStatus.ACTIVE });

    handlingData.pools = [];
    for (const pool of pools) {
      const handlingPoolData: { [key: string]: any } = { poolId: pool._id };
      let startTime = dayjs(pool.startTime);
      let endTime = dayjs(pool.endTime);
      let maxRate = 100;
      let minRate = 0;
      if (pool.config?.maxRate || pool.config?.maxRate === 0) {
        maxRate = pool.config.maxRate;
      }
      if (pool.config?.minRate) {
        minRate = pool.config.minRate;
      }

      handlingPoolData.burntAmount = pool.initialAmount - pool.unclaimed;
      handlingPoolData.rate = 0;
      handlingPoolData.expectedBurnSpeed = endTime.diff(startTime, 'ms') / pool.initialAmount;
      handlingPoolData.expectedBurnAmount = currentTime.diff(startTime, 'ms') / handlingPoolData.expectedBurnSpeed;

      handlingPoolData.remaining = handlingPoolData.expectedBurnAmount - handlingPoolData.burntAmount;
      if (handlingPoolData.remaining <= 0) {
        handlingData.pools.push(handlingPoolData);
        continue;
      }

      handlingPoolData.controlPoints = pool.config?.controlPoints || [
        [0, 0],
        [1, 1],
      ];
      let rateFormula = bezier(
        handlingPoolData.controlPoints[0][0],
        handlingPoolData.controlPoints[0][1],
        handlingPoolData.controlPoints[1][0],
        handlingPoolData.controlPoints[1][1],
        1000 / 60 / handlingPoolData.expectedBurnSpeed / 4
      );
      console.log(maxRate, minRate, rateFormula(handlingPoolData.expectedBurnAmount - handlingPoolData.burntAmount));
      const rate =
        ((maxRate - minRate) * rateFormula(handlingPoolData.expectedBurnAmount - handlingPoolData.burntAmount) +
          minRate) *
        RATE_DEMICAL_PLACES_MULTIPLIER;

      handlingPoolData.rate = rate / RATE_DEMICAL_PLACES_MULTIPLIER;
      handlingPoolData.rollResult = randomInt(0, 100 * RATE_DEMICAL_PLACES_MULTIPLIER - 1);
      handlingPoolData.poolWinned = handlingPoolData.rollResult < rate;
      if (!handlingPoolData.poolWinned) {
        handlingData.pools.push(handlingPoolData);
        continue;
      }

      try {
        const updatedPool = await Pool.findOneAndUpdate(
          {
            _id: pool._id,
            unclaimed: { $gte: 1, $eq: pool.unclaimed },
          },
          { $inc: { unclaimed: -1 } },
          { new: true }
        );
        if (!updatedPool) {
          handlingData.pools.push(handlingPoolData);
          continue;
        } else {
          reward = {
            poolName: updatedPool.name,
            poolId: updatedPool._id.toString(),
            poolData: updatedPool.data,
          };
          handlingData.pools.push(handlingPoolData);
          break;
        }
      } catch (e: any) {
        handlingPoolData.error = e.message;
        handlingData.pools.push(handlingPoolData);
      }
    }
    if (debug) {
      console.log(JSON.stringify(handlingData, null, 2));
    }
    return reward;
  };

  return { listPools, createPool, enablePool, disablePool, draw };
};

export { init };
export default init;
