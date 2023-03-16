import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'
import { classPrefix as c } from '@/lib/util'

export class Network extends Tool {
  constructor() {
    super('network')

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
          Network
        </div>
      `)
    )
  }

  private _bindEvent() {
    // TOOD
  }
}
