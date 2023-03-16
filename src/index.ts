import { Eruda as ErudaApi, IErudaOptions } from 'eruda'
import extend from 'licia/extend'
import $ from 'licia/$'

export class Eruda implements ErudaApi {
  private _$el: $.$ | null = null

  init(options: IErudaOptions) {
    this._initContainer(options.container)
    this._initStyle()
  }

  _initContainer(container?: HTMLElement) {
    if (!container) {
      container = document.createElement('div')
      document.documentElement.appendChild(container)
    }

    container.id = 'eruda'
    container.style.all = 'initial'

    const el = document.createElement('div')
    container.appendChild(el)

    extend(el, {
      className: 'eruda-container __chobitsu-hide__',
      contentEditable: false,
    })

    this._$el = $(el)
  }

  _initStyle() {
    const className = 'eruda-style-container'
    const $el = this._$el
    if (!$el) return

    $el.append(`<div class="${className}"></div>`)
  }
}
