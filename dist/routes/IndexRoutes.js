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
exports.IndexRoutes = void 0;
const express_1 = require("express");
const http_errors_1 = __importDefault(require("http-errors"));
const TypeService_1 = __importDefault(require("../services/TypeService"));
const OwnerService_1 = __importDefault(require("../services/OwnerService"));
const TimeService_1 = __importDefault(require("../services/TimeService"));
const mapTime_1 = __importDefault(require("../utils/mapTime"));
const sidebar_1 = require("../components/sidebar/sidebar");
const auth_1 = require("../utils/auth");
const RoleService_1 = require("../services/RoleService");
function IndexRoutes(pgClient) {
    const timeService = new TimeService_1.default(pgClient);
    const ownerService = new OwnerService_1.default(pgClient);
    const typeService = new TypeService_1.default(pgClient);
    const roleService = new RoleService_1.RoleService(pgClient);
    const router = express_1.Router();
    router.get('/', auth_1.authenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const times = yield timeService.getTodayUser((_a = req.session) === null || _a === void 0 ? void 0 : _a.user);
            res.render('track', {
                title: 'Timetracker',
                sidebar: new sidebar_1.sidebarComponent('/', yield roleService.getAccessByRole((_b = req.session) === null || _b === void 0 ? void 0 : _b.roleId)).render(),
                owners: yield ownerService.getOwners(),
                types: yield typeService.getTypes(),
                isWorking: times[0] ? times[0].current : false,
                lastTask: times[0] ? times[0].task : '',
                times: times.filter(a => a.percent > 0.5 || a.current)
                    .map(mapTime_1.default)
                    .reverse(),
                userId: (_c = req.session) === null || _c === void 0 ? void 0 : _c.user
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }));
    router.post('/', auth_1.hasAccess('create', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _d;
        try {
            yield timeService.startTracking((_d = req.session) === null || _d === void 0 ? void 0 : _d.user, req.body.owner, req.body.project, req.body.task, req.body.type);
            res.status(201).redirect('/');
        }
        catch (error) {
            console.error(error);
            next(http_errors_1.default(500));
        }
    }));
    router.delete('/', auth_1.hasAccess('delete', roleService), (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send(yield timeService.stopTracking(req.body.id));
    }));
    router.delete('/api', auth_1.hasAccess('delete', roleService), (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send(yield timeService.stopTracking(req.body.id));
    }));
    router.get('/api', auth_1.authenticated, (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _e;
        try {
            res.send(yield timeService.getTodayUser((_e = req.session) === null || _e === void 0 ? void 0 : _e.user));
        }
        catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }));
    router.post('/api', auth_1.hasAccess('create', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _f;
        try {
            res.status(201).send(yield timeService.startTracking((_f = req.session) === null || _f === void 0 ? void 0 : _f.user, req.body.owner, req.body.project, req.body.task, req.body.type));
        }
        catch (error) {
            console.error(error);
            next(http_errors_1.default(500));
        }
    }));
    return router;
}
exports.IndexRoutes = IndexRoutes;
