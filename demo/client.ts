// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../typings/eruda.d.ts"/>

import { Eruda } from '../out/src/index'

const el = document.createElement('div')
document.body.appendChild(el)
new Eruda({
  container: el,
})
