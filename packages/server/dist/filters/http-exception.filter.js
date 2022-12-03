"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionRedirectFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionRedirectFilter = class HttpExceptionRedirectFilter {
    constructor(redirectMap) {
        this.redirectMap = redirectMap;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        if (!this.redirectMap[status]) {
            return;
        }
        response.redirect(this.redirectMap[status]);
    }
};
HttpExceptionRedirectFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [Object])
], HttpExceptionRedirectFilter);
exports.HttpExceptionRedirectFilter = HttpExceptionRedirectFilter;
