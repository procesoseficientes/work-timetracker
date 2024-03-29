import { Component } from 'bigojs'
import fs from 'fs'
import path from 'path'
import { access } from '../../models/access'

export interface sidebarItem {
  link: string,
  icon: string,
  caption: string,
  visible: boolean
  active?: boolean
}

export interface sidebarInterface {
  groups: {
    items: sidebarItem[],
    header?: string
  }[]
}

const template = fs.readFileSync(path.resolve(__dirname, 'sidebar.hbs'), 'utf8')

/**
 * Class that represents a sidebar component
 */
export class sidebarComponent extends Component<sidebarInterface> {
  constructor(pageLink: string, accesses: access[] = []) {
    const pages: sidebarInterface = {
      groups: [
        {
          items: [
            {
              link: '/',
              icon: '<svg class="feather" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
              caption: 'Track',
              visible: accesses.find(a => a.route === '/')?.read === true
            },
            {
              link: '/team',
              icon: '<svg class="feather" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
              caption: 'Team',
              visible: accesses.find(a => a.route === '/team')?.read === true
            },
            {
              link: '/stats',
              icon: '<svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
              caption: 'Projects',
              visible: accesses.find(a => a.route === '/stats')?.read === true
            },
            {
              link: '/changelog',
              icon: '<svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
              caption: 'Changelog',
              visible: true
            }
          ]
        },
        {
          header: 'Admin',
          items: [
            {
              link: '/detail',
              icon: '<svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
              caption: 'Times',
              visible: accesses.find(a => a.route === '/detail')?.read === true
            },
            {
              link: '/projects',
              icon: '<svg class="feather" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-briefcase" fill="currentColor" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-6h-1v6a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-6H0v6z"/> <path fill-rule="evenodd" d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5v2.384l-7.614 2.03a1.5 1.5 0 0 1-.772 0L0 6.884V4.5zM1.5 4a.5.5 0 0 0-.5.5v1.616l6.871 1.832a.5.5 0 0 0 .258 0L15 6.116V4.5a.5.5 0 0 0-.5-.5h-13zM5 2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V3h-1v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V3H5v-.5z"/> </svg>',
              caption: 'Projects',
              visible: accesses.find(a => a.route === '/projects')?.read === true
            },
            {
              link: '/owners',
              icon: '<svg class="feather" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
              caption: 'Owners',
              visible: accesses.find(a => a.route === '/owners')?.read === true
            },
            {
              link: '/users',
              icon: '<svg class="feather" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
              caption: 'Users',
              visible: accesses.find(a => a.route === '/users')?.read === true
            },
            {
              link: '/types',
              icon: '<svg class="feather" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
              caption: 'Types',
              visible: accesses.find(a => a.route === '/types')?.read === true
            },
            {
              link: '/roles',
              icon: '<svg class="feather" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
              caption: 'Roles',
              visible: accesses.find(a => a.route === '/roles')?.read === true
            }
          ]
        }
      ]
    }

    pages.groups = pages.groups.map(group => {
      group.items = group.items.map(item => {
        item.active = pageLink === item.link
        return item
      })
      return group
    })

    super(pages, template)
  }
}
