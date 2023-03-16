import $ from 'licia/$'

export default class Tools {
  private _$el: $.$ = $('<div />')

  init($el: $.$) {
    this._$el = $el
  }

  show() {
    this._$el.show()

    return this
  }

  hide() {
    this._$el.hide()

    return this
  }

  destroy() {
    this._$el.remove()
  }
}
