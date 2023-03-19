import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'
import ResourcesScss from './Resources.scss'
import { classPrefix as c } from '@/lib/util'
import { ResourceCookie } from './ResourceCookie'
import { ResourceImage } from './ResourceImage'
import { ResourceIframe } from './ResourceIframe'
import { ResourceStyleSheet } from './ResourceStyleSheet'
import { ResourceLocalStorage } from './ResourceLocalStorage'

export class Resources extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(ResourcesScss)

  private _resourceCookie!: ResourceCookie
  private _resourceImage!: ResourceImage
  private _resourceIframe!: ResourceIframe
  private _resourceStyleSheet!: ResourceStyleSheet
  private _resourceLocalStorage!: ResourceLocalStorage

  private _$localStorage!: $.$
  private _$sessionStorage!: $.$
  private _$cookie!: $.$
  private _$script!: $.$
  private _$stylesheet!: $.$
  private _$iframe!: $.$
  private _$image!: $.$

  constructor() {
    super('resources')

    this._bindEvent()
  }

  public dispose(): void {
    destroyStyle(this._cssEl)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    this._initTpl()

    this._resourceCookie = new ResourceCookie(this._$cookie, devTools)
    this._resourceImage = new ResourceImage(this._$image)
    this._resourceIframe = new ResourceIframe(this._$iframe)
    this._resourceStyleSheet = new ResourceStyleSheet(this._$stylesheet)
    this._resourceLocalStorage = new ResourceLocalStorage(this._$localStorage, devTools)

    this.refresh()
  }

  public refresh() {
    this._refreshCookie()
    this._refreshImage()
    this._refreshIframe()
    this._refreshStyleSheet()
    this._refreshLocalStorage()
  }

  private _initTpl() {
    const $el = this._$el
    $el.html(
      c(`
        <div class="section local-storage"></div>
        <div class="section session-storage"></div>
        <div class="section cookie"></div>
        <div class="section script"></div>
        <div class="section stylesheet"></div>
        <div class="section iframe"></div>
        <div class="section image"></div>
      `)
    )

    this._$localStorage = $el.find(c('.local-storage'))
    this._$sessionStorage = $el.find(c('.session-storage'))
    this._$cookie = $el.find(c('.cookie'))
    this._$script = $el.find(c('.script'))
    this._$stylesheet = $el.find(c('.stylesheet'))
    this._$iframe = $el.find(c('.iframe'))
    this._$image = $el.find(c('.image'))
  }

  private _refreshCookie() {
    this._resourceCookie.refresh()
  }

  private _refreshImage() {
    this._resourceImage.refresh()
  }

  private _refreshIframe() {
    this._resourceIframe.refresh()
  }

  private _refreshStyleSheet() {
    this._resourceStyleSheet.refresh()
  }

  private _refreshLocalStorage() {
    this._resourceLocalStorage.refresh()
  }

  private _bindEvent() {
    // TOOD
  }
}
