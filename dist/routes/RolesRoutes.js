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
exports.RolesRoutes = void 0;
const express_1 = require("express");
const table_1 = require("../components/table/table");
const tableArray_1 = __importDefault(require("../utils/tableArray"));
const sidebar_1 = require("../components/sidebar/sidebar");
const RoleService_1 = require("../services/RoleService");
const auth_1 = require("../utils/auth");
const validateQuery_1 = require("../utils/validateQuery");
const http_errors_1 = __importDefault(require("http-errors"));
function RolesRoutes(pgClient) {
    const router = express_1.Router();
    const roleService = new RoleService_1.RoleService(pgClient);
    router.get('/', auth_1.hasAccess('read', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        roleService.getAccessByRouteAndRole('/roles', (_a = req.session) === null || _a === void 0 ? void 0 : _a.roleId)
            .then((access) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            res.render('roles/roles', {
                title: 'Timetracker - Roles',
                sidebar: new sidebar_1.sidebarComponent('/roles', yield roleService.getAccessByRole((_b = req.session) === null || _b === void 0 ? void 0 : _b.roleId)).render(),
                table: new table_1.tableComponent(tableArray_1.default(yield roleService.getRoles()), access.update, access.delete, './roles').render()
            });
        }))
            .catch(err => next(http_errors_1.default(err.message)));
    }));
    router.post('/', auth_1.hasAccess('create', roleService), validateQuery_1.validateBody(body => (body.role != null &&
        body.color != null)), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        roleService.createRole(req.body.role, req.body.color)
            .then(data => {
            console.log(data);
            res.status(201).redirect('/roles');
        })
            .catch(err => next(http_errors_1.default(500, err.message)));
    }));
    router.get('/api', auth_1.hasAccess('read', roleService), (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
        roleService.getRoles()
            .then(data => {
            res.status(200).send(data);
        })
            .catch(err => next(http_errors_1.default(500, err.message)));
    }));
    router.get('/:id', auth_1.hasAccess('read', roleService), (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _c;
        res.render('roles/role', {
            title: `Timetracker - Roles`,
            sidebar: new sidebar_1.sidebarComponent('/roles', yield roleService.getAccessByRole((_c = req.session) === null || _c === void 0 ? void 0 : _c.roleId)).render(),
            role: yield roleService.getRole(parseInt(req.params.id)),
            table: new table_1.tableComponent(tableArray_1.default(yield roleService.getAccessByRole(parseInt(req.params.id))), true, true, `/roles/${req.params.id}`).render()
        });
    }));
    router.post('/:id', auth_1.hasAccess('create', roleService), validateQuery_1.validateBody(body => (body.route != null)), (req, res, next) => {
        roleService.createAccess(parseInt(req.params.id), req.body.route, req.body.create === 'on', req.body.read === 'on', req.body.update === 'on', req.body.delete === 'on')
            .then(data => {
            console.log(data);
            res.redirect(`/roles/${req.params.id}`);
        })
            .catch(err => next(http_errors_1.default(500, err.message)));
    });
    router.patch('/:id', auth_1.hasAccess('update', roleService), validateQuery_1.validateQuery(['role', 'color']), (req, res) => __awaiter(this, void 0, void 0, function* () {
        roleService.updateRole(parseInt(req.params.id), req.body.role, req.body.color);
        res.status(201).redirect(`/roles/${req.params.id}`);
    }));
    router.get('/:id/:accessId', auth_1.hasAccess('read', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        roleService.getAccess(parseInt(req.params.accessId))
            .then((access) => __awaiter(this, void 0, void 0, function* () {
            var _d;
            res.render('roles/access', {
                title: 'Timetracker - Access',
                access: access,
                sidebar: new sidebar_1.sidebarComponent('/roles', yield roleService.getAccessByRole((_d = req.session) === null || _d === void 0 ? void 0 : _d.roleId)).render(),
            });
        }))
            .catch(err => next(http_errors_1.default(500, err.message)));
    }));
    router.post('/:id/:accessId', auth_1.hasAccess('update', roleService), validateQuery_1.validateBody(body => body.role != null), (req, res, next) => {
        roleService.updateAccess(parseInt(req.params.accessId), req.body.role, req.body.create === 'on', req.body.read === 'on', req.body.update === 'on', req.body.delete === 'on')
            .then(data => {
            console.log(data);
            res.status(201).redirect(`/roles/${req.params.id}`);
        })
            .catch(err => next(http_errors_1.default(500, err.message)));
    });
    return router;
}
exports.RolesRoutes = RolesRoutes;
