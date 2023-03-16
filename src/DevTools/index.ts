import Emitter from 'licia/Emitter'
import extend from 'licia/extend'
import each from 'licia/each'
import { IDisposable } from 'eruda'
import { IDevToolOptions } from './Types'
import DevToolsScss from './DevTools.scss'
import { deleteStyle, evalCss } from '@/lib/evalCss'
import { classPrefix as c } from '@/lib/util'
import $ from 'licia/$'
import LunaTab from 'luna-tab'
import { Tool } from './Tool'
import logger from '@/lib/logger'

export class DevTools extends Emitter implements IDisposable {
  private $container: $.$
  private _defCfg: IDevToolOptions
  private _cssEl: HTMLElement = evalCss(DevToolsScss)
  private _$el: $.$
  private _$tools: $.$
  private _isShow = true // zzn
  private _tab!: LunaTab
  private _curToolName = ''
  private _tools: { [key: string]: Tool } = {}

  constructor($container: $.$, options: IDevToolOptions) {
    super()

    this.$container = $container
    this._defCfg = extend({ theme: 'Light' }, options) as IDevToolOptions

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
    if (this._curToolName === name) {
      return
    }

    const tools = this._tools
    const tool = tools[name]
    if (!tool) {
      return
    }

    let lastTool: Tool | null = null
    console.log('zzn tools:', tools)

    each(tools, (toolItem) => {
      if (toolItem.active) {
        lastTool = toolItem
        toolItem.active = false
        toolItem.hide()
      }
    })
    tool.active = true
    tool.show()

    this.emit('showTool', name, lastTool)
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

    if (this._tools[name]) {
      logger.warn(`Tool ${name} already exists`)
      return
    }

    this._tools[name] = tool
    this._$tools.prepend(`<div id="${c(name)}" class="${c(name + ' tool')}"></div>`)

    const $nameEl = this._$tools.find(`.${c(name)}.${c('tool')}`)
    tool.init($nameEl, this)

    if (name === 'settings') {
      tab.append({
        id: name,
        title: name,
      })
    } else {
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
