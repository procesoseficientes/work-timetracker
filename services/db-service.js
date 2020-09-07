const { Client } = require('pg')

class DbService {
  constructor (url) {
    this.client = new Client({
      connectionString: url,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    })
    this.client.connect().catch((err) => {
      console.error(err)
    })
  }

  async getOwners () {
    return await this.client.query('select * from owner')
  }

  async getTimes (
    name = '',
    owner = '',
    proyect = '',
    from = '1970-01-01T00:00:00.000',
    to = new Date().toISOString().replace('Z', '+00'),
    page = 0
  ) {
    return await this.client.query(`
      select 
        u.name as "name",  
        o.name as "owner",
        p.name as proyect,
        task,
        "start",
        "end",
        date_part('hour', "end" - "start") as "hours"
      from time t
      inner join owner o on o.id = owner_id
      inner join proyect p on p.id = proyect_id
      inner join "user" u on u.id = user_id 
      where lower(u.name) like '%${name.toLowerCase()}%'
        and lower(o.name) like '%${owner.toLowerCase()}%'
        and lower(p.name) like '%${proyect.toLowerCase()}%'
        and "start" between '${from}' and '${to}'
      limit 51
      offset ${page * 50}
    `)
  }

  async getProyects () {
    return await this.client.query(`
    select
      p.id,
      u.id as time_id,
      p.name, 
      p.description,
      u.name as "user",
      user_hours as "hours",
      proyect_hours,
      (user_hours / proyect_hours) * 100 as "percent"
    from proyect p
    inner join owner o on o.id = p.owner_id
    inner join (select 
        u.id as id,
        u.name as name,
        t.proyect_id,
        sum(date_part('hour', "end" - "start")) as user_hours
      from time t
      inner join "user" u on u.id = user_id
      group by u.id, u.name, t.proyect_id) u on u.proyect_id = p.id
    inner join (
      select 
        p.id as proyect_id, 
        sum(date_part('hour', "end" - "start")) as proyect_hours
      from proyect p
      inner join time t on t.proyect_id = p.id
      group by p.id) as ih on ih.proyect_id = p.id
    `)
  }
}

module.exports = DbService
