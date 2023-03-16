import $ from 'licia/$'
import { DevTools } from '.'
import { ITool } from './Types'

export class Tool implements ITool {
  public name: string
  public devTools!: DevTools
  protected _$el!: $.$
  public active = false

  constructor(name: string) {
    this.name = name
  }

  public init($el: $.$, devTools: DevTools): void {
    this._$el = $el
    this.devTools = devTools
  }

  public show() {
    this._$el.show()
  }

  public hide() {
    this._$el.hide()
  }

  public destroy() {
    this._$el.remove()
  }
}
