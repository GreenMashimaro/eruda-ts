import $ from 'licia/$'
import h from 'licia/h'
import escape from 'licia/escape'
import MutationObserver from 'licia/MutationObserver'
import map from 'licia/map'
import isEmpty from 'licia/isEmpty'
import LunaBoxModel from 'luna-box-model'
import { CssStore, getInlineStyle } from './CssStore'
import { IMatchedCSSRule, IStrObj } from './Types.d'

import { classPrefix as c } from '@/lib/util'

export class Detail {
  private _$container: $.$
  private _$elementName!: $.$
  private _$attributes!: $.$
  private _$styles!: $.$
  private _$computedStyle!: $.$
  private _$listeners!: $.$
  private _$boxModel!: $.$

  private _obserrver!: MutationObserver
  private _boxModel!: LunaBoxModel
  private _curEl: HTMLElement = document.documentElement

  constructor($containter: $.$) {
    this._$container = $containter

    this._initObserver()
    this._initTpl()
  }

  private _initObserver() {
    this._obserrver = new MutationObserver((mutations) => {
      console.log('zzn mutations:', mutations)
    })
  }

  private _initTpl() {
    const $container = this._$container
    const html = `
      <div class="${c('control')}">
        <span class="${c('icon-arrow-left back')}"></span>
        <span class="${c('element-name')}"></span>
        <span class="${c('icon-refresh refresh')}"></span>
      </div>
      <div class="${c('element')}">
        <div class="${c('attributes section')}"></div>
        <div class="${c('styles section')}"></div>
        <div class="${c('computed-style section')}"></div>
        <div class="${c('listeners section')}"></div>
      </div>
    `
    $container.html(html)

    this._$elementName = $container.find(c('.element-name'))
    this._$attributes = $container.find(c('.attributes'))
    this._$styles = $container.find(c('.styles'))
    this._$computedStyle = $container.find(c('.computed-style'))
    this._$listeners = $container.find(c('.listeners'))

    const boxModelContainer = h('div')
    this._$boxModel = $(boxModelContainer)
    this._boxModel = new LunaBoxModel(boxModelContainer)
  }

  public show(el: HTMLElement) {
    this._curEl = el
    this._$container.show()
    this._render()
  }

  private _render() {
    const data = this._getData(this._curEl)

    this._renderAttrbutes(data.attributes)
    this._renderStyles(data.cssRules)
    this._renderComputedStyle(data.computedStyle)
  }

  private _renderAttrbutes(attributes: NamedNodeMap) {
    let trsHtml = '<tr><td>Empty</td></tr>'
    // replace
    if (!isEmpty(attributes)) {
      trsHtml = map(attributes, ({ name, value }) => {
        return `
          <tr>
            <td class="${c('attribute-name-color')}">${escape(name)}</td>
            <td class="${c('string-color')}">${value}</td>
          </tr>
        `
      }).join('')
    }

    const attrHtml = `
      <h2>Attributes</h2>
      <div class="${c('table-wrapper')}">
        <table>${trsHtml}</table>
      </div>
    `

    this._$attributes.html(attrHtml)
  }

  private _renderStyles(cssRules: IMatchedCSSRule[]): void {
    if (isEmpty(cssRules)) {
      this._$styles.hide()
      return
    }

    const styleDivsHtml = map(cssRules, (cssRule) => {
      const styleDivHtml = map(cssRule.style, (key, value) => {
        return `
          <div class="${c('rule')}">
            <span>${escape(key)}</span>: ${value};
          </div>
        `
      }).join('')

      return `
        <div class="${c('style-rules')}">
          <div>${escape(cssRule.selectorText)} {</div>
          ${styleDivHtml}
          <div>}</div>
        </div>
      `
    }).join('')

    const allStyleHtml = `
      <h2>Styles</h2>
      <div class="${c('style-wrapper')}">${styleDivsHtml}</div>
    `

    this._$styles.html(allStyleHtml).show()
  }

  private _renderComputedStyle(computedStyle: IStrObj) {
    const computedStyleHtml = `
      <h2>
        Computed Style
        <div class="${c('btn toggle-all-computed-style')}">
          <span class="${c('icon-expand')}"></span>
        </div>
        <div class="${c('btn computed-style-search')}">
          <span class="${c('icon-filter')}"></span>
        </div>
      </h2>
      <div class="${c('box-model')}"></div>
      <div class="${c('table-wrapper')}">
        <table>
          <tbody>
            ${map(computedStyle, (value, key) => {
              return `
                <tr>
                  <td class="${c('key')}">${escape(key)}</td>
                  <td>${value}</td>
                </tr>
              `
            }).join('')}
          </tbody>
        </table>
      </div>
    `

    this._$computedStyle.html(computedStyleHtml).show()
    this._boxModel.setOption('element', this._curEl)

    const boxModelEl = this._$boxModel.get(0) as HTMLElement
    this._$computedStyle.find(c('.box-model')).append(boxModelEl)
  }

  private _getData(el: HTMLElement): {
    attributes: NamedNodeMap
    computedStyle: IStrObj
    cssRules: IMatchedCSSRule[]
  } {
    const cssStore = new CssStore(el)
    const attributes = el.attributes
    const computedStyle = cssStore.getComputedStyle()

    const matchCssRules = cssStore.getMatchedCSSRules()
    const inlineCssRule = getInlineStyle(el.style)
    const cssRules = [inlineCssRule, ...matchCssRules]

    return {
      attributes,
      computedStyle,
      cssRules,
    }
  }
}
