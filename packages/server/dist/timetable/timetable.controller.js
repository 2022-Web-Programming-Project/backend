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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimetableController = void 0;
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("../filters/http-exception.filter");
const watch_guard_1 = require("../guards/watch.guard");
const timetable_service_1 = require("./timetable.service");
let TimetableController = class TimetableController {
    constructor(service) {
        this.service = service;
    }
    getTimetable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getTimetable('41896', 1);
        });
    }
    root(session, watch) {
        const isWatchPage = watch !== undefined;
        return { user: session.user, isWatch: isWatchPage };
    }
};
__decorate([
    (0, common_1.Get)('/api'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimetableController.prototype, "getTimetable", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('timetable/index'),
    (0, common_1.UseGuards)(watch_guard_1.WatchGuard),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionRedirectFilter({
        128: '?',
        129: '?watch',
    })),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Query)('watch')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TimetableController.prototype, "root", null);
TimetableController = __decorate([
    (0, common_1.Controller)('timetable'),
    __metadata("design:paramtypes", [timetable_service_1.TimetableService])
], TimetableController);
exports.TimetableController = TimetableController;
