import mongoose from 'mongoose';
import { PoolConfig, Reward } from './types';
declare const init: ({ mongoUrl, debug, cleanUpPools, }: {
    mongoUrl: string;
    debug?: boolean | undefined;
    cleanUpPools?: boolean | undefined;
}) => Promise<{
    listPools: () => Promise<(mongoose.Document<unknown, {}, import("./types").IPool> & Omit<import("./types").IPool & {
        _id: mongoose.Types.ObjectId;
    }, never>)[]>;
    createPool: ({ name, startTime, endTime, initialAmount, config, data, }: {
        name: string;
        startTime: Date;
        endTime: Date;
        initialAmount: number;
        config?: PoolConfig | undefined;
        data?: {
            [key: string]: any;
        } | undefined;
    }) => Promise<mongoose.Document<unknown, {}, import("./types").IPool> & Omit<import("./types").IPool & {
        _id: mongoose.Types.ObjectId;
    }, never>>;
    enablePool: (poolId: string) => Promise<void>;
    disablePool: (poolId: string) => Promise<void>;
    draw: ({ poolIds, accessRate, timestamp, }: {
        poolIds: string[];
        accessRate?: number | undefined;
        timestamp?: Date | undefined;
    }) => Promise<Reward | undefined>;
}>;
export { init };
export default init;
//# sourceMappingURL=index.d.ts.map