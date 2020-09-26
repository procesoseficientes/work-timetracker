import { Component } from 'bigojs'
import fs from 'fs'
import path from 'path'

export interface tableInterface {
  keys: string[],
  rows: {id: number, data: string[], active: boolean}[],
}

const template = fs.readFileSync(path.resolve(__dirname, 'table.html'), 'utf8')

/**
 * Class that represents a table component
 */
export class tableComponent extends Component<tableInterface> {
  constructor(viewData: tableInterface) {
    super(viewData, template)
  }
}