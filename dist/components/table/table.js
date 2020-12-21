"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableComponent = void 0;
const bigojs_1 = require("bigojs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const template = fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'table.html'), 'utf8');
/**
 * Class that represents a table component
 */
class tableComponent extends bigojs_1.Component {
    constructor(viewData, edit, del, route) {
        viewData.del = del;
        viewData.edit = edit;
        viewData.route = route;
        super(viewData, template);
    }
}
exports.tableComponent = tableComponent;
