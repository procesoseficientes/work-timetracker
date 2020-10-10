import DbService from "./DbService"

export interface type {
  id: number,
  name: string, 
  active: boolean
}

class TypeService extends DbService{
  async getTypes (): Promise<type[]> {
    return (await this.client.query('select * from type order by id desc')).rows
  }

  async createType (name: string): Promise<number> {
    return (await this.client.query(`insert into "type"(type, active) values ('${name}', true) returning id`)).rows[0].id
  }
}

export default TypeService