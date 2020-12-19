import { Request, Response, NextFunction } from 'express'
import { RoleService } from '../services/RoleService'
import createError from 'http-errors'

/**
 * Middleware to validate user session
 * @param req Express Request
 * @param res Express Respnse
 * @param next Express Next Function
 */
export function authenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.session?.user) {
    next()
  } else {
    res.status(401).redirect('/login')
  }
}

/**
 * *CAUTION* Middleware to deny all access to a route
 * @param req Express Request
 * @param res Express Respnse
 * @param next Express Next Function
 */
export function denyAll(_req: Request, res: Response): void {
  res.status(401).redirect('/login')
}

enum accessType {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete'
}

/**
 * Middleware to only allow access to a certain accessType
 * @param accessType The authority to require and allow access 
 * @param roleService RoleService to access role information
 */
export function hasAccess(access: keyof typeof accessType, roleService: RoleService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.session?.roleId) {
      roleService.getAccessByRole(req.session.roleId)
      .then(accesses => {
        const route = `/${req.originalUrl.split('/')[1]}`
        const routeAccess: any = accesses.find(a => a.route === route)
        console.log(route, routeAccess)
        if (routeAccess && routeAccess[access] == true) {
          next()
        } else {
          next(createError(403, 'Access Forbidden'))
        }
      }).catch(err => next(err))
    } else {
      res.status(401).redirect('/login')
    }
  }
}