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
exports.RoleService = void 0;
const sqlStrings_1 = require("../utils/sqlStrings");
const DbService_1 = __importDefault(require("./DbService"));
class RoleService extends DbService_1.default {
    updateRole(arg0, role, color) {
        console.log(arg0, role, color);
        throw new Error('Method not implemented.');
    }
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query('select * from role order by id desc')).rows;
        });
    }
    createRole(name, color) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`insert into role(name, active, color) values ('${sqlStrings_1.sqlString(name)}', true, '${sqlStrings_1.sqlString(color)}') returning id`)).rows[0].id;
        });
    }
    getRole(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    select * from role
    where id = ${roleId};`;
            return (yield this.client.query(query)).rows[0];
        });
    }
    getAccessByRouteAndRole(route, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    select a.id, a.route, a."create", a.read, a.update, a.delete 
    from access a
    where role_id = ${roleId}
    and route = '${sqlStrings_1.sqlString(route)}';`;
            return (yield this.client.query(query)).rows[0];
        });
    }
    getAccessByRole(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    select a.id, a.route, a."create", a.read, a.update, a.delete 
    from role
    inner join access a on role.id = a.role_id
    where role.id = ${roleId};`;
            return (yield this.client.query(query)).rows;
        });
    }
    createAccess(roleId, route, create, read, update, _delete) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
      insert into access(role_id, route, "create", read, update, delete)
      values (${roleId}, '${sqlStrings_1.sqlString(route)}', ${create}, ${read}, ${update}, ${_delete})
      returning id
    `)).rows[0].id;
        });
    }
    updateAccess(accessId, route, create, read, update, _delete) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
      update access 
      set route = '${sqlStrings_1.sqlString(route)}',
      "create" = ${create},
      read = ${read},
      update = ${update},
      delete = ${_delete}
      where id = ${accessId}
      returning id;
    `)).rows[0].id;
        });
    }
    getAccess(accessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    select * from access
    where id = ${accessId};`;
            return (yield this.client.query(query)).rows[0];
        });
    }
}
exports.RoleService = RoleService;
