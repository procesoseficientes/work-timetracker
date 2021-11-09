import { access } from "../models/access"
import { role } from "../models/role"
import { sqlString } from "../utils/sqlStrings"
import DbService from "./DbService"

export class RoleService extends DbService{
  updateRole(arg0: number, role: string, color: string): void {
    console.log(arg0, role, color)
    throw new Error('Method not implemented.')
  }
  async getRoles (): Promise<role[]> {
    return (await this.client.query('select * from role order by id desc')).rows
  }

  async createRole (name: string, color: string): Promise<number> {
    return (await this.client.query(`insert into role(name, active, color) values ('${sqlString(name)}', true, '${sqlString(color)}') returning id`)).rows[0].id
  }

  async getRole(roleId: number): Promise<{
    id: number,
    name: string,
    active: boolean,
    color: string
  }> {
    const query = `
    select * from role
    where id = ${roleId};`
    return (await this.client.query(query)).rows[0]
  }

  async getAccessByRouteAndRole(route: string, roleId: number): Promise<access> {
    const query = `
    select a.id, a.route, a."create", a.read, a.update, a.delete
    from access a
    where role_id = ${roleId}
    and route = '${sqlString(route)}';`
    return (await this.client.query(query)).rows[0]
  }

  async getAccessByRole(roleId: number): Promise<access[]> {
    const query = `
    select a.id, a.route, a."create", a.read, a.update, a.delete
    from role
    inner join access a on role.id = a.role_id
    where role.id = ${roleId};`
    return (await this.client.query(query)).rows
  }

  async createAccess(roleId: number, route: string, create: boolean, read: boolean, update: boolean, _delete: boolean): Promise<number> {
    return (await this.client.query(`
      insert into access(role_id, route, "create", read, update, delete)
      values (${roleId}, '${sqlString(route)}', ${create}, ${read}, ${update}, ${_delete})
      returning id
    `)).rows[0].id
  }

  async updateAccess(accessId: number, route: string, create: boolean, read: boolean, update: boolean, _delete: boolean): Promise<number> {
    return (await this.client.query(`
      update access
      set route = '${sqlString(route)}',
      "create" = ${create},
      read = ${read},
      update = ${update},
      delete = ${_delete}
      where id = ${accessId}
      returning id;
    `)).rows[0].id
  }

  async getAccess(accessId: number): Promise<access> {
    const query = `
    select * from access
    where id = ${accessId};`
    return (await this.client.query(query)).rows[0]
  }

  async toggleState (id: number): Promise<number> {
    return new Promise((res, rej) => {
      this.client.query(`
        update type set active = not active where id = ${sqlString(id.toString())}
        returning id
      `)
      .then(() => res(id))
      .catch(err => rej(err))
    })
  }
}
