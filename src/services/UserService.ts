import DbService from "./DbService";

interface user {
  username: string, 
  password: string,
  id: number,
  active: boolean,
  role: number
}

class UserService extends DbService{
  async getUsers (): Promise<user[]> {
    return (await this.client.query('select * from "user"')).rows
  }

  async createUser (name: string, username: string, password: string): Promise<number> {
    return (await this.client.query(`insert into "user"(name, username, password, active) values ('${name}', '${username}', '${password}', true) returning id`)).rows[0].id
  }
}

export default UserService