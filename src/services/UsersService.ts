import DbService from "./DbService";

class UsersService extends DbService{
  async getUsers () {
    return await this.client.query('select * from "user"')
  }

  async createUser (name: string, username: string, password: string) {
    return await this.client.query(`insert into "user"(name, username, password, active) values ('${name}', '${username}', '${password}', true)`)
  }
}

export default UsersService