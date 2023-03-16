import Emitter from 'licia/Emitter'
import extend from 'licia/extend'
import { IDisposable } from 'eruda'
import { IDevToolOptions } from './Types'
import DevToolsScss from './DevTools.scss'
import { deleteStyle, evalCss } from '@/lib/evalCss'
import { classPrefix as c } from '@/lib/util'
import $ from 'licia/$'
import LunaTab from 'luna-tab'
import { Tool } from './Tool'

export class DevTools extends Emitter implements IDisposable {
  private $container: $.$
  private _defCfg: IDevToolOptions
  private _cssEl: HTMLElement
  private _$el: $.$
  private _$tools: $.$
  private _isShow = true // zzn
  private _tab!: LunaTab

  constructor($container: $.$, options: IDevToolOptions) {
    super()

    this.$container = $container
    this._defCfg = extend({ theme: 'Light' }, options) as IDevToolOptions
    this._cssEl = evalCss(DevToolsScss)

    const { $el, $tools } = this._initTpl()
    this._$el = $el
    this._$tools = $tools

    this._initTab()
  }

  public show() {
    this._$el.show()
    this._isShow = true
  }

  public showTool(name: string) {
    // TODO
  }

  public hide() {
    this._isShow = false
  }

  public togger() {
    // TODO
  }

  public add(tool: Tool) {
    const name = tool.name
    const tab = this._tab

    const $nameEl = this._$tools.find(`.${c(name)}.${c('tool')}`)
    tool.init($nameEl, this)

    if (name === 'settings') {
      tab.append({
        id: name,
        title: name,
      })
    } else {
      console.log('zzn log')
      tab.insert(tab.length - 1, {
        id: name,
        title: name,
      })
    }
  }

  public dispose(): void {
    deleteStyle(this._cssEl)
  }

  public initCfg() {
    this._setDisplaySize(50)
    this._setTransparency(0.9)
  }

  private _initTpl() {
    const $container = this.$container
    $container.append(
      c(`
        <div class="dev-tools">
          <div class="resize"></div>
          <div class="tab"></div>
          <div class="tools"></div>
          <div class="notification"></div>
          <div class="modal"></div>
        </div>
      `)
    )
    const $el = $container.find(c('.dev-tools'))

    return {
      $el,
      $tools: $el.find(c('.tools')),
    }
  }

  private _initTab() {
    const tabEl = this._$el.find(c('.tab')).get(0) as HTMLElement
    const lunaTab = new LunaTab(tabEl, {
      height: 40,
    })
    this._tab = lunaTab
    lunaTab.on('select', (id: string) => this.showTool(id))
  }

  private _setTransparency(opacity: number) {
    if (this._isShow) {
      this._$el.css({ opacity })
    }
  }

  private _setDisplaySize(height: number) {
    this._$el.css({ height: `${height}%` })
  }
}
