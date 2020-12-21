"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapTime(element, index) {
    const colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning'];
    const start = new Date(element.start).getTime();
    if (element.current) {
        element.hours = (new Date().getTime() - start) / 3600000;
        element.percent = ((element.hours / 8) * 100) + 3;
    }
    const hoursSplit = element.hours.toString().split('.');
    element.color = colors[index];
    element.hours = hoursSplit[0] + '.' + hoursSplit[1][0];
    return element;
}
exports.default = mapTime;
