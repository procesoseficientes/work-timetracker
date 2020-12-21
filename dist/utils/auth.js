"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAccess = exports.denyAll = exports.authenticated = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const http_errors_2 = __importDefault(require("http-errors"));
/**
 * Middleware to validate user session
 * @param req Express Request
 * @param res Express Respnse
 * @param next Express Next Function
 */
function authenticated(req, res, next) {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) {
        next();
    }
    else {
        res.status(401).redirect('/login');
    }
}
exports.authenticated = authenticated;
/**
 * *CAUTION* Middleware to deny all access to a route
 * @param req Express Request
 * @param res Express Respnse
 * @param next Express Next Function
 */
function denyAll(_req, res) {
    res.status(401).redirect('/login');
}
exports.denyAll = denyAll;
var accessType;
(function (accessType) {
    accessType["create"] = "create";
    accessType["read"] = "read";
    accessType["update"] = "update";
    accessType["delete"] = "delete";
})(accessType || (accessType = {}));
/**
 * Middleware to only allow access to a certain accessType
 * @param accessType The authority to require and allow access
 * @param roleService RoleService to access role information
 */
function hasAccess(access, roleService) {
    return (req, res, next) => {
        var _a;
        if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.roleId) {
            roleService.getAccessByRole(req.session.roleId)
                .then(accesses => {
                const route = `/${req.originalUrl.split('/')[1]}`;
                const routeAccess = accesses.find(a => a.route === route);
                if (routeAccess && routeAccess[access] == true) {
                    next();
                }
                else {
                    next(http_errors_1.default(403, 'Access Forbidden'));
                }
            }).catch(err => next(http_errors_2.default(500, err.message)));
        }
        else {
            res.status(401).redirect('/login');
        }
    };
}
exports.hasAccess = hasAccess;
