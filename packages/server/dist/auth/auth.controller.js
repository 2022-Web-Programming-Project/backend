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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const reference_1 = require("reference");
const auth_service_1 = require("./auth.service");
const auth_guard_1 = require("./guards/auth.guard");
const regist_user_dtio_1 = require("./dto/regist-user.dtio");
const login_user_dto_1 = require("./dto/login-user.dto");
const http_exception_filter_1 = require("../filters/http-exception.filter");
const watch_guard_1 = require("../guards/watch.guard");
const { REFRESH_TOKEN_KEY, REFRESH_TOKEN_OPTION } = reference_1.Cookie;
let AuthController = class AuthController {
    constructor(config, authService) {
        this.config = config;
        this.authService = authService;
    }
    hello() {
        return 'Hello World!';
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    loginRender(watch) {
        const isWatchPage = watch !== undefined;
        return { isWatch: isWatchPage };
    }
    login(loginDto, session, watch, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginDto;
            const user = yield this.authService.loginUser(loginDto);
            if (!user) {
                throw new common_1.HttpException('로그인에 실패했습니다.', common_1.HttpStatus.BAD_REQUEST);
            }
            session.user = user;
            res.redirect('/');
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    registRender(watch) {
        const isWatchPage = watch !== undefined;
        return { isWatch: isWatchPage };
    }
    regist(registDto, session, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, username, password } = registDto;
            if (yield this.authService.isUserExistByEmail(email)) {
                throw new common_1.HttpException('이미 존재하는 이메일입니다.', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = yield this.authService.registUser(registDto);
            session.userId = user.id;
            res.redirect('/');
        });
    }
};
__decorate([
    (0, common_1.Get)('/'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.SessionAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "hello", null);
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Render)('auth/login'),
    (0, common_1.UseGuards)(watch_guard_1.WatchGuard),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionRedirectFilter({
        128: '?',
        129: '?watch',
    }))
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ,
    __param(0, (0, common_1.Query)('watch')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginRender", null);
__decorate([
    (0, common_1.Post)('/login')
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ,
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.Query)('watch')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('regist'),
    (0, common_1.Render)('auth/regist'),
    (0, common_1.UseGuards)(watch_guard_1.WatchGuard),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionRedirectFilter({
        128: '?',
        129: '?watch',
    }))
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ,
    __param(0, (0, common_1.Query)('watch')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registRender", null);
__decorate([
    (0, common_1.Post)('regist'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Session)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [regist_user_dtio_1.RegistUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "regist", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
