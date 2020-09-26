import { Component } from 'bigojs'
import fs from 'fs'
import path from 'path'

interface pillInterface {
  title: string,
  link: string,
  active: boolean
}

export interface pillsInterface {
  pills: pillInterface[]
}

const template = fs.readFileSync(path.resolve(__dirname, 'pills.html'), 'utf8')

/**
 * Class that represents a pills component
 */
export class pillsComponent extends Component<pillsInterface> {
  constructor(parent: string, pageLink: string) {
    const pages: any = {
      detail: [
        {
          title: 'Times',
          link: '/detail',
          active: false
        },
        {
          title: 'Projects',
          link: '/projects',
          active: false
        },
        {
          title: 'Owners',
          link: '/owners',
          active: false
        },
        {
          title: 'Users',
          link: '/users',
          active: false
        },
      ],
      stats: [
        {
          title: 'Team',
          link: '/team',
          active: false
        },
        {
          title: 'Projects',
          link: '/projects',
          active: false
        }
      ]
    }
    const viewData: pillsInterface = {
      pills: pages[parent].map((a: pillInterface) => {
        a.active = a.link === pageLink
        return a
      })
    }

    console.log(viewData)
    super(viewData, template)
  }
}