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
class ProjectService extends DbService_1.default {
    getProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
    select p.id, o.name as "owner", p.name, p.description, p.budget, p.active from project p
    inner join owner o on o.id = p.owner_id`)).rows;
        });
    }
    getProjectsByOwner(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
    select p.id, o.name as "owner", p.name, p.description, p.budget, p.active from project p
    inner join owner o on o.id = p.owner_id where p.owner_id = ${ownerId}`)).rows;
        });
    }
    getProjectsDetail() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
    select
      p.id,
      u.id as time_id,
      p.name, 
      p.description,
      u.name as "user",
      user_hours as "hours",
      project_hours,
      ((user_hours + 1) / (p.budget + 0.1)) * 100 as "percent"
    from project p
    inner join owner o on o.id = p.owner_id
    inner join (select 
        u.id as id,
        u.name as name,
        t.project_id,
        sum(ROUND(cast((extract(epoch from "end" - "start")) as numeric) / 3600, 2)) as user_hours
      from time t
      inner join "user" u on u.id = user_id
      group by u.id, u.name, t.project_id) u on u.project_id = p.id
    inner join (
      select 
        p.id as project_id, 
        sum(ROUND(cast((extract(epoch from "end" - "start")) as numeric) / 3600, 2)) as project_hours
      from project p
      inner join time t on t.project_id = p.id
      group by p.id) as ih on ih.project_id = p.id
    `)).rows;
        });
    }
    createProject(ownerId, name, description, budget) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.client.query(`
      insert into public.project(
      owner_id, name, description, budget)
      values (${ownerId}, '${name}', '${description}', ${budget})
      returning id
    `)).rows[0].id;
        });
    }
}
exports.default = ProjectService;
