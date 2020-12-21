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
exports.LoginRoutes = void 0;
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const UserService_1 = require("../services/UserService");
const fs_1 = __importDefault(require("fs"));
const mustache_1 = __importDefault(require("mustache"));
const http_errors_1 = __importDefault(require("http-errors"));
function LoginRoutes(pgClient) {
    const userService = new UserService_1.UserService(pgClient);
    const router = express_1.Router();
    const template = fs_1.default.readFileSync(path_1.default.join(__dirname, '/../views/login.hbs'), 'utf8');
    router.get('/', (_req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send(mustache_1.default.render(template, {}));
    }));
    router.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        userService.validateLogin(req.body.username, req.body.password)
            .then(result => {
            if (result && typeof result !== 'boolean') {
                if (req.session) {
                    req.session.user = result.id;
                    req.session.roleId = result.role_id;
                    req.session.cookie.expires = false;
                }
                res.redirect('/');
            }
            else {
                res.send(mustache_1.default.render(template, { error: 'The username and password that you entered did not match our records. Please double-check and try again.' }));
            }
        })
            .catch(err => next(http_errors_1.default(500, err.message)));
    }));
    router.get('/signout', (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (req.session)
            req.session.user = undefined;
        res.redirect('/login');
    }));
    router.post('/api', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield userService.validateLogin(req.body.username, req.body.password);
        if (result && typeof result !== 'boolean') {
            if (req.session) {
                req.session.user = result.id;
                req.session.roleId = result.role_id;
                req.session.cookie.expires = false;
            }
            res.status(200).send({ success: true });
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }));
    router.delete('/api', (req, res) => __awaiter(this, void 0, void 0, function* () {
        if (req.session)
            req.session.user = undefined;
        res.status(203).send({ success: true });
    }));
    return router;
}
exports.LoginRoutes = LoginRoutes;
