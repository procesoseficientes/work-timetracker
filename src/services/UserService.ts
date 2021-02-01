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
        where u.active = true
        and username='${sqlString(username)}' and password='${sqlString(password)}'
      `)
      .then(data => data.rowCount > 0 ? resolve(<user>data.rows[0]) : resolve(false))
      .catch(err => reject(err))
    })
  }

  async createUser (name: string, username: string, password: string, roleId: number): Promise<number> {
    return (await this.client.query(`insert into "user"(name, username, password, active, role_id) values ('${sqlString(name)}', '${sqlString(username)}', '${sqlString(password)}', true, ${roleId}) returning id`)).rows[0].id
  }

  async updateUser (id: number, name: string, username: string, active: boolean, roleId: number): Promise<number> {
    return (await this.client.query(`
      update "user"
      set name = '${sqlString(name)}',
          username = '${sqlString(username)}',
          active = ${active},
          role_id = ${roleId}
      where id = ${id}
      returning id;
    `)).rows[0].id
  }

  async deleteUser (id: number): Promise<boolean> {
    return (await this.client.query(`delete from "user" where id = ${id} returning true as res;`)).rows[0].res
  }

  async toggleState (id: number): Promise<number> {
    return new Promise((res, rej) => {
      this.client.query(`
        update "user" set active = not active where id = ${sqlString(id.toString())}
        returning id
      `)
      .then(() => res(id))
      .catch(err => rej(err))
    })
  }
}
