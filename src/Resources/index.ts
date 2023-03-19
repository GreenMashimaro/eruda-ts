import { getState, isImg, setState } from './util'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'
import ResourcesScss from './Resources.scss'
import contain from 'licia/contain'
import unique from 'licia/unique'
import isEmpty from 'licia/isEmpty'
import map from 'licia/map'
import escape from 'licia/escape'
import { classPrefix as c } from '@/lib/util'
import { ResourceCookies } from './ResourceCookies'
import { ResourceImages } from './ResourceImages'
import { ResourceIframes } from './ResourceIframes'

export class Resources extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(ResourcesScss)

  private _resourceCookies!: ResourceCookies
  private _resourceImages!: ResourceImages
  private _resourceIframes!: ResourceIframes

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

    this._resourceCookies = new ResourceCookies(this._$cookie, devTools)
    this._resourceImages = new ResourceImages(this._$image)
    this._resourceIframes = new ResourceIframes(this._$iframe)

    this.refresh()
  }

  public refresh() {
    this._refreshCookie()
    this._refreshImage()
    this._refreshIframe()
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
    this._resourceCookies.refresh()
  }

  private _refreshImage() {
    const imageData: string[] = []
    const performance = window.performance

    if (performance && performance.getEntries) {
      const entries = performance.getEntries()
      entries.forEach((entry) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const initatorType = entry.initatorType
        const entryName = entry.name

        if (initatorType === 'img' || isImg(entryName)) {
          if (contain(entryName, 'exclude=true')) {
            return
          }

          imageData.push(entryName)
        }
      })
    } else {
      $('img').each(function (index: number, el: HTMLElement) {
        const $el = $(el)
        const src = $el.attr('src')

        if ($el.data('exclude') === 'true') {
          return
        }

        imageData.push(src)
      })
    }

    const nImageData = unique(imageData) as string[]

    const imageState = getState('image', nImageData.length)
    let imageDataHtml = '<li>Empty</li>'
    if (!isEmpty(nImageData)) {
      imageDataHtml = map(nImageData, (image) => {
        return `
          <li class="${c('image')}">
            <img src="${escape(image)}" data-exclude="true" class="${c('img-link')}"/>
          </li>`
      }).join('')
    }

    const imageHtml = `
      <h2 class="${c('title')}">
        Image
        <div class="${c('btn refresh-image')}">
          <span class="${c('icon-refresh')}"></span>
        </div>
      </h2>
      <ul class="${c('image-list')}">
        ${imageDataHtml}
      </ul>`

    const $image = this._$image
    setState($image, imageState)
    $image.html(imageHtml)
  }

  private _refreshIframe() {
    this._resourceIframes.refresh()
  }

  private _bindEvent() {
    // TOOD
  }
}
