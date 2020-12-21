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
exports.UserService = void 0;
const sqlStrings_1 = require("../utils/sqlStrings");
const DbService_1 = __importDefault(require("./DbService"));
class UserService extends DbService_1.default {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
    select 
      u.id, 
      u.name, 
      u.username, 
      u.active, 
      r.name as "role",
      u.role_id
    from public."user" u
    inner join role r on r.id = u.role_id`)).rows;
        });
    }
    validateLogin(username, password) {
        return new Promise((resolve, reject) => {
            this.client.query(`
        select 
          u.id, 
          u.name, 
          u.username, 
          u.active, 
          r.name as "role",
          u.role_id
        from public."user" u
        inner join role r on r.id = u.role_id
        where username='${sqlStrings_1.sqlString(username)}' and password='${sqlStrings_1.sqlString(password)}'
      `)
                .then(data => data.rowCount > 0 ? resolve(data.rows[0]) : resolve(false))
                .catch(err => reject(err));
        });
    }
    createUser(name, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`insert into "user"(name, username, password, active) values ('${name}', '${username}', '${password}', true) returning id`)).rows[0].id;
        });
    }
}
exports.UserService = UserService;
