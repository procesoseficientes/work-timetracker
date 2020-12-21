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
exports.DetailRoutes = void 0;
const express_1 = require("express");
const sidebar_1 = require("../components/sidebar/sidebar");
const TimeService_1 = __importDefault(require("../services/TimeService"));
const json2csv_1 = require("json2csv");
const auth_1 = require("../utils/auth");
const RoleService_1 = require("../services/RoleService");
const http_errors_1 = __importDefault(require("http-errors"));
function DetailRoutes(pgClient) {
    const router = express_1.Router();
    const timeService = new TimeService_1.default(pgClient);
    const roleService = new RoleService_1.RoleService(pgClient);
    router.get('/', auth_1.hasAccess('read', roleService), (req, res) => {
        if (!req.query.page || req.query.page === '')
            req.query.page = '0';
        timeService.getTimes(req.query.name, req.query.owner, req.query.project, req.query.from === '' ? undefined : req.query.from, req.query.to === '' ? undefined : req.query.to, parseInt(req.query.page)).then((data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            res.render('detail', {
                title: 'Timetracker - Times',
                sidebar: new sidebar_1.sidebarComponent('/detail', yield roleService.getAccessByRole((_a = req.session) === null || _a === void 0 ? void 0 : _a.roleId)).render(),
                times: data
                    .slice(0, 26)
                    .map(a => {
                    a.start = a.start.toString().substring(0, 21);
                    a.end = a.end ? a.end.toString().substring(0, 21) : '';
                    return a;
                }),
                count: data.length,
                total: data
                    .slice(0, 26)
                    .map(a => a.hours)
                    .reduce((a, b) => {
                    return a + (isNaN(parseFloat(b)) ? 0 : parseFloat(b));
                }, 0).toFixed(2),
                page: req.query.page,
                showPrevious: parseInt(req.query.page) > 0,
                showNext: data.length === 26,
                query: req.query
            });
        })).catch(err => {
            console.error(err);
            res.status(500).render('detail', {
                title: 'Timetracker - Times',
                page: req.query.page,
                times: []
            });
        });
    });
    router.get('/api', auth_1.hasAccess('read', roleService), (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!req.query.page || req.query.page === '')
            req.query.page = '0';
        res.status(200).send(yield timeService.getTimes(req.query.name, req.query.owner, req.query.project, req.query.from === '' ? undefined : req.query.from, req.query.to === '' ? undefined : req.query.to, parseInt(req.query.page)));
    }));
    router.get('/excel', auth_1.hasAccess('read', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (!req.query.page || req.query.page === '')
            req.query.page = '0';
        timeService.getTimes(req.query.name, req.query.owner, req.query.project, req.query.from === '' ? undefined : req.query.from, req.query.to === '' ? undefined : req.query.to, 0, 10000).then(data => {
            const parser = new json2csv_1.Parser();
            const csv = parser.parse(data);
            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="Times.csv"`,
                'Content-Type': 'text/csv',
            });
            res.end(csv);
        }).catch(err => next(http_errors_1.default(500, err.message)));
    }));
    return router;
}
exports.DetailRoutes = DetailRoutes;
