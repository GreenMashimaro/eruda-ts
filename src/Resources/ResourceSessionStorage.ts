import { DevTools } from '@/DevTools'
import $ from 'licia/$'
import { ResourceStorageBase } from './ResourceStorageBase'

export class ResourceSessionStorage extends ResourceStorageBase {
  constructor($container: $.$, devTools: DevTools) {
    super($container, devTools, window.sessionStorage, 'Session Storage')
  }
}
