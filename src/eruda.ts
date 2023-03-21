import { Eruda as ErudaApi, IErudaOptions } from 'eruda'
import extend from 'licia/extend'
import $ from 'licia/$'
import { DevTools } from '@/DevTools'
import { destroyStyle, evalCss } from './lib/evalCss'
import { emitter, EmitterEvent } from '@/lib/emitter'

import ResetScss from '@/style/reset.scss'
import IconCss from '@/style/icon.css'
import LunaTabCss from 'luna-tab/luna-tab.css'
import LunaSettingCss from 'luna-setting/luna-setting.css'
import lunaDomViewerCss from 'luna-dom-viewer/luna-dom-viewer.css'
import lunaDataGridCss from 'luna-data-grid/luna-data-grid.css'
import lunaModalCss from 'luna-modal/luna-modal.css'
import lunaNotificationCss from 'luna-notification/luna-notification.css'
import lunaConsoleCss from 'luna-console/luna-console.css'
import lunaBoxModelCss from 'luna-box-model/luna-box-model.css'
import StyleScss from '@/style/style.scss'

import { Settings } from '@/Settings'
import { Console } from '@/Console'
import { Elements } from '@/Elements'
import { Network } from '@/Network'
import { Resources } from '@/Resources'
import { Sources } from '@/Sources'
import { Info } from '@/Info'
import { Snippets } from '@/Snippets'
import { EntryBtn } from './EntryBtn'

export class Eruda implements ErudaApi {
  private _$el: $.$
  private _devTools: DevTools
  private _styleEl: HTMLElement | null = null
  private _showListener!: (name: string) => void
  private _settings = new Settings()

  constructor(options: IErudaOptions) {
    this._$el = $(options.container)

    this._registerListener()

    const tools = this._initAllTools(this._settings)

    this._initContainer(options.container)
    this._initStyle()
    const devTools = this._initDevTools(this._settings)
    tools.forEach((tool) => {
      devTools.add(tool)
    })
    this._devTools = devTools

    devTools.showTool('console')

    this._initEntryBtn()

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
    destroyStyle(this._styleEl)

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

    const styles = [
      ResetScss,
      IconCss,
      LunaTabCss,
      LunaSettingCss,
      lunaDomViewerCss,
      lunaDataGridCss,
      lunaModalCss,
      lunaNotificationCss,
      lunaConsoleCss,
      lunaBoxModelCss,
      StyleScss,
    ]
    this._styleEl = evalCss(styles.join(' '))
  }

  private _initEntryBtn() {
    const entryBtn = new EntryBtn(this._$el)
    entryBtn.on('click', () => this._devTools.toggle())
    entryBtn.initCfg(this._settings)
  }

  private _initDevTools(settings: Settings) {
    const devTools = new DevTools(this._$el, { theme: 'Light' })
    devTools.initCfg(settings)
    return devTools
  }

  private _initAllTools(settings: Settings) {
    return [
      settings,

      new Console(),
      new Elements(),
      new Network(),
      new Resources(),
      new Sources(),
      new Info(),
      new Snippets(),
    ]
  }
}
