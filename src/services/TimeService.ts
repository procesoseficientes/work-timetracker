import DbService from "./DbService"

interface time {
  name: string,
  owner: string,
  project: string,
  task: string,
  start: string,
  end: string,
  hours: string
}

export interface userTime {
  user_id: string,
  owner: string,
  project: string,
  task: string, 
  start: string | number | Date,
  end: string | number | Date,
  current: boolean; 
  hours: string | number,
  percent: number; 
  color: string
}

class TimeService extends DbService{
  async getTimes (
    name = '',
    owner = '',
    project = '',
    from = '1970-01-01T00:00:00.000',
    to = new Date().toISOString().replace('Z', '+00'),
    page = 0
  ): Promise<time[]> {
    return (await this.client.query(`
      select 
        u.name as "name",  
        o.name as "owner",
        p.name as project,
        task,
        "start",
        "end",
        ROUND(cast((extract(epoch from "end" - "start")) as numeric) / 3600, 2) as "hours"
      from time t
      inner join owner o on o.id = owner_id
      inner join project p on p.id = project_id
      inner join "user" u on u.id = user_id 
      where lower(u.name) like '%${name.toLowerCase()}%'
        and lower(o.name) like '%${owner.toLowerCase()}%'
        and lower(p.name) like '%${project.toLowerCase()}%'
        and "start" between '${from}' and '${to}'
      order by "start" desc
      limit 26
      offset ${page * 25}
    `)).rows.map(a => {
      a.start = new Date(a.start)
      a.start.setHours(a.start.getHours() - 6)
      if (a.end) {
        a.end = new Date(a.end)
        a.end.setHours(a.end.getHours() - 6)
      }
      return a
    })
  }

  async startTracking (
    userId: number, 
    ownerId: string, 
    projectId: string, 
    task: string,
    typeId: number
  ): Promise<number> {
    const result: any = (await this.client.query(`
    update "time" set "end" = CURRENT_TIMESTAMP
    where user_id = ${userId}
    and "end" is null;

    insert into "time"(
    user_id, owner_id, project_id, task, type_id, start)
    values (${userId}, ${ownerId}, ${projectId}, '${task}', ${typeId}, CURRENT_TIMESTAMP) returning id;
  `))
    return result[1].rows[0].id
  }

  async stopTracking (userId: number) {
    return await this.client.query(`
      update "time" set "end" = CURRENT_TIMESTAMP
      where user_id = ${userId}
      and "end" is null`)
  }

  async getTodayUser (userId: number): Promise<userTime[]> {
    return (await this.client.query(`
      select 
        user_id,
        o.name as "owner",
        p.name as "project",
        t.task,
        t.start,
        "end" is null as "current",
        (extract(epoch from "end" - "start")) / 3600 as hours,
        (extract(epoch from "end" - "start") / 28800) * 100 as "percent"
      from "time" t
      inner join "owner" o on owner_id = o.id
      inner join project p on project_id = p.id
      where user_id = ${userId}
      and "start" > now() - interval '1 day'
      order by "start" desc
    `)).rows
  }

  async getTodayTeam() {
    return await this.client.query(`
      select 
        t.id as "time_id",
        user_id,
        u.name,
        o.name as "owner",
        p.name as "project",
        t.task,
        t.start,
        "end" is null as "is_current",
        (extract(epoch from "end" - "start")) / 3600 as hours,
        (extract(epoch from "end" - "start") / 28800) * 100 as "percent"
      from "time" t
      inner join "owner" o on owner_id = o.id
      inner join "user" u on user_id = u.id
      inner join project p on project_id = p.id
      and "start" > now() - interval '1 day'
      order by "start" desc
    `)
  }
}

export default TimeService