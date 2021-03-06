/**
 * Replaces all characters that might be use for a SQL injection with escaped characters
 * @param string string to be templated in a SQL Query
 */
export function sqlString(string: string): string {
  // eslint-disable-next-line no-control-regex
  string = string.replace(/[\0\b\t\\'"\x1a]/g, (s: string) => {
    switch (s) {
      case '\0':
        return '\\0'
      case '\b':
        return '\\b'
      case '\t':
        return '\\t'
      case '\x1a':
        return '\\Z'
      case "'":
        return "''"
      case '"':
        return '""'
      default:
        return "\\" + s
    }
  })

  return string
}
