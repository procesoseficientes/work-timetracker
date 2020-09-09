"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = void 0;
function groupBy(xs, key) {
    return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}
exports.groupBy = groupBy;
//# sourceMappingURL=json.js.map