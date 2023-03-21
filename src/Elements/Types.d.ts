export interface IStrObj {
  [key: string]: string
}

export interface IMatchedCSSRule {
  selectorText: string
  style: IStrObj
}
