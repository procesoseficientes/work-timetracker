import DbService from "./DbService"

export interface owner {
  id: number,
  name: string, 
  active: boolean
}

class OwnerService extends DbService{
  async getOwners (): Promise<owner[]> {
    return (await this.client.query('select * from owner order by id desc')).rows
  }

  async createOwner (name: string): Promise<number> {
    return (await this.client.query(`insert into "owner"(name, active) values ('${name}', true) returning id`)).rows[0].id
  }
}

export default OwnerService