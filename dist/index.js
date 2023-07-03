"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var types_1 = require("./types");
var Pool_schema_1 = __importDefault(require("./models/Pool.schema"));
var dayjs_1 = __importDefault(require("dayjs"));
var utils_1 = require("./utils");
//@ts-ignore;
var cubic_bezier_1 = __importDefault(require("cubic-bezier"));
var init = function (_a) {
    var mongoUrl = _a.mongoUrl, debug = _a.debug, cleanUpPools = _a.cleanUpPools;
    return __awaiter(void 0, void 0, void 0, function () {
        var db, RATE_DEMICAL_PLACES, RATE_DEMICAL_PLACES_MULTIPLIER, e_1, Pool, listPools, createPool, disablePool, enablePool, draw;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    RATE_DEMICAL_PLACES = 2;
                    RATE_DEMICAL_PLACES_MULTIPLIER = Math.pow(RATE_DEMICAL_PLACES, 10);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, mongoose_1.default.connect(mongoUrl)];
                case 2:
                    db = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    throw new Error(types_1.ERRORS.ERR_DB_CONN);
                case 4:
                    Pool = db.model('Pool', Pool_schema_1.default, 'Pool');
                    if (!cleanUpPools) return [3 /*break*/, 6];
                    return [4 /*yield*/, Pool.deleteMany({})];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    listPools = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var pools;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Pool.find()];
                                case 1:
                                    pools = _a.sent();
                                    return [2 /*return*/, pools];
                            }
                        });
                    }); };
                    createPool = function (_a) {
                        var name = _a.name, startTime = _a.startTime, endTime = _a.endTime, initialAmount = _a.initialAmount, config = _a.config, data = _a.data;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var pool;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, Pool.create({
                                            name: name,
                                            startTime: startTime,
                                            endTime: endTime,
                                            initialAmount: initialAmount,
                                            unclaimed: initialAmount,
                                            status: types_1.PoolStatus.ACTIVE,
                                            config: config,
                                            data: data,
                                        })];
                                    case 1:
                                        pool = _b.sent();
                                        return [2 /*return*/, pool];
                                }
                            });
                        });
                    };
                    disablePool = function (poolId) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Pool.updateOne({ _id: poolId }, { $set: { status: types_1.PoolStatus.DISABLED, disabledAt: Date.now() } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    enablePool = function (poolId) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Pool.updateOne({ _id: poolId }, { $set: { status: types_1.PoolStatus.ACTIVE } })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    draw = function (_a) {
                        var poolIds = _a.poolIds, accessRate = _a.accessRate, timestamp = _a.timestamp;
                        return __awaiter(void 0, void 0, void 0, function () {
                            var handlingData, currentTime, reward, pools, _i, pools_1, pool, handlingPoolData, startTime, endTime, maxRate, minRate, rateFormula, rate, updatedPool, e_2;
                            var _b, _c, _d, _e;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        handlingData = {};
                                        handlingData.accessRate = 100;
                                        if (accessRate || accessRate === 0) {
                                            handlingData.accessRate = accessRate;
                                        }
                                        handlingData.accessRollResult = (0, utils_1.randomInt)(0, 100 * RATE_DEMICAL_PLACES_MULTIPLIER - 1);
                                        handlingData.poolsAccessed =
                                            handlingData.accessRollResult < handlingData.accessRate * RATE_DEMICAL_PLACES_MULTIPLIER;
                                        if (!handlingData.poolsAccessed) {
                                            if (debug) {
                                                console.log(handlingData);
                                            }
                                            return [2 /*return*/];
                                        }
                                        currentTime = (0, dayjs_1.default)(timestamp);
                                        reward = undefined;
                                        return [4 /*yield*/, Pool.find({ _id: { $in: poolIds }, status: types_1.PoolStatus.ACTIVE })];
                                    case 1:
                                        pools = _f.sent();
                                        handlingData.pools = [];
                                        _i = 0, pools_1 = pools;
                                        _f.label = 2;
                                    case 2:
                                        if (!(_i < pools_1.length)) return [3 /*break*/, 7];
                                        pool = pools_1[_i];
                                        handlingPoolData = { poolId: pool._id };
                                        startTime = (0, dayjs_1.default)(pool.startTime);
                                        endTime = (0, dayjs_1.default)(pool.endTime);
                                        maxRate = 100;
                                        minRate = 0;
                                        if (((_b = pool.config) === null || _b === void 0 ? void 0 : _b.maxRate) || ((_c = pool.config) === null || _c === void 0 ? void 0 : _c.maxRate) === 0) {
                                            maxRate = pool.config.maxRate;
                                        }
                                        if ((_d = pool.config) === null || _d === void 0 ? void 0 : _d.minRate) {
                                            minRate = pool.config.minRate;
                                        }
                                        handlingPoolData.burntAmount = pool.initialAmount - pool.unclaimed;
                                        handlingPoolData.rate = 0;
                                        handlingPoolData.expectedBurnSpeed = endTime.diff(startTime, 'ms') / pool.initialAmount;
                                        handlingPoolData.expectedBurnAmount = currentTime.diff(startTime, 'ms') / handlingPoolData.expectedBurnSpeed;
                                        handlingPoolData.remaining = handlingPoolData.expectedBurnAmount - handlingPoolData.burntAmount;
                                        if (handlingPoolData.remaining <= 0) {
                                            handlingData.pools.push(handlingPoolData);
                                            return [3 /*break*/, 6];
                                        }
                                        handlingPoolData.controlPoints = ((_e = pool.config) === null || _e === void 0 ? void 0 : _e.controlPoints) || [
                                            [0, 0],
                                            [1, 1],
                                        ];
                                        rateFormula = (0, cubic_bezier_1.default)(handlingPoolData.controlPoints[0][0], handlingPoolData.controlPoints[0][1], handlingPoolData.controlPoints[1][0], handlingPoolData.controlPoints[1][1], 1000 / 60 / handlingPoolData.expectedBurnSpeed / 4);
                                        console.log(maxRate, minRate, rateFormula(handlingPoolData.expectedBurnAmount - handlingPoolData.burntAmount));
                                        rate = ((maxRate - minRate) * rateFormula(handlingPoolData.expectedBurnAmount - handlingPoolData.burntAmount) +
                                            minRate) *
                                            RATE_DEMICAL_PLACES_MULTIPLIER;
                                        handlingPoolData.rate = rate / RATE_DEMICAL_PLACES_MULTIPLIER;
                                        handlingPoolData.rollResult = (0, utils_1.randomInt)(0, 100 * RATE_DEMICAL_PLACES_MULTIPLIER - 1);
                                        handlingPoolData.poolWinned = handlingPoolData.rollResult < rate;
                                        if (!handlingPoolData.poolWinned) {
                                            handlingData.pools.push(handlingPoolData);
                                            return [3 /*break*/, 6];
                                        }
                                        _f.label = 3;
                                    case 3:
                                        _f.trys.push([3, 5, , 6]);
                                        return [4 /*yield*/, Pool.findOneAndUpdate({
                                                _id: pool._id,
                                                unclaimed: { $gte: 1, $eq: pool.unclaimed },
                                            }, { $inc: { unclaimed: -1 } }, { new: true })];
                                    case 4:
                                        updatedPool = _f.sent();
                                        if (!updatedPool) {
                                            handlingData.pools.push(handlingPoolData);
                                            return [3 /*break*/, 6];
                                        }
                                        else {
                                            reward = {
                                                poolName: updatedPool.name,
                                                poolId: updatedPool._id.toString(),
                                                poolData: updatedPool.data,
                                            };
                                            handlingData.pools.push(handlingPoolData);
                                            return [3 /*break*/, 7];
                                        }
                                        return [3 /*break*/, 6];
                                    case 5:
                                        e_2 = _f.sent();
                                        handlingPoolData.error = e_2.message;
                                        handlingData.pools.push(handlingPoolData);
                                        return [3 /*break*/, 6];
                                    case 6:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 7:
                                        if (debug) {
                                            console.log(JSON.stringify(handlingData, null, 2));
                                        }
                                        return [2 /*return*/, reward];
                                }
                            });
                        });
                    };
                    return [2 /*return*/, { listPools: listPools, createPool: createPool, enablePool: enablePool, disablePool: disablePool, draw: draw }];
            }
        });
    });
};
exports.init = init;
exports.default = init;
