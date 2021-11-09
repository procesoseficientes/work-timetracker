import { Router } from "express"
import { Client } from "pg"
import { Converter } from "showdown"
import { sidebarComponent } from "../components/sidebar/sidebar"
import { RoleService } from "../controllers/RoleService"
import { authenticated } from "../utils/auth"

export function ChangeLogRoutes(pgClient: Client, changeLogMD: string): Router {
  const router: Router = Router()
  const roleService = new RoleService(pgClient)

  router.get('/', authenticated ,async (req, res) => {
    res.render('changelog', {
      title: 'Timetracker - Changelog',
      body: new Converter({simplifiedAutoLink: true, simpleLineBreaks: true}).makeHtml(changeLogMD),
      sidebar: new sidebarComponent(
        '/changelog',
        await roleService.getAccessByRole(req.session?.roleId || 0)
        ).render()
    })
  })
  return router
}
