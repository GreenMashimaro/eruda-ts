// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../typings/eruda.d.ts"/>

import { Eruda } from '../out/src/eruda'
import axios from 'axios'
import Cookie from 'licia/cookie'

const el = document.createElement('div')
document.body.appendChild(el)
new Eruda({
  container: el,
})

// trigger get request
console.log('[demo] trigger get request')
axios.get('test-get')
console.log('axios send get request')

// set cookie
console.log('[demo] set cookie')
Cookie.set('aa', 'avalue', { expires: 1 })
Cookie.set('bb', 'bvalue', { expires: 1 })
