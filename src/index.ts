import test from './index.scss'
import { evalCss } from './lib/evalCss'

export function zzn1 (param1: string): string {
  evalCss(test)
  return `${param1}_hello222:`
}

export function zzn2 () {}
