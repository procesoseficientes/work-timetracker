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
exports.ProjectsRoutes = void 0;
const express_1 = require("express");
const ProjectService_1 = __importDefault(require("../services/ProjectService"));
const OwnerService_1 = __importDefault(require("../services/OwnerService"));
const sidebar_1 = require("../components/sidebar/sidebar");
const table_1 = require("../components/table/table");
const json2csv_1 = require("json2csv");
const tableArray_1 = __importDefault(require("../utils/tableArray"));
const auth_1 = require("../utils/auth");
const validateQuery_1 = require("../utils/validateQuery");
const RoleService_1 = require("../services/RoleService");
const http_errors_1 = __importDefault(require("http-errors"));
function ProjectsRoutes(pgClient) {
    const router = express_1.Router();
    const projectService = new ProjectService_1.default(pgClient);
    const roleService = new RoleService_1.RoleService(pgClient);
    const ownerService = new OwnerService_1.default(pgClient);
    router.get('/', auth_1.hasAccess('read', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        roleService.getAccessByRouteAndRole('/projects', (_a = req.session) === null || _a === void 0 ? void 0 : _a.roleId)
            .then((access) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            res.render('projects', {
                title: 'Timetracker - Projects',
                sidebar: new sidebar_1.sidebarComponent('/projects', yield roleService.getAccessByRole((_b = req.session) === null || _b === void 0 ? void 0 : _b.roleId)).render(),
                table: new table_1.tableComponent(tableArray_1.default(yield projectService.getProjects()), access.update, access.delete, './projects').render(),
                owners: yield ownerService.getOwners()
            });
        }))
            .catch(err => next(http_errors_1.default(err.message)));
    }));
    router.post('/', auth_1.hasAccess('create', roleService), validateQuery_1.validateBody(body => (body.owner != null &&
        body.name != null &&
        body.description != null &&
        body.budget != null)), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            projectService.createProject(req.body.owner, req.body.name, req.body.description, req.body.budget);
            res.status(201).redirect('/projects');
        }
        catch (error) {
            console.error(error);
            res.status(500).redirect('/projects');
        }
    }));
    router.get('/api', auth_1.hasAccess('read', roleService), (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (req.query.ownerId != null) {
            const id = isNaN(parseInt(req.query.ownerId)) ? 1 : parseInt(req.query.ownerId);
            res.send(yield projectService.getProjectsByOwner(id));
        }
        else {
            res.send(yield projectService.getProjects());
        }
    }));
    router.get('/excel', auth_1.hasAccess('read', roleService), (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
        projectService.getProjects().then(data => {
            const parser = new json2csv_1.Parser();
            const csv = parser.parse(data);
            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="projects.csv"`,
                'Content-Type': 'text/csv',
            });
            res.end(csv);
        }).catch(err => next(http_errors_1.default(500, err.message)));
    }));
    return router;
}
exports.ProjectsRoutes = ProjectsRoutes;
