import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'

export class Elements extends Tool {
  constructor() {
    super('elements')

    this._bindEvent()
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)
  }

  private _bindEvent() {
    // TOOD
  }
}
