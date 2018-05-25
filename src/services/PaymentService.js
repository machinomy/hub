"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var Web3 = require("web3");
var machinomy_1 = require("machinomy");
var bignumber_js_1 = require("bignumber.js");
var signature_1 = require("machinomy/dist/lib/signature");
var pify_1 = require("machinomy/dist/lib/util/pify");
var engine_1 = require("machinomy/dist/lib/engines/engine");
var PaymentService = /** @class */ (function () {
    function PaymentService(receiver, ethereumAPI, dbEngine, databaseUrl, tableOrCollectionName) {
        var web3 = new Web3(new Web3.providers.HttpProvider(ethereumAPI));
        this.machinomy = new machinomy_1.default(receiver, web3, { databaseUrl: databaseUrl });
        this.engine = dbEngine;
        this.tableOrCollectionName = tableOrCollectionName;
        this.ensureTableExists();
    }
    PaymentService.prototype.ensureTableExists = function () {
        var _this = this;
        return this.engine.exec(function (client) { return pify_1.default(function (cb) {
            if (_this.engine instanceof engine_1.EnginePostgres) {
                return client.query("CREATE TABLE IF NOT EXISTS " + _this.tableOrCollectionName + " (token TEXT, meta TEXT)", cb);
            }
            else if (_this.engine instanceof engine_1.EngineSQLite) {
                return client.run("CREATE TABLE IF NOT EXISTS " + _this.tableOrCollectionName + " (token TEXT, meta TEXT)", cb);
            }
        }); });
    };
    PaymentService.prototype.acceptPayment = function (inPayment) {
        var _this = this;
        return this.engine.connect().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var meta, payment, paymentResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        meta = '';
                        if (inPayment.meta) {
                            meta = inPayment.meta.slice(0);
                            delete inPayment.meta;
                        }
                        payment = __assign({}, inPayment, { signature: signature_1.default.fromParts({
                                v: Number(inPayment.v),
                                r: inPayment.r,
                                s: inPayment.s
                            }), value: new bignumber_js_1.default(inPayment.value), price: new bignumber_js_1.default(inPayment.price) });
                        return [4 /*yield*/, this.machinomy.acceptPayment({ payment: payment })];
                    case 1:
                        paymentResponse = _a.sent();
                        if (!meta) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.insert({ meta: meta, token: paymentResponse.token })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, new Promise(function (resolve, reject) { paymentResponse ? resolve(paymentResponse.token) : reject(''); })];
                }
            });
        }); });
    };
    PaymentService.prototype.verify = function (meta, token, price) {
        var _this = this;
        return this.engine.connect().then(function () { return __awaiter(_this, void 0, void 0, function () {
            var res, payment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(token && token !== 'undefined')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.findOne({ meta: meta, token: token })];
                    case 1:
                        res = _a.sent();
                        if (!res) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.machinomy.paymentById(token)];
                    case 2:
                        payment = _a.sent();
                        if (payment && payment.price.equals(price)) {
                            return [2 /*return*/, Promise.resolve(true)];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, Promise.resolve(false)];
                }
            });
        }); });
    };
    PaymentService.prototype.findOne = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.engine.findOne(query, _this.tableOrCollectionName).then(function (resp) {
                if (!resp) {
                    reject({});
                    return;
                }
                resolve({ token: resp['token'], meta: resp['meta'] });
            });
        });
    };
    PaymentService.prototype.insert = function (document) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.engine.insert(document, _this.tableOrCollectionName).then(function (doc) {
                if (!doc) {
                    reject('Empty document');
                    return;
                }
                resolve();
            });
        });
    };
    return PaymentService;
}());
exports.default = PaymentService;
//# sourceMappingURL=PaymentService.js.map