import Emitter from 'licia/Emitter'
import extend from 'licia/extend'
import { IDisposable } from 'eruda'
import { IDevToolOptions } from './Types'
import DevToolsScss from './DevTools.scss'
import { evalCss } from '@/lib/evalCss'
import removeNode from '@/lib/removeNode'

export class DevTools extends Emitter implements IDisposable {
  private _defCfg: IDevToolOptions
  private _cssEl: HTMLElement

  constructor($container: HTMLElement, options: IDevToolOptions) {
    super()

    this._defCfg = extend({ theme: 'Light' }, options) as IDevToolOptions
    this._cssEl = evalCss(DevToolsScss)
  }

  dispose(): void {
    removeNode(this._cssEl)
  }
}
