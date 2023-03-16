import toNum from 'licia/toNum'
import escape from 'licia/escape'
import $ from 'licia/$'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDefSnippet } from './Types.d'
import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import defSnippets from './defSnippets'
import { classPrefix as c } from '@/lib/util'
import SnippetsScss from './Snippets.scss'

export class Snippets extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(SnippetsScss)
  private _snippets: IDefSnippet[] = []

  constructor() {
    super('snippets')
  }

  public dispose(): void {
    destroyStyle(this._cssEl)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)
    this._addDefSnippets()
    this._bindEvent()
  }

  private _bindEvent() {
    this._$el.on('click', '.eruda-run', (ev: { curTarget: HTMLElement }) => {
      const targetEl = ev.curTarget
      const idx = $(targetEl).data('idx')
      this._run(toNum(idx))
    })
  }

  private _add(defSnippet: IDefSnippet) {
    this._snippets.push(defSnippet)

    this._render()
  }

  private _addDefSnippets() {
    defSnippets.forEach((defSnippet) => {
      this._add(defSnippet)
    })
  }

  private _render() {
    const html = this._snippets
      .map((snippet, idx) => {
        return `
          <div class="${c('section run')}" data-idx="${idx}">
            <h2 class="${c('name')}">${escape(snippet.name)}
              <div class="${c('btn')}">
                <span class="${c('icon-play')}"></span>
              </div>
            </h2>
            <div class="${c('description')}">
              ${escape(snippet.desc)}
            </div>
          </div>`
      })
      .join('')

    this._renderHtml(html)
  }

  private _renderHtml(html: string) {
    this._$el.html(html)
  }

  private _run(idx: number) {
    this._snippets[idx].fn()
  }
}
