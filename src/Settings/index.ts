import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'
import LunaSetting from 'luna-setting'
import LocalStore from 'licia/LocalStore'
import { ISetting } from './Types'
import { IDisposable } from 'eruda'
import { deleteStyle, evalCss } from '@/lib/evalCss'
import SettingsScss from './Settings.scss'
import { DevTools } from '@/DevTools'

export class Settings extends Tool implements IDisposable {
  private _setting!: LunaSetting
  private _settings: ISetting[] = []
  private _cssEl: HTMLElement

  constructor() {
    super('settings')

    this._cssEl = evalCss(SettingsScss)
  }

  public dispose(): void {
    deleteStyle(this._cssEl)
  }

  public static createCfg(name: string, data: { [key: string]: string }): LocalStore {
    return new LocalStore(`eruda-${name}`, data)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    const el = $el.get(0) as HTMLElement
    this._setting = new LunaSetting(el)

    this._bindEvent()
  }

  private _getSetting(id: string) {
    return this._settings.find((set) => set.id === id)
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
