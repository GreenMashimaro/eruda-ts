import $ from 'licia/$'
import unique from 'licia/unique'
import isEmpty from 'licia/isEmpty'
import escape from 'licia/escape'
import { classPrefix as c } from '@/lib/util'

export class ResourceIframes {
  private _$container: $.$

  constructor($container: $.$) {
    this._$container = $container

    this._bindEvent()
  }

  public refresh(): void {
    const iframeData: string[] = []

    $('iframe').each(function (index: number, el: HTMLElement) {
      const $iframeEl = $(el)
      const iframeSrc = $iframeEl.attr('src')

      iframeData.push(iframeSrc)
    })

    const nIframeData = unique(iframeData)
    let iframeDataHtml = '<li>Empty</li>'
    if (!isEmpty(nIframeData)) {
      iframeDataHtml = iframeData
        .map<string>((_iframeSrc) => {
          const iframeSrc = escape(_iframeSrc)
          const cls = c('iframe-link')
          return `
          <li>
            <a href="${iframeSrc}" target="_blank" class="${c(cls)}">${iframeSrc}</a>
          </li>
        `
        })
        .join('')
    }

    const iframeHtml = `
      <h2 class="${c('title')}">
        Iframe
        <div class="${c('btn refresh-iframe')}">
          <span class="${c('icon-refresh')}"></span>
        </div>
      </h2>
      <ul class="${c('link-list')}">
        ${iframeDataHtml}
      </ul>
    `

    this._$container.html(iframeHtml)
  }

  private _bindEvent() {
    this._$container.on('click', c('.refresh-iframe'), () => {
      this.refresh()
    })
  }
}
