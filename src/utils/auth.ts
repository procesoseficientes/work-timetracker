import { Request, Response, NextFunction } from 'express'
import { RoleService } from '../services/RoleService'

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

/**
 * Middleware to only allow access to a certain accessType
 * @param accessType The authority to require and allow access 
 * @param roleService RoleService to access role information
 */
export function hasAccess(accessType: string, roleService: RoleService) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.session?.roleId) {
      roleService.getRole(req.session.roleId)
      .then(role => {
        if (role.name === accessType) {
          next()
        } else {
          next({
            message: 'Access Forbidden',
            status: '401'
          })
        }
      }).catch(err => next(err))
    } else {
      res.status(401).redirect('/login')
    }
  }
}