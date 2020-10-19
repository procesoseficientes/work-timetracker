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
}
