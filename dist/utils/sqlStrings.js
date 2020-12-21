"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlString = void 0;
/**
 * Replaces all characters that might be use for a SQL injection with escaped characters
 * @param string string to be templated in a SQL Query
 */
function sqlString(string) {
    // eslint-disable-next-line no-control-regex
    string = string.replace(/[\0\n\r\b\t\\'"\x1a]/g, (s) => {
        switch (s) {
            case '\0':
                return '\\0';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\b':
                return '\\b';
            case '\t':
                return '\\t';
            case '\x1a':
                return '\\Z';
            case "'":
                return "''";
            case '"':
                return '""';
            default:
                return "\\" + s;
        }
    });
    return string;
}
exports.sqlString = sqlString;
