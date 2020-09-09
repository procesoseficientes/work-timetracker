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
class UsersRoutes {
    constructor(dbService) {
        this.dbService = dbService;
        this.router = express_1.default.Router();
        this.router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.render('users', yield this.usersView());
        }));
        this.router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.name &&
                req.body.username &&
                req.body.password) {
                try {
                    this.dbService.createUser(req.body.name, req.body.username, req.body.password);
                    res.status(201).render('users', yield this.usersView());
                }
                catch (error) {
                    console.error(error);
                    res.status(500).render('users', yield this.usersView());
                }
            }
            else {
                console.error('Insufficient parameters for request');
                res.status(401).render('users', yield this.usersView());
            }
        }));
    }
    usersView() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                title: 'Timetracker - Users',
                users: (yield this.dbService.getUsers()).rows
            };
        });
    }
}
exports.default = UsersRoutes;
//# sourceMappingURL=users.js.map