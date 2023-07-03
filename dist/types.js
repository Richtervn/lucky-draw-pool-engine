"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS = exports.PoolStatus = void 0;
var PoolStatus;
(function (PoolStatus) {
    PoolStatus["ACTIVE"] = "ACTIVE";
    PoolStatus["DISABLED"] = "DISABLED";
})(PoolStatus || (exports.PoolStatus = PoolStatus = {}));
var ERRORS;
(function (ERRORS) {
    ERRORS["ERR_DB_CONN"] = "ERR_DB_CONN";
})(ERRORS || (exports.ERRORS = ERRORS = {}));
