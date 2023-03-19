import escape from 'licia/escape'
import $ from 'licia/$'
import contain from 'licia/contain'
import isEmpty from 'licia/isEmpty'
import unique from 'licia/unique'
import map from 'licia/map'
import { classPrefix as c } from '@/lib/util'
import { getState, isImg, setState } from './util'

export class ResourceImage {
  private _$container: $.$

  constructor($container: $.$) {
    this._$container = $container
  }

  public refresh(): void {
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
      imageDataHtml = map(nImageData, (_imageUrl) => {
        const imageUrl = escape(_imageUrl)
        return `
          <li class="${c('image')}">
            <img src="${imageUrl}" data-exclude="true" class="${c('img-link')}"/>
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

    const $container = this._$container
    setState($container, imageState)
    $container.html(imageHtml)
  }
}
