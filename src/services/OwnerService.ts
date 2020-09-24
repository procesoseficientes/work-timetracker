import DbService from "./DbService";

class OwnerService extends DbService{
  async getOwners () {
    return await this.client.query('select * from owner order by id desc')
  }

  async createOwner (name: string) {
    return await this.client.query(`insert into "owner"(name, active) values ('${name}', true)`)
  }
}

export default OwnerService