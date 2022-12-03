"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchGuard = exports.isWatchUserAgent = exports.WATCH_DEVICE_REGEX = exports.WATCH_DEVICES = void 0;
const common_1 = require("@nestjs/common");
const exceptions_1 = require("@nestjs/common/exceptions");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
exports.WATCH_DEVICES = [
    'SM-R840',
    'SM-R850',
    'SM-R860',
    'SM-R870',
    'SM-R880',
    'SM-R890',
    'SM-R900',
    'SM-R910',
    'SM-R920', // Galaxy Watch 5 Pro
];
exports.WATCH_DEVICE_REGEX = /^SM-R[0-9]{3}$/;
function isWatchUserAgent(userAgent) {
    const { device } = (0, ua_parser_js_1.default)(userAgent);
    if (device && device.model) {
        return exports.WATCH_DEVICES.includes(device.model);
    }
    return false;
}
exports.isWatchUserAgent = isWatchUserAgent;
let WatchGuard = class WatchGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ua = (0, ua_parser_js_1.default)(request.headers['user-agent']);
        const isWatchPage = request.query.watch !== undefined;
        if (ua.device &&
            ua.device.model &&
            exports.WATCH_DEVICE_REGEX.test(ua.device.model)) {
            if (isWatchPage) {
                return true;
            }
            else {
                throw new exceptions_1.HttpException('Not a watch page', 129);
            }
        }
        if (isWatchPage) {
            throw new exceptions_1.HttpException('Not a watch device', 128);
        }
        return true;
    }
};
WatchGuard = __decorate([
    (0, common_1.Injectable)()
], WatchGuard);
exports.WatchGuard = WatchGuard;
