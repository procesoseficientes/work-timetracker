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
exports.StatsRoutes = void 0;
const express_1 = require("express");
const json_1 = require("../utils/json");
const ProjectService_1 = __importDefault(require("../services/ProjectService"));
const OwnerService_1 = __importDefault(require("../services/OwnerService"));
const sidebar_1 = require("../components/sidebar/sidebar");
const auth_1 = require("../utils/auth");
const RoleService_1 = require("../services/RoleService");
function StatsRoutes(pgClient) {
    const router = express_1.Router();
    const projectService = new ProjectService_1.default(pgClient);
    const ownerService = new OwnerService_1.default(pgClient);
    const roleService = new RoleService_1.RoleService(pgClient);
    const colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning'];
    router.get('/', auth_1.hasAccess('read', roleService), (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!req.query.page || req.query.page === '')
            req.query.page = '0';
        res.render('stats', yield statsView(req.query.page, (_a = req.session) === null || _a === void 0 ? void 0 : _a.roleId));
    }));
    function statsView(page, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = json_1.groupBy((yield projectService.getProjectsDetail()), 'id');
            const grouped = Object.keys(projects).map(a => {
                const g = {
                    id: parseInt(a),
                    times: projects[a],
                    name: projects[a][0].name,
                    description: projects[a][0].description,
                    hours: projects[a][0].project_hours
                };
                g.times = g.times.map((b) => {
                    b.color = colors[b.time_id % colors.length];
                    return b;
                });
                return g;
            });
            return {
                title: 'Timetracker - Stats',
                sidebar: new sidebar_1.sidebarComponent('/stats', yield roleService.getAccessByRole(parseInt(roleId))).render(),
                owners: yield ownerService.getOwners(),
                projects: grouped,
                page: page
            };
        });
    }
    return router;
}
exports.StatsRoutes = StatsRoutes;
