export enum PoolStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export enum ERRORS {
  ERR_DB_CONN = 'ERR_DB_CONN',
}

export type PoolConfig = {
  minRate?: number;
  maxRate?: number;
  controlPoints?: [[number, number], [number, number]];
};

export interface IPool {
  name: string;
  initialAmount: number;
  unclaimed: number;
  status: PoolStatus;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  disabledAt: Date;
  config: PoolConfig;
  data: { [key: string]: any };
}

export type Reward = {
  poolId: string;
  poolName: string;
  poolData: { [key: string]: any };
};
