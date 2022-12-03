"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class OpenAPI {
    constructor(apiKey) {
        this._apiKey = apiKey;
        this._client = axios_1.default.create({
            baseURL: 'https://open.neis.go.kr/hub/',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    get(path, params = {}, options) {
        params.KEY = this._apiKey;
        params.Type = params.Type || 'json';
        return this._client.get(path, Object.assign({ params }, options));
    }
}
exports.default = OpenAPI;
