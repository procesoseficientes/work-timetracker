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
const DbService_1 = __importDefault(require("./DbService"));
class TypeService extends DbService_1.default {
    getTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query('select * from type order by id desc')).rows;
        });
    }
    createType(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`insert into "type"(type, active) values ('${name}', true) returning id`)).rows[0].id;
        });
    }
}
exports.default = TypeService;
