"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const iconv = __importStar(require("iconv-lite"));
const acorn = __importStar(require("acorn"));
const walk = __importStar(require("acorn-walk"));
let TimetableService = class TimetableService {
    getHost() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, axios_1.default)({
                url: 'http://xn--s39aj90b0nb2xw6xh.kr/',
            });
            const $ = (0, cheerio_1.load)(res.data);
            const url = $('frame').attr('src');
            if (!url)
                return;
            return {
                original: url,
                host: new URL(url).hostname,
                port: new URL(url).port,
            };
        });
    }
    getScript(host) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, axios_1.default)({
                url: `http://${host}/st`,
                responseType: 'arraybuffer',
            });
            const $ = (0, cheerio_1.load)(iconv.decode(res.data, 'euc-kr').toString());
            return $('head script').text();
        });
    }
    findScDataCall(script) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                walk.simple(acorn.parse(script, {
                    ecmaVersion: 2017,
                }), {
                    CallExpression(x, state) {
                        const node = x;
                        const callee = node === null || node === void 0 ? void 0 : node.callee;
                        if ((callee === null || callee === void 0 ? void 0 : callee.name) === 'sc_data') {
                            resolve(node);
                        }
                    },
                });
            });
        });
    }
    findScDataDeclaration(script) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                walk.simple(acorn.parse(script, {
                    ecmaVersion: 2017,
                }), {
                    FunctionDeclaration(x, state) {
                        var _a;
                        const node = x;
                        if (((_a = node.id) === null || _a === void 0 ? void 0 : _a.name) === 'sc_data') {
                            resolve(node);
                        }
                    },
                });
            });
        });
    }
    getScDataBaseConst(scDataDeclaration) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                walk.simple(scDataDeclaration, {
                    VariableDeclarator(_node) {
                        var _a;
                        const node = _node;
                        const id = node.id;
                        if (id.name === 'sc3') {
                            const init = node.init;
                            const left = init.left;
                            if (left.value)
                                resolve((_a = left.value) === null || _a === void 0 ? void 0 : _a.toString().slice(2, -1));
                        }
                    },
                });
            });
        });
    }
    getFirstScDataArguments(scDataCall) {
        var _a;
        return ((_a = scDataCall.arguments[0].value) === null || _a === void 0 ? void 0 : _a.toString()) || '';
    }
    requestScData(host, base, call_const, school_code, week) {
        return __awaiter(this, void 0, void 0, function* () {
            const base64 = Buffer.from(`${call_const}${school_code}_0_${week}`, 'utf-8').toString('base64');
            const res = yield (0, axios_1.default)({
                url: `http://${host}/${base}?${base64}`,
                method: 'GET',
            });
            return res.data;
        });
    }
    getTimetable(school_code, week) {
        return __awaiter(this, void 0, void 0, function* () {
            const host = yield this.getHost();
            if (!host)
                return { error: 'host not found' };
            const script = yield this.getScript(`${host.host}:${host.port}`);
            const callConst = this.getFirstScDataArguments(yield this.findScDataCall(script));
            const baseConst = yield this.getScDataBaseConst(yield this.findScDataDeclaration(script));
            return yield this.requestScData(`${host.host}:${host.port}`, baseConst, callConst, school_code, week);
        });
    }
};
TimetableService = __decorate([
    (0, common_1.Injectable)()
], TimetableService);
exports.TimetableService = TimetableService;
