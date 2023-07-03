import { Schema } from 'mongoose';
import { IPool } from '../types';

const PoolSchema = new Schema<IPool>({
  name: { type: String, required: true },
  initialAmount: { type: Number, required: true },
  unclaimed: { type: Number, required: true },
  status: { type: String },
  startTime: { type: Date, index: -1 },
  endTime: { type: Date, index: -1 },
  createdAt: { type: Date, default: () => Date.now() },
  disabledAt: { type: Date },
  config: { type: Schema.Types.Mixed, default: {} },
  data: { type: Schema.Types.Mixed, default: {} },
});

export default PoolSchema;
