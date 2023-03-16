import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'
import { classPrefix as c } from '@/lib/util'

export class Elements extends Tool {
  constructor() {
    super('elements')

    this._bindEvent()
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    this._appendTpl()
  }

  private _appendTpl() {
    this._$el.append(
      c(`
        <div class="control">
          Elements
        </div>
      `)
    )
  }

  private _bindEvent() {
    // TOOD
  }
}
