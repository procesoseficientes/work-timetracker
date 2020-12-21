import { sqlString } from "../utils/sqlStrings"
import DbService from "./DbService"

export interface user {
  username: string, 
  password: string,
  id: number,
  active: boolean,
  role: string,
  role_id: number
}

export class UserService extends DbService{
  async getUsers (): Promise<user[]> {
    return (await this.client.query(`
    select 
      u.id, 
      u.name, 
      u.username, 
      u.active, 
      r.name as "role",
      u.role_id
    from public."user" u
    inner join role r on r.id = u.role_id`)).rows
  }

  async getUser(userId: number): Promise<user> {
    return (await this.client.query(`
    select 
      u.id, 
      u.name, 
      u.username, 
      u.active, 
      r.name as "role",
      u.role_id
    from public."user" u
    inner join role r on r.id = u.role_id
    where u.id = ${userId}`)).rows[0]
  }

  validateLogin(username: string, password: string): Promise<user | boolean> {
    return new Promise((resolve, reject) => {
      this.client.query(`
        select 
          u.id, 
          u.name, 
          u.username, 
          u.active, 
          r.name as "role",
          u.role_id
        from public."user" u
        inner join role r on r.id = u.role_id
        where username='${sqlString(username)}' and password='${sqlString(password)}'
      `)
      .then(data => data.rowCount > 0 ? resolve(<user>data.rows[0]) : resolve(false))
      .catch(err => reject(err))
    })
  }

  async createUser (name: string, username: string, password: string): Promise<number> {
    return (await this.client.query(`insert into "user"(name, username, password, active) values ('${name}', '${username}', '${password}', true) returning id`)).rows[0].id
  }

  async updateUser (id: number, name: string, username: string, active: boolean, roleId: number): Promise<number> {
    return (await this.client.query(`
      update "user"
      set name = '${sqlString(name)}',
          username = '${sqlString(username)}',
          active = ${active},
          role = ${roleId}
      where id = ${id};
    `)).rows[0].id
  }
}
