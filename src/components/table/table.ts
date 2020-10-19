import { Component } from 'bigojs'
import fs from 'fs'
import path from 'path'

export interface tableInterface {
  keys: string[],
  rows: {id: number, data: string[], active: boolean}[],
  edit?: boolean,
  del?: boolean,
  route?: string
}

const template = fs.readFileSync(path.resolve(__dirname, 'table.html'), 'utf8')

/**
 * Class that represents a table component
 */
export class tableComponent extends Component<tableInterface> {
  constructor(
    viewData: tableInterface, 
    edit: boolean, 
    del: boolean,
    route: string
  ) {
    viewData.del = del
    viewData.edit = edit
    viewData.route = route
    super(viewData, template)
  }
}