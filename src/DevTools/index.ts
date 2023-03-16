import Emitter from 'licia/Emitter'
import extend from 'licia/extend'
import { IDisposable } from 'eruda'
import { IDevToolOptions } from './Types'
import DevToolsScss from './DevTools.scss'
import { deleteStyle, evalCss } from '@/lib/evalCss'
import { classPrefix as c } from '@/lib/util'
import $ from 'licia/$'

export class DevTools extends Emitter implements IDisposable {
  private $container: $.$
  private _defCfg: IDevToolOptions
  private _cssEl: HTMLElement
  private _$el: $.$
  private _$tools: $.$
  private _isShow = true // zzn

  constructor($container: $.$, options: IDevToolOptions) {
    super()

    this.$container = $container
    this._defCfg = extend({ theme: 'Light' }, options) as IDevToolOptions
    this._cssEl = evalCss(DevToolsScss)

    const { $el, $tools } = this._initTpl()
    this._$el = $el
    this._$tools = $tools
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

  private _setTransparency(opacity: number) {
    if (this._isShow) {
      this._$el.css({ opacity })
    }
  }

  private _setDisplaySize(height: number) {
    this._$el.css({ height: `${height}%` })
  }
}
