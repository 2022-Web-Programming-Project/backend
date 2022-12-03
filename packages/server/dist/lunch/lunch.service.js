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
exports.LunchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const luxon_1 = require("luxon");
const api_1 = __importDefault(require("./api"));
const date_1 = __importDefault(require("./date"));
let LunchService = class LunchService {
    constructor(config) {
        this.config = config;
        this.$api = new api_1.default(config.get('NEIS_API_KEY') || '');
    }
    request({ schoolDistrictCode, schoolCode, mealCode, date, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.$api
                .get('/mealServiceDietInfo', Object.assign({ ATPT_OFCDC_SC_CODE: schoolDistrictCode, SD_SCHUL_CODE: schoolCode, MMEAL_SC_CODE: mealCode }, date === null || date === void 0 ? void 0 : date.toObject('MLSV_YMD', 'MLSV_FROM_YMD', 'MLSV_TO_YMD')))
                .then((x) => x.data)
                .then((x) => ({
                totalCount: x.mealServiceDietInfo[0].head[0].list_total_count,
                row: x.mealServiceDietInfo[1].row,
            }))
                .catch(() => null);
            if (!res)
                return [];
            return res.row.map((x) => ({
                schoolDistrictCode: x.ATPT_OFCDC_SC_CODE,
                schoolDistrictName: x.ATPT_OFCDC_SC_NM,
                schoolCode: x.SD_SCHUL_CODE,
                schoolName: x.SCHUL_NM,
                mealCode: x.MMEAL_SC_CODE,
                mealName: x.MMEAL_SC_NM,
                date: luxon_1.DateTime.fromFormat(x.MLSV_YMD, 'yyyyMMdd').toFormat('yyyy-MM-dd'),
                mealCount: Number.parseInt(x.MLSV_FGR),
                dishName: x.DDISH_NM,
                originInfo: x.ORPLC_INFO,
                calorieInfo: x.CAL_INFO,
                nutritionInfo: x.NTR_INFO,
                mealFromDate: luxon_1.DateTime.fromFormat(x.MLSV_FROM_YMD, 'yyyyMMdd').toFormat('yyyy-MM-dd'),
                mealToDate: luxon_1.DateTime.fromFormat(x.MLSV_TO_YMD, 'yyyyMMdd').toFormat('yyyy-MM-dd'),
            }));
        });
    }
    getDay(schoolDistrictCode, schoolCode, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.request({
                schoolDistrictCode,
                schoolCode,
                date: new date_1.default(luxon_1.DateTime.fromFormat(date, 'yyyy-MM-dd')),
            }))[0];
        });
    }
};
LunchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LunchService);
exports.LunchService = LunchService;
