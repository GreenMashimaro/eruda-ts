import LocalStore from 'licia/LocalStore'

export interface ISetting {
  config: LocalStore
  key: string
  id: string
  item: string
}
