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
const express_1 = __importDefault(require("express"));
const json_1 = require("../utils/json");
const http_errors_1 = __importDefault(require("http-errors"));
class ProjectsRoutes {
    constructor(dbService) {
        this.colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning'];
        this.dbService = dbService;
        this.router = express_1.default.Router();
        this.router.get('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query.page || req.query.page === '')
                req.query.page = '0';
            res.render('projects', yield this.projectsView(req.query.page));
        }));
        this.router.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.query.page || req.query.page === '')
                req.query.page = '0';
            try {
                yield this.dbService.insertProjects(req.body.owner, req.body.name, req.body.description);
                res.status(201).render('projects', yield this.projectsView(req.query.page));
            }
            catch (error) {
                console.error(error);
                next(http_errors_1.default(500));
            }
        }));
        this.router.get('/json', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.send((yield this.dbService.getProjects(req.query.id)).rows);
        }));
    }
    projectsView(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = json_1.groupBy((yield this.dbService.getProjectsDetail()).rows, 'id');
            const grouped = Object.keys(projects).map(a => {
                const g = {
                    id: parseInt(a),
                    times: projects[a],
                    name: projects[a][0].name,
                    description: projects[a][0].description,
                    hours: projects[a][0].project_hours
                };
                g.times = g.times.map((b) => {
                    b.color = this.colors[b.time_id % this.colors.length];
                    return b;
                });
                return g;
            });
            return {
                title: 'Timetracker - Projects',
                owners: (yield this.dbService.getOwners()).rows,
                projects: grouped,
                page: page
            };
        });
    }
}
exports.default = ProjectsRoutes;
//# sourceMappingURL=projects.js.map