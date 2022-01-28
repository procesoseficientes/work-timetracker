import { Component } from 'bigojs'
import fs from 'fs'
import path from 'path'
import { time } from '../../models/time'

export interface reportInterface extends time {
  data: time[],
  totalHours: number
}

const template = fs.readFileSync(path.resolve(__dirname, 'detailReport.hbs'), 'utf8')

/**
 * Class that represents a report component
 */
export class DetailReport extends Component<reportInterface> {
  constructor(viewData: reportInterface) {
    super(viewData, template)
  }
}