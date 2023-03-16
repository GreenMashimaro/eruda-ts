import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import $ from 'licia/$'
import { classPrefix as c } from '@/lib/util'

import ConsoleScss from './Console.scss'

export class Console extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(ConsoleScss)

  constructor() {
    super('console')

    this._bindEvent()
  }

  public dispose(): void {
    destroyStyle(this._cssEl)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    this._appendTpl()
  }

  private _appendTpl() {
    this._$el.append(
      c(`
        <div class="control">
          control
        </div>
      `)
    )
  }

  private _bindEvent() {
    // TODO
  }
}
