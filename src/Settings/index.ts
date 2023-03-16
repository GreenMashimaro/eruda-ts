import $ from 'licia/$'
import uniqId from 'licia/uniqId'
import LocalStore from 'licia/LocalStore'

import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import LunaSetting from 'luna-setting'
import { ISetting } from './Types'
import { IDisposable } from 'eruda'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import SettingsScss from './Settings.scss'

export class Settings extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(SettingsScss)

  private _setting!: LunaSetting
  private _settings: ISetting[] = []

  constructor() {
    super('settings')
  }

  public dispose(): void {
    this._setting.destroy()
    destroyStyle(this._cssEl)
  }

  public static createCfg(name: string, data?: object): LocalStore {
    return new LocalStore(`eruda-${name}`, data)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    const el = $el.get(0) as HTMLElement
    this._setting = new LunaSetting(el)

    this._bindEvent()
  }

  public clear() {
    this._settings = []
    this._setting.clear()
  }

  public range(
    config: LocalStore,
    key: string,
    desc: string,
    { min = 0, max = 1, step = 0.1 }
  ) {
    const id = this._genId()

    const item = this._setting.appendNumber(id, config.get(key), desc, {
      max,
      min,
      step,
      range: true,
    })
    this._settings.push({ config, key, min, max, step, id, item })

    return this
  }
  public button(text: string, handler: () => void) {
    this._setting.appendButton(text, handler)

    return this
  }

  public switch(config: LocalStore, key: string, desc: string) {
    const id = this._genId()

    const item = this._setting.appendCheckbox(id, !!config.get(key), desc)
    this._settings.push({ config, key, id, item })
  }

  public separator() {
    this._setting.appendSeparator()
  }

  public text(text: string) {
    this._setting.appendTitle(text)
  }

  private _getSetting(id: string) {
    return this._settings.find((set) => set.id === id)
  }

  private _genId() {
    return uniqId('eruda-settings')
  }

  private _bindEvent() {
    this._setting.on('change', (id, val) => {
      const setting = this._getSetting(id)
      if (setting) {
        setting.config.set(setting.key, val)
      }
    })
  }
}
