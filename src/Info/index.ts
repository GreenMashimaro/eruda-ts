import $ from 'licia/$'
import isFn from 'licia/isFn'
import escape from 'licia/escape'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import InfoScss from './Info.scss'
import defInfos from './defInfos'
import { classPrefix as c } from '@/lib/util'

export class Info extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(InfoScss)

  constructor() {
    super('info')

    this._bindEvent()
  }

  public dispose(): void {
    destroyStyle(this._cssEl)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    this._render()
  }

  private _bindEvent() {
    // TOOD
  }

  private _render() {
    const allLiHtml = defInfos
      .map<string>((info) => {
        const value = isFn(info.val) ? info.val() : info.val

        return `
          <li>
            <h2 class="${c('title')}">${escape(info.name)}</h2>
            <div class="${c('content')}">${value}</div>
          </li>
        `
      })
      .join('')

    const ulHtml = `<ul>${allLiHtml}</ul>`

    this._$el.html(ulHtml)
  }
}
