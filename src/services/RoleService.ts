import DbService from "./DbService"

export interface role {
  id: number,
  name: string, 
  active: boolean,
  color: string
}

export class RoleService extends DbService{
  async getRoles (): Promise<role[]> {
    return (await this.client.query('select * from role order by id desc')).rows
  }

  async createRole (name: string, color: string): Promise<number> {
    return (await this.client.query(`insert into role(name, active, color) values ('${name}', true, '${color}') returning id`)).rows[0].id
  }

  async updateRole(roleId: number, name: string, color: string) {
    
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

  async getAccessByRole(roleId: number): Promise<{
    id: number,
    role_id: number,
    route: string,
    create: boolean,
    read: boolean,
    update: boolean,
    delete: boolean
  }[]> {
    const query = `
    select a.id, a.route, a."create", a.read, a.update, a.delete from role
    inner join access a on role.id = a.role_id
    where role.id = ${roleId};`
    return (await this.client.query(query)).rows
  }
}
