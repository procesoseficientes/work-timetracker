import { Request, Response, NextFunction } from 'express'

export function validateQuery(params: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    let success = true
    for (const param of params) {
      if (req.query[param] == null) {
        next({message: `Missing one or all of the following parameters '${params.join(', ')}'`, status: 400})
        success = false
        break
      }
    }
    if (success) next()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateBody(predicate: (body: any) => boolean) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (predicate(req.body)) {
      next()
    } else {
      next({message: `Incorrect body format`, status: 400})
    }
  }
}