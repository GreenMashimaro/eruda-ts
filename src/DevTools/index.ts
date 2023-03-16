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

  constructor($container: $.$, options: IDevToolOptions) {
    super()

    this.$container = $container
    this._defCfg = extend({ theme: 'Light' }, options) as IDevToolOptions
    this._cssEl = evalCss(DevToolsScss)

    const { $el, $tools } = this._initTpl()
    this._$el = $el
    this._$tools = $tools
  }

  show() {
    // TODO
  }

  hide() {
    // TODO
  }

  togger() {
    // TODO
  }

  dispose(): void {
    deleteStyle(this._cssEl)
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

    const $el = $container.find(c('dev-tools'))

    return {
      $el,
      $tools: $el.find(c('.tools')),
    }
  }
}
