import $ from 'licia/$'

export default class Tools {
  private _$el: $.$ = $('<div />')

  public init($el: $.$) {
    this._$el = $el
  }

  public show() {
    this._$el.show()

    return this
  }

  public hide() {
    this._$el.hide()

    return this
  }

  public destroy() {
    this._$el.remove()
  }
}
