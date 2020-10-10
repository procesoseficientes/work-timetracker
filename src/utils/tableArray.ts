import { tableInterface } from "../components/table/table"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTableArray(data: any[]): tableInterface {
  const keys = data.length === 0 ? [] : Object.keys(data[0]).filter(a => a !== 'active' && a !== 'id' && a !== 'password')
  return {
    keys: keys.map(a => a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')),
    rows: data.map(i => {
      return {
        id: i.id,
        data: keys.map(a => i[a]),
        active: i.active
      }
    })
  }
}

export default toTableArray