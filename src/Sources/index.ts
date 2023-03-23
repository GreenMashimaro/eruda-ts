import SourcesScss from './Sources.scss'

import { destroyStyle, evalCss } from '@/lib/evalCss'
import highlight from 'licia/highlight'
import escape from 'licia/escape'
import isStr from 'licia/isStr'
import isObj from 'licia/isObj'
import truncate from 'licia/truncate'
import $ from 'licia/$'
import replaceAll from 'licia/replaceAll'
import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import { classPrefix as c } from '@/lib/util'
import { iframeData } from './testData'
import { IData, IImgValue } from './Types'
import LunaTextViewer from 'luna-text-viewer'
import LunaObjectViewer from 'luna-object-viewer'

const MAX_BEAUTIFY_LEN = 30000
const MAX_LINE_NUM_LEN = 80000
const MAX_RAW_LEN = 100000

export class Sources extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(SourcesScss)
  private _data!: IData

  constructor() {
    super('sources')
  }

  public dispose(): void {
    destroyStyle(this._cssEl)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    this.set(iframeData.type, iframeData.value)
    this._render()
    this._bindEvent()
  }

  public set(type: IData['type'], value: IData['value']) {
    this._data = { type, value }
  }

  private _bindEvent() {
    // TOOD
  }

  private _render(): void {
    const data = this._data

    switch (data.type) {
      case 'html':
      case 'js':
      case 'css':
        return this._renderCode()
      case 'img':
        return this._renderImg()
      case 'object':
        return this._renderObj()
      case 'raw':
        return this._renderRaw()
      case 'iframe':
        return this._renderIframe()
      default:
        return this._renderRaw()
    }
  }

  private _renderCode() {
    const data = this._data
    if (!isStr(data.value)) {
      return
    }

    const codeLen = data.value.length
    const code = this._highlightAndCls(data.type, data.value)

    this._renderHtml(`<div class="${c('code')}" data-type="${data.type}"></div>`)

    const codeEl = this._$el.find(c('.code')).get(0) as HTMLElement
    new LunaTextViewer(codeEl, {
      text: code,
      escape: false,
      wrapLongLines: true,
      showLineNumbers: codeLen < MAX_LINE_NUM_LEN,
    })
  }

  private _renderImg() {
    const data = this._data
    const value = data.value
    if (!this._checkImgData(value)) {
      return
    }

    const html = `
      <div class="${c('image')}">
        <div class="${c('breadcrumb')}">${escape(value.src)}</div>
        <div class="${c('img-container')}" data-exclude="true">
          <img src="${escape(value.src)}">
        </div>
        <div class="${c('img-info')}">${value.width} x ${value.height}</div>
      </div>
    `

    this._renderHtml(html)
  }

  private _renderObj() {
    const data = this._data
    if (!isObj(data.value)) {
      return
    }

    this._renderHtml(`<ul class="${c('json')}"></ul>`)

    const jsonEl = this._$el.find(c('.json')).get(0) as HTMLElement
    const objViewer = new LunaObjectViewer(jsonEl, {
      unenumerable: true,
      accessGetter: true,
    })

    objViewer.set(data.value)
  }

  private _renderRaw() {
    const data = this._data
    if (!isStr(data.value)) {
      return
    }

    this._renderHtml(`
      <div class="${c('raw-wrapper')}">
        <div class="${c('raw')}"></div>
      </div>
    `)

    const value = data.value
    const rawValue =
      value.length > MAX_RAW_LEN ? truncate(value, MAX_BEAUTIFY_LEN) : value

    const rawEl = this._$el.find(c('.raw')).get(0) as HTMLElement
    new LunaTextViewer(rawEl, {
      text: rawValue,
      wrapLongLines: true,
      showLineNumbers: rawValue.length < MAX_LINE_NUM_LEN,
    })
  }

  private _renderIframe() {
    const value = this._data.value
    if (!isStr(value)) {
      return
    }

    const html = `<iframe src="${escape(value)}"></iframe>`
    this._renderHtml(html)
  }

  private _highlightAndCls(type: string, value: string): string {
    // If source code too big, don't process it.
    if (value.length < MAX_BEAUTIFY_LEN) {
      let code = highlight(value, type, {
        comment: '',
        string: '',
        number: '',
        keyword: '',
        operator: '',
      })
      ;['comemnt', 'string', 'number', 'keyword', 'operator'].forEach((tp) => {
        code = replaceAll(code, `class="${tp}"`, `class="${c(tp)}"`)
      })
      return code
    }

    return escape(value)
  }

  private _renderHtml(html: string) {
    this._$el.html(html)

    setTimeout(() => {
      const el = this._$el.get(0) as HTMLElement
      el.scrollTop = 0
    }, 0)
  }

  private _checkImgData(value: IData['value']): value is IImgValue {
    if (typeof value === 'object') {
      return 'src' in value
    }
    return false
  }
}
