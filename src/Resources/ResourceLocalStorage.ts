import { DevTools } from '@/DevTools'
import $ from 'licia/$'
import each from 'licia/each'
import isNull from 'licia/isNull'
import copy from 'licia/copy'
import LunaDataGrid from 'luna-data-grid'
import { classPrefix as c } from '@/lib/util'
import LunaModal from 'luna-modal'

export class ResourceLocalStorage {
  private _devTools: DevTools
  private _dataGrid!: LunaDataGrid
  private _selectLocalStorageKey: string | null = null
  private _storeData: { key: string; value: string }[] = []

  private _$container: $.$
  private _$dataGrid!: $.$
  private _$filterText!: $.$
  private _$showDetail!: $.$
  private _$deleteStorage!: $.$
  private _$copyStorage!: $.$

  private __triggerEventRefreshStorage = this._triggerEventRefreshStorage.bind(this)
  private __triggerEventClearStorage = this._triggerEventClearStorage.bind(this)
  private __triggerEventShowDetail = this._triggerEventShowDetail.bind(this)
  private __triggerEventCopyStorage = this._triggerEventCopyStorage.bind(this)
  private __triggerEventFilter = this._triggerEventFilter.bind(this)
  private __triggerEventDeleteStorage = this._triggerEventDeleteStorage.bind(this)

  private __triggerEventDataGridSelect = this._triggerEventDataGridSelect.bind(this)
  private __triggerEventDataGridDeselect = this._triggerEventDataGridDeselect.bind(this)

  constructor($container: $.$, devTools: DevTools) {
    this._$container = $container
    this._devTools = devTools

    this._initTpl()
    this._initDataGrid()

    this._bindEvent()
  }

  public refresh(): void {
    this._dataGrid.clear()

    this._cleanStoreData()
    this._storeData.forEach((item) => {
      this._dataGrid.append(
        {
          key: item.key,
          value: item.value,
        },
        {
          selectable: true,
        }
      )
    })
  }

  private _initTpl() {
    const $container = this._$container

    $container.html(
      c(`
        <h2 class="title">
          Local Storage
          <div class="btn refresh-storage">
            <span class="icon icon-refresh"></span>
          </div>
          <div class="btn show-detail btn-disabled">
            <span class="icon icon-eye"></span>
          </div>
          <div class="btn copy-storage btn-disabled">
            <span class="icon icon-copy"></span>
          </div>
          <div class="btn delete-storage btn-disabled">
            <span class="icon icon-delete"></span>
          </div>
          <div class="btn clear-storage">
            <span class="icon icon-clear"></span>
          </div>
          <div class="btn filter">
            <span class="icon icon-filter"></span>
          </div>
          <div class="btn filter-text"></div>
        </h2>
        <div class="data-grid"></div>
      `)
    )

    this._$dataGrid = $container.find(c('.data-grid'))
    this._$filterText = $container.find(c('.filter-text'))
    this._$showDetail = $container.find(c('.show-detail'))
    this._$deleteStorage = $container.find(c('.delete-storage'))
    this._$copyStorage = $container.find(c('.copy-storage'))
  }

  private _initDataGrid() {
    const dataGridEl = this._$dataGrid.get(0) as HTMLElement
    this._dataGrid = new LunaDataGrid(dataGridEl, {
      columns: [
        { id: 'key', title: 'Key', weight: 30 },
        { id: 'value', title: 'Value', weight: 90 },
      ],
      minHeight: 60,
      maxHeight: 223,
    })
  }

  private _bindEvent() {
    this._bindEventContainer()
    this._bindEventDataGrid()
  }

  private _bindEventContainer() {
    this._$container
      .on('click', c('.refresh-storage'), this.__triggerEventRefreshStorage)
      .on('click', c('.clear-storage'), this.__triggerEventClearStorage)
      .on('click', c('.show-detail'), this.__triggerEventShowDetail)
      .on('click', c('.copy-storage'), this.__triggerEventCopyStorage)
      .on('click', c('.filter'), this.__triggerEventFilter)
      .on('click', c('.delete-storage'), this.__triggerEventDeleteStorage)
  }

  private _bindEventDataGrid() {
    this._dataGrid
      .on('select', this.__triggerEventDataGridSelect)
      .on('deselect', this.__triggerEventDataGridDeselect)
  }

  private _triggerEventRefreshStorage() {
    this.refresh()
    this._devTools.notice('Refreshed')
  }

  private _triggerEventClearStorage() {
    this.cleanStoreData()
    this.refresh()

    this._devTools.notice('Clear success')
  }

  private _triggerEventShowDetail() {
    // TODO
  }

  private _triggerEventCopyStorage() {
    const selectLocalStorageKey = this._selectLocalStorageKey
    if (selectLocalStorageKey === null) {
      return
    }

    const value = localStorage.getItem(selectLocalStorageKey) || ''
    copy(value)
    this._devTools.notice('Copied')
  }

  private _triggerEventFilter() {
    LunaModal.prompt('Filter').then((_filterValue) => {
      if (isNull(_filterValue)) {
        return
      }

      const filterValue = _filterValue.trim()
      this._$filterText.text(filterValue)
      this._dataGrid.setOption('filter', filterValue)
    })
  }

  private _triggerEventDeleteStorage() {
    const selectLocalStorageKey = this._selectLocalStorageKey
    if (selectLocalStorageKey === null) {
      return
    }

    this._deleteStoreDataByKey(selectLocalStorageKey)
    this.refresh()
  }

  private _triggerEventDataGridSelect(node: { data: { key: string } }) {
    this._selectLocalStorageKey = node.data.key
    this._updateButtons()
  }

  private _triggerEventDataGridDeselect() {
    this._selectLocalStorageKey = null
    this._updateButtons()
  }

  private _updateButtons() {
    const $showDetail = this._$showDetail
    const $deleteStorage = this._$deleteStorage
    const $copyStorage = this._$copyStorage

    const btnDisabledCls = c('btn-disabled')

    if (this._selectLocalStorageKey === null) {
      $showDetail.addClass(btnDisabledCls)
      $deleteStorage.addClass(btnDisabledCls)
      $copyStorage.addClass(btnDisabledCls)
    } else {
      $showDetail.rmClass(btnDisabledCls)
      $deleteStorage.rmClass(btnDisabledCls)
      $copyStorage.rmClass(btnDisabledCls)
    }
  }

  private _deleteStoreDataByKey(key: string) {
    const index = this._storeData.findIndex((store) => store.key === key)
    if (index >= 0) {
      localStorage.removeItem(key)
      this._storeData.splice(index, 1)
    }
  }

  private _cleanStoreData() {
    const stores = { ...localStorage }
    const storeData: { key: string; value: string }[] = []
    each(stores, (value: string, key: string) => {
      storeData.push({ key, value })
    })
    this._storeData = storeData
  }

  private cleanStoreData() {
    this._storeData.forEach(({ key }) => {
      localStorage.removeItem(key)
    })
    this._storeData = []
  }
}
