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
exports.TeamRoutes = void 0;
const express_1 = require("express");
const mapTime_1 = __importDefault(require("../utils/mapTime"));
const json_1 = require("../utils/json");
const TimeService_1 = __importDefault(require("../services/TimeService"));
const sidebar_1 = require("../components/sidebar/sidebar");
const auth_1 = require("../utils/auth");
const RoleService_1 = require("../services/RoleService");
const http_errors_1 = __importDefault(require("http-errors"));
function TeamRoutes(pgClient) {
    const timeService = new TimeService_1.default(pgClient);
    const router = express_1.Router();
    const roleService = new RoleService_1.RoleService(pgClient);
    router.get('/', auth_1.hasAccess('read', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        teamView((_a = req.session) === null || _a === void 0 ? void 0 : _a.roleId)
            .then(data => {
            res.render('team', data);
        })
            .catch(err => next(http_errors_1.default(500, err.message)));
    }));
    function teamView(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamTimes = json_1.groupBy((yield timeService.getTodayTeam()), 'user_id');
            const grouped = Object.keys(teamTimes).map(a => {
                const g = {
                    id: parseInt(a),
                    times: teamTimes[a].filter((a) => a.percent > 0.5 || a.current)
                        .map(mapTime_1.default)
                        .reverse(),
                    task: teamTimes[a][0].task,
                    name: teamTimes[a][0].name,
                    project: teamTimes[a][0].project,
                    owner: teamTimes[a][0].owner
                };
                return g;
            });
            return {
                title: 'Timetracker - Team',
                sidebar: new sidebar_1.sidebarComponent('/team', yield roleService.getAccessByRole(parseInt(roleId))).render(),
                team: grouped
            };
        });
    }
    return router;
}
exports.TeamRoutes = TeamRoutes;
