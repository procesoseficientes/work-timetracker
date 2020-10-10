import DbService from "./DbService"

interface project {
  id: number
  owner_id: number
  name: string
  description: string
  active: boolean
  budget: number
}

export interface projectDetail {
  id: number
  time_id: number
  name: string
  description: string
  user: string
  hours: number
  project_hours: number
  percent: number
  color?: string
}

class ProjectService extends DbService{
  async getProjects(): Promise<project[]> {
    return (await this.client.query(`
    select p.id, o.name as "owner", p.name, p.description, p.budget, p.active from project p
    inner join owner o on o.id = p.owner_id`)).rows
  }

  async getProjectsByOwner (ownerId: number): Promise<project[]> {
    return (await this.client.query(`
    select p.id, o.name as "owner", p.name, p.description, p.budget, p.active from project p
    inner join owner o on o.id = p.owner_id where p.owner_id = ${ownerId}`)).rows
  }
  
  async getProjectsDetail (): Promise<projectDetail[]> {
    return (await this.client.query(`
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
    `)).rows
  }

  async createProject (ownerId: number, name: string, description: string, budget: number): Promise<number> {
    return (await this.client.query(`
      insert into public.project(
      owner_id, name, description, budget)
      values (${ownerId}, '${name}', '${description}', ${budget})
      returning id
    `)).rows[0].id
  }
}

export default ProjectService