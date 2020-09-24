import DbService from "./DbService";

class ProjectService extends DbService{
  async getProjects (ownerId: string) {
    return await this.client.query(`select * from project where owner_id = ${ownerId}`)
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
      ((user_hours + 1) / (p.budget + 0.1)) * 100 as "percent"
    from project p
    inner join owner o on o.id = p.owner_id
    inner join (select 
        u.id as id,
        u.name as name,
        t.project_id,
        sum(ROUND(cast((extract(epoch from "end" - "start")) as numeric) / 3600, 2)) as user_hours
      from time t
      inner join "user" u on u.id = user_id
      group by u.id, u.name, t.project_id) u on u.project_id = p.id
    inner join (
      select 
        p.id as project_id, 
        sum(ROUND(cast((extract(epoch from "end" - "start")) as numeric) / 3600, 2)) as project_hours
      from project p
      inner join time t on t.project_id = p.id
      group by p.id) as ih on ih.project_id = p.id
    `)
  }

  async createProject (ownerId: number, name: string, description: string, budget: number) {
    return await this.client.query(`
      insert into public.project(
      owner_id, name, description, budget)
      values (${ownerId}, '${name}', '${description}', ${budget})
    `)
  }
}

export default ProjectService