import sortKeys from 'licia/sortKeys'
import each from 'licia/each'
import { IMatchedCSSRule, IStrObj } from './Types'

export class CssStore {
  private _el: HTMLElement

  constructor(el: HTMLElement) {
    this._el = el
  }

  public getComputedStyle(): IStrObj {
    const computedStyle = window.getComputedStyle(this._el)

    return formatStyle(computedStyle)
  }

  public getMatchedCSSRules() {
    const ret: IMatchedCSSRule[] = []

    each(document.styleSheets, (styleSheet) => {
      try {
        // Started with version 64, Chrome does not allow cross origin script to access this property.
        if (!styleSheet.cssRules) return
      } catch (e) {
        return
      }

      each(styleSheet.cssRules, (_cssRule) => {
        const cssRule = _cssRule as CSSStyleRule

        if (cssRule.style) {
          ret.push({
            selectorText: cssRule.selectorText,
            style: formatStyle(cssRule.style),
          })
        }
      })
    })

    return ret
  }
}

function formatStyle(style: CSSStyleDeclaration): IStrObj {
  const ret: IStrObj = {}

  for (let i = 0, len = style.length; i < len; i++) {
    const name = style[i] as keyof CSSStyleDeclaration
    const styleVal = style[name]

    if (styleVal === 'initial') continue

    ret[name] = styleVal as string
  }

  return sortStyleKeys(ret)
}

function sortStyleKeys(style: IStrObj): IStrObj {
  return sortKeys(style, {
    comparator: (a: string, b: string) => {
      const lenA = a.length
      const lenB = b.length
      const len = lenA > lenB ? lenB : lenA

      for (let i = 0; i < len; i++) {
        const codeA = a.charCodeAt(i)
        const codeB = b.charCodeAt(i)
        const cmpResult = cmpCode(codeA, codeB)

        if (cmpResult !== 0) {
          return cmpResult
        }
      }
      if (lenA > lenB) {
        return 1
      }
      if (lenA < lenB) {
        return -1
      }
      return 0
    },
  }) as IStrObj
}

function cmpCode(a: number, b: number): number {
  a = transCode(a)
  b = transCode(b)

  if (a > b) {
    return 1
  }
  if (a < b) {
    return -1
  }
  return 0
}

function transCode(code: number) {
  // - should be placed after lowercase chars.
  if (code === 45) return 123
  return code
}

export function getInlineStyle(style: CSSStyleDeclaration): IMatchedCSSRule {
  const ret: IMatchedCSSRule = {
    selectorText: 'element.style',
    style: {},
  }

  for (let i = 0; i < style.length; i++) {
    const styleKey = style[i] as keyof CSSStyleDeclaration
    ret.style[styleKey] = style[styleKey] as string
  }

  return ret
}
