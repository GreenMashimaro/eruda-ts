import { INumberOptions } from 'luna-setting'
import LocalStore from 'licia/LocalStore'

export interface ISetting extends INumberOptions {
  config: LocalStore
  key: string
  id: string
  item: ReturnType<import('luna-setting').default['appendNumber']>
}
