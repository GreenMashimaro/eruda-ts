import { Eruda as ErudaApi, IErudaOptions } from 'eruda'
import extend from 'licia/extend'
import $ from 'licia/$'
import { DevTools } from '@/DevTools'
import { deleteStyle, evalCss } from './lib/evalCss'
import { emitter, EmitterEvent } from '@/lib/emitter'

import StyleScss from '@/style/style.scss'
import LunaTabCss from 'luna-tab/luna-tab.css'

import { Settings } from '@/Settings'
import { Console } from '@/Console'
import { Elements } from '@/Elements'
import { Network } from '@/Network'
import { Resources } from '@/Resources'
import { Sources } from '@/Sources'
import { Info } from '@/Info'
import { Snippets } from '@/Snippets'

console.log('zzn LunaTabC:', LunaTabCss)

export class Eruda implements ErudaApi {
  private _$el: $.$
  private _devTools: DevTools
  private _styleEl: HTMLElement | null = null
  private _showListener!: (name: string) => void

  constructor(options: IErudaOptions) {
    this._$el = $(options.container)

    this._registerListener()

    this._initContainer(options.container)
    this._initStyle()

    const devTools = this._initDevTools()
    devTools.initCfg()
    this._devTools = devTools

    this._initAllTools()

    emitter.emit(EmitterEvent.SHOW)
  }

  public show(name: string) {
    if (name) {
      this._devTools.showTool(name)
    } else {
      this._devTools.show()
    }
  }

  public dispose(): void {
    this._devTools.dispose()
    deleteStyle(this._styleEl)

    this._unregisterListener()
  }

  private _registerListener() {
    this._showListener = (name: string) => this.show(name)

    emitter.on(EmitterEvent.SHOW, this._showListener)
  }

  private _unregisterListener() {
    emitter.off(EmitterEvent.SHOW, this._showListener)
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

    const styles = [LunaTabCss, StyleScss]
    this._styleEl = evalCss(styles.join(' '))
  }

  private _initDevTools() {
    return new DevTools(this._$el, { theme: 'Light' })
  }

  private _initAllTools() {
    const tools = [
      new Settings(),

      new Console(),
      new Elements(),
      new Network(),
      new Resources(),
      new Sources(),
      new Info(),
      new Snippets(),
    ]

    tools.forEach((tool) => {
      this._devTools.add(tool)
    })
  }
}
