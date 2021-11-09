import { userTime } from "../models/time"
import ColorHash from 'color-hash'

const colorHash = new ColorHash({lightness: 0.5})

function mapTime(element: userTime): userTime {
  const start = new Date(element.start).getTime()
  if (element.current) {
    element.hours = (new Date().getTime() - start) / 3600000
    element.percent = ((element.hours / 8) * 100)
  }

  const hoursSplit = element.hours.toString().split('.')
  element.color = colorHash.hex(element.type)
  element.hours = hoursSplit[0] + '.' + hoursSplit[1][0]
  return element
}

export default mapTime
