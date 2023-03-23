export interface IData {
  type: 'html' | 'js' | 'css' | 'img' | 'object' | 'raw' | 'iframe'
  value: string | { [key: string]: string } | Array<{ [key: string]: string }> | IImgValue
}

export interface IImgValue {
  width: number
  height: number
  src: string
}
