import { type } from "../models/type"
import { sqlString } from "../utils/sqlStrings"
import DbService from "./DbService"

class TypeService extends DbService{
  async getTypes (): Promise<type[]> {
    return (await this.client.query('select * from type order by id desc')).rows
  }

  async createType (name: string): Promise<number> {
    return (await this.client.query(`insert into "type"(type, active) values ('${name}', true) returning id`)).rows[0].id
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

export default TypeService
