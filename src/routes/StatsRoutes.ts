import { Router } from 'express'
import { groupBy } from '../utils/json'
import { Client } from 'pg'
import ProjectsService from '../services/ProjectService'
import OwnerService from '../services/OwnerService'
import { sidebarComponent } from '../components/sidebar/sidebar'
import { hasAccess } from '../utils/auth'
import { RoleService } from '../services/RoleService'
import { owner } from '../models/owner'
import { projectDetail } from '../models/projectDetail'

export function StatsRoutes (pgClient: Client): Router {
  const router = Router()
  const projectService = new ProjectsService(pgClient)
  const ownerService = new OwnerService(pgClient)
  const roleService = new RoleService(pgClient)
  const colors = ['bg-primary', 'bg-info', 'bg-danger', 'bg-secondary', 'bg-warning']

  router.get('/', hasAccess('read', roleService) ,async (req, res) => {
    if (!req.query.page || req.query.page === '') req.query.page = '0'
    res.render('stats', await statsView(<string>req.query.page, req.session?.roleId || 0))
  })

  async function statsView (page: string, roleId: number): Promise<{
    title: string;
    sidebar: string;
    owners: owner[];
    projects: {
        id: number;
        times: projectDetail;
        name: string;
        description: string;
        hours: number;
    }[];
    page: string;
  }> {
    const projects = groupBy((await projectService.getProjectsDetail()), 'id')
    const grouped = Object.keys(projects).map(a => {
      const g = {
        id: parseInt(a),
        times: projects[a],
        name: projects[a][0].name,
        description: projects[a][0].description,
        hours: projects[a][0].project_hours
      }
      g.times = g.times.map((b: projectDetail) => {
        b.color = colors[b.time_id % colors.length]
        return b
      })
      return g
    })
    return {
      title: 'Timetracker - Stats',
      sidebar: new sidebarComponent(
        '/stats',
        await roleService.getAccessByRole(roleId)
      ).render(),
      owners: await ownerService.getOwners(),
      projects: grouped,
      page: page
    }
  }

  return router
}
