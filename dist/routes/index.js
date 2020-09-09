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
const http_errors_1 = __importDefault(require("http-errors"));
const json_1 = require("../utils/json");
class IndexRoutes {
    constructor(dbService) {
        this.colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning'];
        this.dbService = dbService;
        this.router = express_1.default.Router();
        this.router.get('/', (_req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.render('track', yield this.trackView());
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        }));
        this.router.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbService.startTracking(1, req.body.owner, req.body.project, req.body.task);
                res.status(201).render('track', yield this.trackView());
            }
            catch (error) {
                console.error(error);
                next(http_errors_1.default(500));
            }
        }));
        this.router.delete('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send((yield this.dbService.stopTracking(req.body.id)).rows);
        }));
        this.router.get('/detail', (req, res, _next) => {
            if (!req.query.page || req.query.page === '')
                req.query.page = '0';
            this.dbService.getTimes(req.query.name, req.query.owner, req.query.project, req.query.from === '' ? undefined : req.query.from, req.query.to === '' ? undefined : req.query.to, parseInt(req.query.page)).then(data => {
                res.render('detail', {
                    title: 'Timetracker - Detail',
                    times: data.rows
                        .slice(0, 26)
                        .map(a => {
                        a.start = a.start.toString().substring(0, 21);
                        a.end = a.end ? a.end.toString().substring(0, 21) : '';
                        return a;
                    }),
                    count: data.rows.length,
                    total: data.rows
                        .slice(0, 26)
                        .map(a => a.hours)
                        .reduce((a, b) => {
                        return a + b;
                    }, 0),
                    page: req.query.page,
                    showPrevious: parseInt(req.query.page) > 0,
                    showNext: data.rows.length === 26
                });
            }).catch(err => {
                console.error(err);
                res.status(500).render('detail', {
                    title: 'Timetracker - Detail',
                    page: req.query.page,
                    times: []
                });
            });
        });
        this.router.get('/team', (_req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const view = yield this.teamView();
            res.render('team', view);
        }));
    }
    trackView() {
        return __awaiter(this, void 0, void 0, function* () {
            const owners = (yield this.dbService.getOwners()).rows;
            const times = (yield this.dbService.getTodayUser('1')).rows;
            return {
                title: 'Timetracker',
                owners: owners,
                isWorking: times[0] ? times[0].current : false,
                lastTask: times[0] ? times[0].task : '',
                times: times.filter(a => a.percent > 0.5 || a.current)
                    .map(this.mapTime)
                    .reverse()
            };
        });
    }
    teamView() {
        return __awaiter(this, void 0, void 0, function* () {
            const teamTimes = json_1.groupBy((yield this.dbService.getTodayTeam()).rows, 'user_id');
            const grouped = Object.keys(teamTimes).map(a => {
                const g = {
                    id: parseInt(a),
                    times: teamTimes[a].filter((a) => a.percent > 0.5 || a.current)
                        .map(this.mapTime)
                        .reverse(),
                    task: teamTimes[a][0].task,
                    name: teamTimes[a][0].name,
                    project: teamTimes[a][0].project
                };
                return g;
            });
            return {
                title: 'Timetracker - Team',
                team: grouped
            };
        });
    }
    mapTime(element, index) {
        const colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning'];
        const start = new Date(element.start).getTime();
        if (element.current) {
            element.hours = (new Date().getTime() - start) / 3600000;
            element.percent = ((element.hours / 8) * 100) + 3;
        }
        const hoursSplit = element.hours.toString().split('.');
        element.color = colors[index];
        element.hours = hoursSplit[0] + '.' + hoursSplit[1][0];
        return element;
    }
}
exports.default = IndexRoutes;
//# sourceMappingURL=index.js.map