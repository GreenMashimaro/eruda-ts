// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../typings/eruda.d.ts"/>

import { Eruda } from '../out/src/eruda'
import axios from 'axios'

const el = document.createElement('div')
document.body.appendChild(el)
new Eruda({
  container: el,
})

// trigger get request
axios.get('test-get')
console.log('axios send get request')
