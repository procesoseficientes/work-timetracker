import { sqlString } from "../utils/sqlStrings"
import DbService from "./DbService"

export interface owner {
  id: number,
  name: string, 
  active: boolean
}

class OwnerService extends DbService{
  async getOwners (actives = true): Promise<owner[]> {
    return (await this.client.query(`
      select * from owner
      ${actives ? 'where active = true' : ''}
      order by id desc
    `)).rows
  }

  async createOwner (name: string): Promise<number> {
    return (await this.client.query(`insert into "owner"(name, active) values ('${name}', true) returning id`)).rows[0].id
  }

  async toggleState (id: number): Promise<number> {
    return new Promise((res, rej) => {
      this.client.query(`
        update "owner" set active = not active where id = ${sqlString(id.toString())}
        returning id
      `)
      .then(() => res(id))
      .catch(err => rej(err))
    })
  }
}

export default OwnerService