"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var engine_1 = require("machinomy/dist/lib/engines/engine");
var PaymentService_1 = require("../services/PaymentService");
var bignumber_js_1 = require("bignumber.js");
var router = express.Router();
exports.router = router;
require('dotenv').config();
var HUB_ADDRESS = process.env.HUB_ADDRESS;
if (!HUB_ADDRESS)
    throw new Error('Please, set HUB_ADDRESS env variable');
var ETH_RPC_URL = process.env.ETH_RPC_URL;
if (!ETH_RPC_URL)
    throw new Error('Please, set ETH_RPC_URL env variable');
var DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL)
    throw new Error('Please, set DATABASE_URL env variable');
var TABLE_OR_COLLECTION_NAME = process.env.TABLE_OR_COLLECTION_NAME;
if (!TABLE_OR_COLLECTION_NAME)
    throw new Error('Please, set TABLE_OR_COLLECTION_NAME env variable');
var dbEngine;
// tslint:disable-next-line:no-unnecessary-type-assertion
var splits = DATABASE_URL.split('://');
switch (splits[0]) {
    case 'mongodb': {
        // tslint:disable-next-line:no-unnecessary-type-assertion
        dbEngine = new engine_1.EngineMongo(DATABASE_URL);
        break;
    }
    case 'postgresql': {
        // tslint:disable-next-line:no-unnecessary-type-assertion
        dbEngine = new engine_1.EnginePostgres(DATABASE_URL);
        break;
    }
    case 'sqlite': {
        dbEngine = new engine_1.EngineSQLite(splits[1]);
        break;
    }
    default:
        throw new Error("Invalid engine: " + splits[0] + ".");
}
var paymentService = new PaymentService_1.default(HUB_ADDRESS, ETH_RPC_URL, dbEngine, DATABASE_URL, TABLE_OR_COLLECTION_NAME);
dbEngine.connect().then(function () {
    router.post('/accept', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var token, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, paymentService.acceptPayment(req.body.payment)];
                case 1:
                    token = _a.sent();
                    res.status(202).header('Paywall-Token', token).send({ token: token }).end();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1.message);
                    res.status(403).send({ error: err_1 });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    router.head('/accept', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.get('origin')).send();
    });
    router.get('/verify', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var meta, token, price, isOk, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.query.meta === undefined)) return [3 /*break*/, 1];
                    res.status(403).send({ error: 'meta is invalid' });
                    return [3 /*break*/, 7];
                case 1:
                    if (!(req.query.token === undefined)) return [3 /*break*/, 2];
                    res.status(403).send({ error: 'token is invalid' });
                    return [3 /*break*/, 7];
                case 2:
                    if (!(req.query.price === undefined)) return [3 /*break*/, 3];
                    res.status(403).send({ error: 'price is invalid' });
                    return [3 /*break*/, 7];
                case 3:
                    meta = req.query.meta;
                    token = req.query.token;
                    price = new bignumber_js_1.default(req.query.price);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, paymentService.verify(meta, token, price)];
                case 5:
                    isOk = _a.sent();
                    if (isOk) {
                        res.status(200).send({ status: 'ok' });
                    }
                    else {
                        res.status(403).send({ error: 'token is invalid' });
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _a.sent();
                    res.status(403).send({ error: err_2 });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=index.js.map