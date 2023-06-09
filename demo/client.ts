// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../typings/eruda.d.ts"/>

import { Eruda } from '../out/src/eruda'
import axios from 'axios'
import Cookie from 'licia/cookie'

// trigger get request
console.log('[demo] trigger get request')
axios.get('test-get')

// trigger post request
axios.post('test-post')

// set cookie
console.log('[demo] set cookie')
Cookie.set('aa', 'avalue', { expires: 1 })
Cookie.set('bb', 'bvalue', { expires: 1 })

// set localStorage
console.log('[demo] set localStorage')
localStorage.setItem('als', 'alsvalue')
localStorage.setItem('bls', 'blsvalue')

const el = document.createElement('div')
document.body.appendChild(el)
new Eruda({
  container: el,
})

// trigger console.log
console.log('[demo] log')
console.info('[demo] info')
console.warn('[demo] warn')
console.error('[demo] error')
