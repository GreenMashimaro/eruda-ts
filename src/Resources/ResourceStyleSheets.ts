import isEmpty from 'licia/isEmpty'
import escape from 'licia/escape'
import $ from 'licia/$'
import unique from 'licia/unique'
import { classPrefix as c } from '@/lib/util'

export class ResourceStyleSheets {
  private _$containter: $.$

  constructor($container: $.$) {
    this._$containter = $container
  }

  public refresh(): void {
    const styleSheetData: string[] = []

    $('link').each(function (index: number, el: HTMLLinkElement) {
      if (el.rel !== 'stylesheet') {
        return
      }

      const href = $(el).attr('href')
      styleSheetData.push(href)
    })

    const nStyleSheetData = unique(styleSheetData)

    let stylesheelDataHtml = '<li>Empty</li>'
    if (!isEmpty(nStyleSheetData)) {
      stylesheelDataHtml = nStyleSheetData
        .map<string>((_linkHref) => {
          const linkHref = escape(_linkHref)
          return `
          <li>
            <a href="${linkHref}" target="_blank">${linkHref}</a>
          </li>
        `
        })
        .join('')
    }

    const stylesheelhtml = `
      <h2 class="${c('title')}">
        Stylesheet
        <div class="${c('btn refresh-stylesheet')}">
          <span class="${c('icon-refresh')}"></span>
        </div>
      </h2>
      <ul class="${c('link-list')}">
        ${stylesheelDataHtml}
      </ul>
    `

    this._$containter.html(stylesheelhtml)
  }
}
