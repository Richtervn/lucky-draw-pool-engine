"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PoolSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    initialAmount: { type: Number, required: true },
    unclaimed: { type: Number, required: true },
    status: { type: String },
    startTime: { type: Date, index: -1 },
    endTime: { type: Date, index: -1 },
    createdAt: { type: Date, default: function () { return Date.now(); } },
    disabledAt: { type: Date },
    config: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    data: { type: mongoose_1.Schema.Types.Mixed, default: {} },
});
exports.default = PoolSchema;
