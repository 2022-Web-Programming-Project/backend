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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAjaxUrl = exports.findAjax = exports.find_school_ra_function = exports.findPropertyByName = exports.findByType = void 0;
const walk = __importStar(require("acorn-walk"));
function findByType(node, type) {
    return new Promise((resolve, reject) => {
        walk.simple(node, {
            [type]: (node) => {
                resolve(node);
            },
        });
    });
}
exports.findByType = findByType;
function findPropertyByName(node, name) {
    return node.properties.find((x) => x.type === 'Property' &&
        x.key.type === 'Identifier' &&
        x.key.name === name);
}
exports.findPropertyByName = findPropertyByName;
function find_school_ra_function(node) {
    return new Promise((resolve, reject) => {
        walk.simple(node, {
            FunctionDeclaration(x, state) {
                var _a;
                const node = x;
                if (((_a = node.id) === null || _a === void 0 ? void 0 : _a.name) === 'school_ra') {
                    resolve(node);
                }
            },
        });
    });
}
exports.find_school_ra_function = find_school_ra_function;
function findAjax(node) {
    return new Promise((resolve, reject) => {
        walk.simple(node, {
            CallExpression(x, state) {
                const node = x;
                const callee = node === null || node === void 0 ? void 0 : node.callee;
                const property = callee === null || callee === void 0 ? void 0 : callee.property;
                if ((property === null || property === void 0 ? void 0 : property.name) === 'ajax') {
                    resolve(node);
                }
            },
        });
    });
}
exports.findAjax = findAjax;
function getAjaxUrl(node) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = (yield findByType(node, 'ObjectExpression'));
        const value = findPropertyByName(options, 'url')
            .value;
        const left = value.left;
        return left.value;
    });
}
exports.getAjaxUrl = getAjaxUrl;
