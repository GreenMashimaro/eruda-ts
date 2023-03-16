import $ from 'licia/$'

export class Tool {
  public name = ''
  private _$el!: $.$

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
