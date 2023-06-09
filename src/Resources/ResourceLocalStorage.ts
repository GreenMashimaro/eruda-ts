import { DevTools } from '@/DevTools'
import $ from 'licia/$'
import { ResourceStorageBase } from './ResourceStorageBase'

export class ResourceLocalStorage extends ResourceStorageBase {
  constructor($container: $.$, devTools: DevTools) {
    super($container, devTools, window.localStorage, 'Local Storage')
  }
}
