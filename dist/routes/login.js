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
const path_1 = __importDefault(require("path"));
class LoginRoutes {
    constructor(dbService) {
        this.colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning'];
        this.dbService = dbService;
        this.router = express_1.default.Router();
        this.router.get('/', (_req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            res.sendFile(path_1.default.join(__dirname + '/login.html'));
        }));
        this.router.post('/', (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const users = (yield this.dbService.getUsers()).rows;
            console.log(req.body);
            console.log(users);
            const result = users.find(u => {
                return u.username === req.body.username && u.password === req.body.password;
            });
            console.log(result);
            if (result) {
                req.session.user = result.id;
                res.redirect('/');
            }
            else {
                res.status(401).sendFile(path_1.default.join(__dirname + '/login.html'));
            }
        }));
    }
}
exports.default = LoginRoutes;
//# sourceMappingURL=login.js.map