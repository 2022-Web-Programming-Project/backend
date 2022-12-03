import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load, root } from 'cheerio';
import * as iconv from 'iconv-lite';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import {
  BinaryExpression,
  CallExpression,
  FunctionDeclaration,
  Identifier,
  Literal,
  VariableDeclarator,
} from 'estree';

@Injectable()
export class TimetableService {
  async getHost() {
    const res = await axios({
      url: 'http://xn--s39aj90b0nb2xw6xh.kr/',
    });
    const $ = load(res.data);
    const url = $('frame').attr('src');
    if (!url) return;
    return {
      original: url,
      host: new URL(url).hostname,
      port: new URL(url).port,
    };
  }

  async getScript(host: string): Promise<string> {
    const res = await axios({
      url: `http://${host}/st`,
      responseType: 'arraybuffer',
    });
    const $ = load(iconv.decode(res.data, 'euc-kr').toString());
    return $('head script').text();
  }

  async findScDataCall(script: string) {
    return new Promise<CallExpression>((resolve, reject) => {
      walk.simple(
        acorn.parse(script, {
          ecmaVersion: 2017,
        }),
        {
          CallExpression(x, state) {
            const node = x as unknown as CallExpression;
            const callee = node?.callee as Identifier;
            if (callee?.name === 'sc_data') {
              resolve(node);
            }
          },
        },
      );
    });
  }

  async findScDataDeclaration(script: string) {
    return new Promise<FunctionDeclaration>((resolve, reject) => {
      walk.simple(
        acorn.parse(script, {
          ecmaVersion: 2017,
        }),
        {
          FunctionDeclaration(x, state) {
            const node = x as unknown as FunctionDeclaration;
            if (node.id?.name === 'sc_data') {
              resolve(node);
            }
          },
        },
      );
    });
  }

  async getScDataBaseConst(scDataDeclaration: FunctionDeclaration) {
    return new Promise<string>((resolve, reject) => {
      walk.simple(scDataDeclaration as unknown as acorn.Node, {
        VariableDeclarator(_node: any) {
          const node = _node as VariableDeclarator;
          const id = node.id as Identifier;
          if (id.name === 'sc3') {
            const init = node.init as BinaryExpression;
            const left = init.left as Literal;
            if (left.value) resolve(left.value?.toString().slice(2, -1));
          }
        },
      });
    });
  }

  getFirstScDataArguments(scDataCall: CallExpression) {
    return (scDataCall.arguments[0] as Literal).value?.toString() || '';
  }

  async requestScData(
    host: string,
    base: string,
    call_const: string,
    school_code: string,
    week: number,
  ) {
    const base64 = Buffer.from(
      `${call_const}${school_code}_0_${week}`,
      'utf-8',
    ).toString('base64');
    const res = await axios({
      url: `http://${host}/${base}?${base64}`,
      method: 'GET',
    });
    return res.data;
  }

  async getTimetable(school_code: string, week: number) {
    const host = await this.getHost();
    if (!host) return { error: 'host not found' };
    const script = await this.getScript(`${host.host}:${host.port}`);
    const callConst = this.getFirstScDataArguments(
      await this.findScDataCall(script),
    );
    const baseConst = await this.getScDataBaseConst(
      await this.findScDataDeclaration(script),
    );
    return await this.requestScData(
      `${host.host}:${host.port}`,
      baseConst,
      callConst,
      school_code,
      week,
    );
  }
}
