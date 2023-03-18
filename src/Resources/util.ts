import { classPrefix as c } from '@/lib/util'
import $ from 'licia/$'

const regImg = /\.(jpeg|jpg|gif|png)$/

export const isImg = (url: string) => regImg.test(url)

export function getState(type: string, len: number) {
  if (len === 0) return ''

  let warn = 0
  let danger = 0

  switch (type) {
    case 'cookie':
      warn = 30
      danger = 60
      break
    case 'script':
      warn = 5
      danger = 10
      break
    case 'stylesheet':
      warn = 4
      danger = 8
      break
    case 'image':
      warn = 50
      danger = 100
      break
  }

  if (len >= danger) return 'danger'
  if (len >= warn) return 'warn'

  return 'ok'
}

export function setState($el: $.$, state: string) {
  $el.rmClass(c('ok')).rmClass(c('danger')).rmClass('warn').addClass(c(state))
}
