/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function groupBy (xs: any[], key: string) {
  return xs.reduce((rv: { [x: string]: any[] }, x: { [x: string]: string | number }) => {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}
