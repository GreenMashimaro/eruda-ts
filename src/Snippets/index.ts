import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'

export class Snippets extends Tool {
  constructor() {
    super('snippets')

    this._bindEvent()
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)
  }

  private _bindEvent() {
    // TOOD
  }
}
