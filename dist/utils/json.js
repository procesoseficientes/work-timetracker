"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function groupBy(xs, key) {
    return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}
exports.groupBy = groupBy;
