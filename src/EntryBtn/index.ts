import Emitter from 'licia/Emitter'
import $ from 'licia/$'
import EntryBtnScss from './EntryBtn.scss'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import { classPrefix as c, drag, eventClient, pxToNum } from '@/lib/util'

const $document = $(document)

export class EntryBtn extends Emitter implements IDisposable {
  private _cssEl: HTMLElement = evalCss(EntryBtnScss)

  private _$container: $.$
  private _$el!: $.$
  private _isClick = false

  private _startX = 0
  private _startY = 0
  private _oldX = 0
  private _oldY = 0

  private _onDragStart = this.__onDragStart.bind(this)
  private _onDragMove = this.__onDragMove.bind(this)
  private _onDragEnd = this.__onDragEnd.bind(this)

  constructor($container: $.$) {
    super()

    this._$container = $container
    this._initTpl()
    this._bindEvent()
  }

  public dispose(): void {
    destroyStyle(this._cssEl)
    this._unregisterListener()
  }

  public show() {
    this._$el.show()
  }

  public hide() {
    this._$el.hide()
  }

  private _initTpl() {
    const $container = this._$container

    $container.append(c('<div class="entry-btn"><span class="icon-tool"></span></div>'))
    this._$el = $container.find('.eruda-entry-btn')
  }

  private _bindEvent() {
    const $el = this._$el

    $el.on(drag('start'), this._onDragStart)
  }

  private __onDragStart(e: { origEvent: DragEvent }) {
    const ev = e.origEvent

    const $el = this._$el
    $el.addClass(c('active'))

    this._isClick = true
    this._startX = eventClient('x', ev)
    this._startY = eventClient('y', ev)
    this._oldX = pxToNum($el.css('left'))
    this._oldY = pxToNum($el.css('top'))

    $document.on(drag('move'), this._onDragMove)
    $document.on(drag('end'), this._onDragEnd)
  }

  private __onDragMove(e: { origEvent: DragEvent }) {
    const ev = e.origEvent

    const el = this._$el.get(0) as HTMLElement
    const btnSize = el.offsetWidth

    const containerEl = this._$container.get(0) as HTMLElement
    const maxWidth = containerEl.offsetWidth
    const maxHeight = containerEl.offsetHeight

    const deltaX = eventClient('x', ev) - this._startX
    const deltaY = eventClient('y', ev) - this._startY

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      this._isClick = false
    }
    let newX = this._oldX + deltaX
    let newY = this._oldY + deltaY
    if (newX < 0) {
      newX = 0
    } else if (newX > maxWidth - btnSize) {
      newX = maxWidth - btnSize
    }
    if (newY < 0) {
      newY = 0
    } else if (newY > maxHeight - btnSize) {
      newY = maxHeight - btnSize
    }
    this._$el.css({ left: newX, top: newY })
  }

  private __onDragEnd(e: { origEvent: DragEvent }) {
    const $el = this._$el

    if (this._isClick) {
      this.emit('click')
    }

    this.__onDragMove(e)
    $document.off(drag('move'), this._onDragMove)
    $document.off(drag('end'), this._onDragEnd)

    $el.rmClass('eruda-active')
  }

  private _unregisterListener() {
    // TODO
  }
}
