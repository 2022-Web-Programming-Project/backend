import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { OpenAPIInterface } from 'neis';
import OpenAPI, { APIWrapper } from './api';
import DateWrapper from './date';

export interface Lunch {
  /**
   * 1	    ATPT_OFCDC_SC_CODE	    시도교육청코드
   * 2	    ATPT_OFCDC_SC_NM	    시도교육청명
   * 3	    SD_SCHUL_CODE	    표준학교코드
   * 4	    SCHUL_NM	    학교명
   * 5	    MMEAL_SC_CODE	    식사코드
   * 6	    MMEAL_SC_NM	    식사명
   * 7	    MLSV_YMD	    급식일자
   * 8	    MLSV_FGR	    급식인원수
   * 9	    DDISH_NM	    요리명
   * 10	    ORPLC_INFO	    원산지정보
   * 11	    CAL_INFO	    칼로리정보
   * 12	    NTR_INFO	    영양정보
   * 13	    MLSV_FROM_YMD	    급식시작일자
   * 14	    MLSV_TO_YMD	    급식종료일자
   */
  schoolDistrictCode: string;
  /** ATPT_OFCDC_SC_NM 시도교육청명 */
  schoolDistrictName: string;
  /** SD_SCHUL_CODE 표준학교코드 */
  schoolCode: string;
  /** SCHUL_NM 학교명 */
  schoolName: string;
  /** MMEAL_SC_CODE 식사코드 */
  mealCode: string;
  /** MMEAL_SC_NM 식사명 */
  mealName: string;
  /** MLSV_YMD 급식일자 */
  date: string;
  /** MLSV_FGR 급식인원수 */
  mealCount: number;
  /** DDISH_NM 요리명 */
  dishName: string;
  /** ORPLC_INFO 원산지정보 */
  originInfo: string;
  /** CAL_INFO 칼로리정보 */
  calorieInfo: string;
  /** NTR_INFO 영양정보 */
  nutritionInfo: string;
  /** MLSV_FROM_YMD 급식시작일자 */
  mealFromDate: string;
  /** MLSV_TO_YMD 급식종료일자 */
  mealToDate: string;
}

@Injectable()
export class LunchService {
  private readonly $api: OpenAPI;

  constructor(private config: ConfigService) {
    this.$api = new OpenAPI(config.get<string>('NEIS_API_KEY') || '');
  }

  async request({
    schoolDistrictCode,
    schoolCode,
    mealCode,
    date,
  }: {
    schoolDistrictCode: string;
    schoolCode: string;
    mealCode?: string;
    date?: DateWrapper;
  }): Promise<Lunch[]> {
    const res: APIWrapper<OpenAPIInterface.LunchResponse> | null =
      await this.$api
        .get('/mealServiceDietInfo', {
          ATPT_OFCDC_SC_CODE: schoolDistrictCode,
          SD_SCHUL_CODE: schoolCode,
          MMEAL_SC_CODE: mealCode,
          ...date?.toObject('MLSV_YMD', 'MLSV_FROM_YMD', 'MLSV_TO_YMD'),
        })
        .then((x) => x.data)
        .then((x) => ({
          totalCount: x.mealServiceDietInfo[0].head[0].list_total_count,
          row: x.mealServiceDietInfo[1].row,
        }))
        .catch(() => null);
    if (!res) return [];
    return res.row.map((x) => ({
      schoolDistrictCode: x.ATPT_OFCDC_SC_CODE,
      schoolDistrictName: x.ATPT_OFCDC_SC_NM,
      schoolCode: x.SD_SCHUL_CODE,
      schoolName: x.SCHUL_NM,
      mealCode: x.MMEAL_SC_CODE,
      mealName: x.MMEAL_SC_NM,
      date: DateTime.fromFormat(x.MLSV_YMD, 'yyyyMMdd').toFormat('yyyy-MM-dd'),
      mealCount: Number.parseInt(x.MLSV_FGR),
      dishName: x.DDISH_NM,
      originInfo: x.ORPLC_INFO,
      calorieInfo: x.CAL_INFO,
      nutritionInfo: x.NTR_INFO,
      mealFromDate: DateTime.fromFormat(x.MLSV_FROM_YMD, 'yyyyMMdd').toFormat(
        'yyyy-MM-dd',
      ),
      mealToDate: DateTime.fromFormat(x.MLSV_TO_YMD, 'yyyyMMdd').toFormat(
        'yyyy-MM-dd',
      ),
    }));
  }

  async getDay(schoolDistrictCode: string, schoolCode: string, date: string) {
    return (
      await this.request({
        schoolDistrictCode,
        schoolCode,
        date: new DateWrapper(DateTime.fromFormat(date, 'yyyy-MM-dd')),
      })
    )[0];
  }
}
