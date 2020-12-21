"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = exports.validateQuery = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
function validateQuery(params) {
    return (req, _res, next) => {
        let success = true;
        for (const param of params) {
            if (req.query[param] == null) {
                next(http_errors_1.default(400, `Missing one or all of the following parameters '${params.join(', ')}'`));
                success = false;
                break;
            }
        }
        if (success)
            next();
    };
}
exports.validateQuery = validateQuery;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateBody(predicate) {
    return (req, _res, next) => {
        if (predicate(req.body)) {
            next();
        }
        else {
            next(http_errors_1.default(400, 'Invalid body format'));
        }
    };
}
exports.validateBody = validateBody;
