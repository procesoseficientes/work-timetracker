import express from 'express'
import { Client } from 'pg'
import { tableComponent } from '../components/table/table'
import toTableArray from '../utils/tableArray'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { RoleService } from '../services/RoleService'

class RolesRoutes {
  router: express.Router
  pgClient: Client
  roleService: RoleService
  
  constructor (pgClient: Client) {
    this.router = express.Router()
    this.roleService = new RoleService(pgClient)

    this.router.get('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.render('roles', await this.rolesView())
      }
    })

    this.router.post('/', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        if (
          req.body.role &&
          req.body.color
        ) {
          try {
            this.roleService.createRole(req.body.role, req.body.color)
            res.status(201).redirect('/roles')
          } catch (error) {
            console.error(error)
            res.status(500).redirect('/roles')
          }
        } else {
          console.error('Insufficient parameters for request')
          res.status(401).redirect('/roles')
        }
      }
    })
  
    this.router.get('/:id', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.render('role', {
          title: `Timetracker - Roles`,
          sidebar: new sidebarComponent('/roles').render(),
          role: await this.roleService.getRole(parseInt(req.params.id)),
          table: new tableComponent(
            toTableArray(await this.roleService.getAccessByRole(parseInt(req.params.id))), 
            true, 
            true,
            `/roles/${req.params.id}`
          ).render()
        })
      }
    })

    this.router.get('/api', async (req, res) => {
      if (!req.session.user) {
        res.status(401).redirect('/login')
      } else {
        res.status(200).send(await this.roleService.getRoles())
      }
    })

  }

  async rolesView (): Promise<{
    title: string;
    sidebar: string;
    table: string;
  }> {
    return {
      title: 'Timetracker - Roles',
      sidebar: new sidebarComponent('/roles').render(),
      table: new tableComponent(
        toTableArray(await this.roleService.getRoles()), 
        true, 
        false,
        './roles'
      ).render()
    }
  }
}

export default RolesRoutes
