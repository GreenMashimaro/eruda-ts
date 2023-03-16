import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'

export class Sources extends Tool {
  constructor() {
    super('sources')

    this._bindEvent()
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)
  }

  private _bindEvent() {
    // TOOD
  }
}
