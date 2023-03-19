import escape from 'licia/escape'
import detectOs from 'licia/detectOs'
import { IInfo } from './Types'
import { classPrefix as c } from '@/lib/util'
import detectBrowser from 'licia/detectBrowser'

const infos: IInfo[] = [
  {
    name: 'Location',
    val() {
      return escape(location.href)
    },
  },
  {
    name: 'User Agent',
    val: navigator.userAgent,
  },
  {
    name: 'Device',
    val: `
      <table>
        <tbody>
          <tr>
            <td class="${c('device-key')}"></td>
            <td>${screen.width} * ${screen.height}</td>
          </tr>
          <tr>
            <td>view port</td>
            <td>${window.innerWidth} * ${window.innerHeight}</td>
          </tr>
          <tr>
            <td>pixel ratio</td>
            <td>${window.devicePixelRatio}</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    name: 'System',
    val: () => {
      const browser = detectBrowser()
      return `
        <table>
          <tr>
            <td class="${c('system-key')}">os</td>
            <td>${detectOs()}</td>
          </tr>
          <tr>
            <td>broswer</td>
            <td>${browser.name} ${browser.version}</td>
          </tr>
        </table>
      `
    },
  },
  {
    name: 'Source code',
    val: `<a href="https://github.com/GreenMashimaro/eruda-ts">Eruda ts</a>`,
  },
]

export default infos
