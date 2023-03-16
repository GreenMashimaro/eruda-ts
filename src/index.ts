import { Eruda as ErudaApi, IErudaOptions } from 'eruda'
import extend from 'licia/extend'
import $ from 'licia/$'
import { DevTools } from '@/DevTools'
import { deleteStyle, evalCss } from './lib/evalCss'
import StyleScss from '@/style/style.scss'

export class Eruda implements ErudaApi {
  private _$el: $.$
  private _devTools: DevTools
  private _styleEl: HTMLElement | null = null

  constructor(options: IErudaOptions) {
    this._$el = $(options.container)

    this._initContainer(options.container)
    this._initStyle()

    const devTools = this._initDevTools()
    devTools.initCfg()
    this._devTools = devTools
  }

  public dispose(): void {
    this._devTools.dispose()
    deleteStyle(this._styleEl)
  }

  private _initContainer(container?: HTMLElement) {
    if (!container) {
      container = document.createElement('div')
      document.documentElement.appendChild(container)
    }

    container.id = 'eruda'
    container.style.all = 'initial'

    const el = document.createElement('div')
    container.appendChild(el)

    extend(el, {
      className: 'eruda-container __chobitsu-hide__',
      contentEditable: false,
    })

    this._$el = $(el)
  }

  private _initStyle() {
    const className = 'eruda-style-container'
    const $el = this._$el
    if (!$el) return

    $el.append(`<div class="${className}"></div>`)

    this._styleEl = evalCss(StyleScss)
  }

  private _initDevTools() {
    return new DevTools(this._$el, { theme: 'Light' })
  }
}
