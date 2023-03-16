import { Theme } from '@/lib/Types'
import { DevTools } from '.'
import $ from 'licia/$'

export interface IDevToolOptions {
  theme: Theme
}

export interface ITool {
  init($el: $.$, devTools: DevTools): void
}
