import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'

export class Resources extends Tool implements IDisposable {
  constructor() {
    super('resources')

    this._bindEvent()
  }

  public dispose(): void {
    throw new Error('Method not implemented.')
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)
  }

  private _bindEvent() {
    // TOOD
  }
}
