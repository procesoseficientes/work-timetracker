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
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
class DbService {
    constructor(url) {
        this.client = new pg_1.Client({
            connectionString: url,
            ssl: {
                rejectUnauthorized: false
            }
        });
        this.client.connect().catch((err) => {
            console.error(err);
        });
    }
    getOwners() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query('select * from owner');
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query('select * from "user"');
        });
    }
    getProjects(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`select * from project where owner_id = ${ownerId}`);
        });
    }
    getTimes(name = '', owner = '', project = '', from = '1970-01-01T00:00:00.000', to = new Date().toISOString().replace('Z', '+00'), page = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`
      select 
        u.name as "name",  
        o.name as "owner",
        p.name as project,
        task,
        "start",
        "end",
        date_part('hour', "end" - "start") as "hours"
      from time t
      inner join owner o on o.id = owner_id
      inner join project p on p.id = project_id
      inner join "user" u on u.id = user_id 
      where lower(u.name) like '%${name.toLowerCase()}%'
        and lower(o.name) like '%${owner.toLowerCase()}%'
        and lower(p.name) like '%${project.toLowerCase()}%'
        and "start" between '${from}' and '${to}'
      order by "start" desc
      limit 26
      offset ${page * 25}
    `);
        });
    }
    startTracking(userId, ownerId, projectId, task) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`
      update "time" set "end" = CURRENT_TIMESTAMP
      where user_id = ${userId}
      and "end" is null;

      insert into "time"(
      user_id, owner_id, project_id, task, start)
      values (${userId}, ${ownerId}, ${projectId}, '${task}', CURRENT_TIMESTAMP);
    `);
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
    getProjectsDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`
    select
      p.id,
      u.id as time_id,
      p.name, 
      p.description,
      u.name as "user",
      user_hours as "hours",
      project_hours,
      (user_hours / project_hours) * 100 as "percent"
    from project p
    inner join owner o on o.id = p.owner_id
    inner join (select 
        u.id as id,
        u.name as name,
        t.project_id,
        sum(date_part('hour', "end" - "start")) as user_hours
      from time t
      inner join "user" u on u.id = user_id
      group by u.id, u.name, t.project_id) u on u.project_id = p.id
    inner join (
      select 
        p.id as project_id, 
        sum(date_part('hour', "end" - "start")) as project_hours
      from project p
      inner join time t on t.project_id = p.id
      group by p.id) as ih on ih.project_id = p.id
    `);
        });
    }
    insertProjects(ownerId, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`
      insert into public.project(
      owner_id, name, description)
      values (${ownerId}, '${name}', '${description}')
    `);
        });
    }
    createUser(name, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`insert into "user"(name, username, password, active) values ('${name}', '${username}', '${password}', true)`);
        });
    }
    getTodayUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`
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
    `);
        });
    }
    getTodayTeam() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.query(`
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
    `);
        });
    }
}
exports.default = DbService;
//# sourceMappingURL=db-service.js.map