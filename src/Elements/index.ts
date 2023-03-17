import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'
import LunaDomViewer from 'luna-dom-viewer'
import { classPrefix as c, isChobitsuEl, isErudaEl } from '@/lib/util'
import ElementsScss from './Elements.scss'

export class Elements extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(ElementsScss)
  private _domViewer!: LunaDomViewer
  private _$detail: $.$ | null = null
  private _$domViewer: $.$ | null = null
  private _$control: $.$ | null = null
  private _$crumbs: $.$ | null = null
  private _htmlEl: HTMLElement | null = document.documentElement

  private _selectElement = false

  constructor() {
    super('elements')

    this._bindEvent()
  }

  public dispose(): void {
    this._unBindEvent()
    destroyStyle(this._cssEl)

    this._domViewer.destroy()

    this._$detail = null
    this._$domViewer = null
    this._$control = null
    this._$crumbs = null
    this._htmlEl = null
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)
    if (!this._$domViewer) return
    if (!this._htmlEl) return

    this._initTpl()

    const domViewerEl = this._$domViewer.get(0) as HTMLElement
    this._domViewer = new LunaDomViewer(domViewerEl, {
      node: this._htmlEl,
      ignore: (node) => isErudaEl(node) || isChobitsuEl(node),
    })
  }

  private _initTpl() {
    const $el = this._$el

    $el.html(
      c(
        `<div class="elements">
          <div class="control">
            <span class="icon icon-select select"></span>
            <span class="icon icon-eye show-detail"></span>
            <span class="icon icon-copy copy-node"></span>
            <span class="icon icon-delete delete-node"></span>
          </div>
          <div class="dom-viewer-container">
            <div class="dom-viewer"></div>
          </div>
          <div class="crumbs"></div>
        </div>
        <div class="detail"></div>`
      )
    )

    this._$detail = $el.find(c('.detail'))
    this._$domViewer = $el.find(c('.dom-viewer'))
    this._$control = $el.find(c('.control'))
    this._$crumbs = $el.find(c('.crumbs'))
  }

  private _bindEvent() {
    if (!this._$control) return

    this._$control
      .on('click', c('.select'), this._toggleSelect)
      .on('click', c('.show-detail'), this._showDetail)
      .on('click', c('.copy-node'), this._copyNode)
      .on('click', c('.delete-node'), this._deleteNode)
  }

  private _unBindEvent() {
    if (!this._$control) return

    this._$control
      .off('click', c('.select'), this._toggleSelect)
      .off('click', c('.show-detail'), this._showDetail)
      .off('click', c('.copy-node'), this._copyNode)
      .off('click', c('.delete-node'), this._deleteNode)
  }

  private _toggleSelect() {
    this._$el.find(c('.select')).toggleClass(c('active'))
    this._selectElement = !this._selectElement
  }

  private _showDetail() {
    // TODO
  }

  private _copyNode() {
    // TODO
  }

  private _deleteNode() {
    // TODO
  }
}
