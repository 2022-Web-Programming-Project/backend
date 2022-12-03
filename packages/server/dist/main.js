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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const app_module_1 = require("./app.module");
const swagger_1 = require("./swagger");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const config = app.get(config_1.ConfigService);
        const servicePort = config.get('PORT', '3000');
        const NODE_ENV = config.get('NODE_ENV', 'development');
        app.use((0, cookie_parser_1.default)());
        app.enableCors({
            origin: config.get('CORS_ORIGIN', '*'),
            methods: config.get('CORS_METHODS', 'GET,PUT,POST,DELETE'),
            credentials: config.get('CORS_CREDENTIALS', true),
            preflightContinue: config.get('CORS_PREFLIGHT', false),
            optionsSuccessStatus: config.get('CORS_OPTIONS_STATUS', 204),
        });
        app.use((0, express_session_1.default)({
            secret: config.get('SESSION_SECRET', Math.random().toString(36).slice(2)),
            resave: false,
            saveUninitialized: false,
        }));
        app.useStaticAssets(path_1.default.join(__dirname, '..', 'public'));
        common_1.Logger.debug(`Static Path: ${path_1.default.join(__dirname, '..', 'public')}`);
        app.setBaseViewsDir(path_1.default.join(__dirname, '..', 'views'));
        common_1.Logger.debug(`Base View Path: ${path_1.default.join(__dirname, '..', 'views')}`);
        app.setViewEngine('ejs');
        if (config.get('SWAGGER_ENABLED', NODE_ENV === 'development')) {
            yield (0, swagger_1.swagger)(app);
        }
        yield app.listen(servicePort);
        common_1.Logger.log(`Server is running on http://localhost:${servicePort}/ with ${NODE_ENV} mode`, 'Bootstrap');
    });
}
bootstrap();
