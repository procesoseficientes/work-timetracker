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
exports.OwnersRoutes = void 0;
const express_1 = require("express");
const table_1 = require("../components/table/table");
const tableArray_1 = __importDefault(require("../utils/tableArray"));
const sidebar_1 = require("../components/sidebar/sidebar");
const OwnerService_1 = __importDefault(require("../services/OwnerService"));
const json2csv_1 = require("json2csv");
const auth_1 = require("../utils/auth");
const validateQuery_1 = require("../utils/validateQuery");
const RoleService_1 = require("../services/RoleService");
const http_errors_1 = __importDefault(require("http-errors"));
function OwnersRoutes(pgClient) {
    const router = express_1.Router();
    const ownerService = new OwnerService_1.default(pgClient);
    const roleService = new RoleService_1.RoleService(pgClient);
    router.get('/', auth_1.hasAccess('read', roleService), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        roleService.getAccessByRouteAndRole('/owners', (_a = req.session) === null || _a === void 0 ? void 0 : _a.roleId)
            .then((access) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            res.render('owners', {
                title: 'Timetracker - Owners',
                sidebar: new sidebar_1.sidebarComponent('/owners', yield roleService.getAccessByRole((_b = req.session) === null || _b === void 0 ? void 0 : _b.roleId)).render(),
                table: new table_1.tableComponent(tableArray_1.default(yield ownerService.getOwners()), access.update, access.delete, './owners').render()
            });
        }))
            .catch(err => next(http_errors_1.default(err.message)));
    }));
    router.post('/', auth_1.hasAccess('create', roleService), validateQuery_1.validateBody(body => body.name != null), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        ownerService.createOwner(req.body.name)
            .then((data) => {
            console.log(data);
            res.status(201).redirect('/owners');
        })
            .catch(err => next(http_errors_1.default(500, err.message)));
    }));
    router.get('/api', auth_1.hasAccess('read', roleService), (_req, res) => __awaiter(this, void 0, void 0, function* () {
        res.status(200).send(yield ownerService.getOwners());
    }));
    router.get('/excel', auth_1.hasAccess('read', roleService), (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
        ownerService.getOwners()
            .then(data => {
            const parser = new json2csv_1.Parser();
            const csv = parser.parse(data);
            res.writeHead(200, {
                'Content-Disposition': `attachment; filename="Owners.csv"`,
                'Content-Type': 'text/csv',
            });
            res.end(csv);
        }).catch(err => next(http_errors_1.default(500, err.message)));
    }));
    return router;
}
exports.OwnersRoutes = OwnersRoutes;
