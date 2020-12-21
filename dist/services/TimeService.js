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
class TimeService extends DbService_1.default {
    getTimes(name = '', owner = '', project = '', from = '1970-01-01T00:00:00.000', to = new Date().toISOString().replace('Z', '+00'), page = 0, limit = 26) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
      select 
        u.name as "name",  
        o.name as "owner",
        p.name as project,
        task,
        ty.type,
        "start",
        "end",
        ROUND(cast((extract(epoch from "end" - "start")) as numeric) / 3600, 2) as "hours"
      from time t
      inner join owner o on o.id = owner_id
      inner join project p on p.id = project_id
      inner join "user" u on u.id = user_id 
      left join type ty on ty.id = t.type_id
      where lower(u.name) like '%${name.toLowerCase()}%'
        and lower(o.name) like '%${owner.toLowerCase()}%'
        and lower(p.name) like '%${project.toLowerCase()}%'
        and "start" between '${from}' and '${to}'
      order by "start" desc
      limit ${limit}
      offset ${page * 25}
    `)).rows.map(a => {
                a.start = new Date(a.start);
                a.start.setHours(a.start.getHours() - 6);
                if (a.end) {
                    a.end = new Date(a.end);
                    a.end.setHours(a.end.getHours() - 6);
                }
                return a;
            });
        });
    }
    startTracking(userId, ownerId, projectId, task, typeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result = (yield this.client.query(`
    update "time" set "end" = CURRENT_TIMESTAMP
    where user_id = ${userId}
    and "end" is null;

    insert into "time"(
    user_id, owner_id, project_id, task, type_id, start)
    values (${userId}, ${ownerId}, ${projectId}, '${task}', ${typeId}, CURRENT_TIMESTAMP) returning id;
  `));
            return result[1].rows[0].id;
        });
    }
    stopTracking(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`
      update "time" set "end" = CURRENT_TIMESTAMP
      where user_id = ${userId}
      and "end" is null`);
        });
    }
    getTodayUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
      select 
        user_id,
        o.name as "owner",
        p.name as "project",
        t.task,
        t.start,
        "end" is null as "current",
        (extract(epoch from "end" - "start")) / 3600 as hours,
        (extract(epoch from "end" - "start") / 28800) * 100 as "percent"
      from "time" t
      inner join "owner" o on owner_id = o.id
      inner join project p on project_id = p.id
      where user_id = ${userId}
      and "start" > now() - interval '1 day'
      order by "start" desc
    `)).rows;
        });
    }
    getTodayTeam() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
      select 
        t.id as "time_id",
        user_id,
        u.name,
        o.name as "owner",
        p.name as "project",
        t.task,
        t.start,
        "end" is null as "is_current",
        (extract(epoch from "end" - "start")) / 3600 as hours,
        (extract(epoch from "end" - "start") / 28800) * 100 as "percent"
      from "time" t
      inner join "owner" o on owner_id = o.id
      inner join "user" u on user_id = u.id
      inner join project p on project_id = p.id
      and "start" > now() - interval '1 day'
      order by "start" desc
    `)).rows;
        });
    }
}
exports.default = TimeService;
