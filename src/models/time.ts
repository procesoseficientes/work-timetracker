export interface time {
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
  owner_id: number,
  project: string,
  project_id: string,
  task: string,
  start: string | number | Date,
  end: string | number | Date,
  current: boolean,
  hours: string | number,
  percent: number,
  color: string
}

export interface teamTime {
  time_id: number,
  user_id: number,
  name: string,
  owner: string,
  project: string,
  task: string,
  start: Date,
  is_current: boolean,
  hours: number,
  percent: number
}
