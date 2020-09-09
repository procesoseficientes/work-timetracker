import { Client } from 'pg'

class DbService {
  client: Client
  constructor (url: string) {
    this.client = new Client({
      connectionString: url,
      ssl: {
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

  async getProjects (ownerId: string) {
    return await this.client.query(`select * from project where owner_id = ${ownerId}`)
  }

  async getTimes (
    name = '',
    owner = '',
    project = '',
    from = '1970-01-01T00:00:00.000',
    to = new Date().toISOString().replace('Z', '+00'),
    page = 0
  ) {
    return await this.client.query(`
      select 
        u.name as "name",  
        o.name as "owner",
        p.name as project,
        task,
        "start",
        "end",
        date_part('hour', "end" - "start") as "hours"
      from time t
      inner join owner o on o.id = owner_id
      inner join project p on p.id = project_id
      inner join "user" u on u.id = user_id 
      where lower(u.name) like '%${name.toLowerCase()}%'
        and lower(o.name) like '%${owner.toLowerCase()}%'
        and lower(p.name) like '%${project.toLowerCase()}%'
        and "start" between '${from}' and '${to}'
      order by "start" desc
      limit 51
      offset ${page * 50}
    `)
  }

  async startTracking (
    userId: number, 
    ownerId: string, 
    projectId: string, 
    task: string
  ) {
    return await this.client.query(`
      update "time" set "end" = CURRENT_TIMESTAMP
      where user_id = ${userId}
      and "end" is null;

      insert into "time"(
      user_id, owner_id, project_id, task, start)
      values (${userId}, ${ownerId}, ${projectId}, '${task}', CURRENT_TIMESTAMP);
    `)
  }

  async stopTracking (userId: string) {
    return await this.client.query(`
      update "time" set "end" = CURRENT_TIMESTAMP
      where user_id = ${userId}
      and "end" is null`)
  }

  async getProjectsDetail () {
    return await this.client.query(`
    select
      p.id,
      u.id as time_id,
      p.name, 
      p.description,
      u.name as "user",
      user_hours as "hours",
      project_hours,
      (user_hours / project_hours) * 100 as "percent"
    from project p
    inner join owner o on o.id = p.owner_id
    inner join (select 
        u.id as id,
        u.name as name,
        t.project_id,
        sum(date_part('hour', "end" - "start")) as user_hours
      from time t
      inner join "user" u on u.id = user_id
      group by u.id, u.name, t.project_id) u on u.project_id = p.id
    inner join (
      select 
        p.id as project_id, 
        sum(date_part('hour', "end" - "start")) as project_hours
      from project p
      inner join time t on t.project_id = p.id
      group by p.id) as ih on ih.project_id = p.id
    `)
  }

  async insertProjects (ownerId: string, name: string, description: string) {
    return await this.client.query(`
      insert into public.project(
      owner_id, name, description)
      values (${ownerId}, '${name}', '${description}')
    `)
  }
}

export default DbService
