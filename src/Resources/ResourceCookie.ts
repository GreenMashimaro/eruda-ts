import $ from 'licia/$'
import copy from 'licia/copy'
import { DevTools } from '@/DevTools'
import { classPrefix as c } from '@/lib/util'
import { getState, setState } from './util'
import LunaDataGrid from 'luna-data-grid'
import chobitsu from '@/lib/chobitsu'
import { IResCookie } from './Types'

export class ResourceCookie {
  private _$container: $.$
  private _devTools: DevTools
  private _dataGrid!: LunaDataGrid
  private _selectCookieKey: string | null = null

  private _$dataGrid!: $.$
  private _$filterText!: $.$
  private _$showDetail!: $.$
  private _$deleteCookie!: $.$
  private _$copyCookie!: $.$

  private __triggerEventRefreshCookie = this._triggerEventRefreshCookie.bind(this)
  private __triggerEventClearCookie = this._triggerEventClearCookie.bind(this)
  private __triggerEventDeleteCookie = this._triggerEventDeleteCookie.bind(this)
  private __triigerEventShowDetail = this._triigerEventShowDetail.bind(this)
  private __triggerEventCopyCookie = this._triggerEventCopyCookie.bind(this)
  private __triggerEventFilter = this._triggerEventFilter.bind(this)

  constructor($container: $.$, devTools: DevTools) {
    this._$container = $container
    this._devTools = devTools

    this._initTpl()
    this._initDataGrid()

    this.refresh()

    this._bindEvent()
  }

  public refresh(): void {
    const $container = this._$container
    const dataGrid = this._dataGrid

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { cookies }: { cookies: IResCookie[] } = chobitsu
      .domain('Network')!
      .getCookies()

    const cookieData = cookies.map<{ key: string; value: string }>((item) => {
      return { key: item.name, value: item.value }
    })

    dataGrid.clear()

    cookieData.forEach(({ key, value }) => {
      dataGrid.append({ key, value }, { selectable: true })
    })

    const cookieState = getState('cookie', cookieData.length)
    setState($container, cookieState)
  }

  private _initTpl() {
    const $container = this._$container

    $container.html(
      c(`
        <h2 class="title">
          Cookie
          <div class="btn refresh-cookie">
            <span class="icon-refresh"></span>
          </div>
          <div class="btn show-detail btn-disabled">
            <span class="icon icon-eye"></span>
          </div>
          <div class="btn copy-cookie btn-disabled">
            <span class="icon icon-copy"></span>
          </div>
          <div class="btn delete-cookie btn-disabled">
            <span class="icon icon-delete"></span>
          </div>
          <div class="btn clear-cookie">
            <span class="icon-clear"></span>
          </div>
          <div class="btn filter" data-type="cookie">
            <span class="icon-filter"></span>
          </div>
          <div class="btn filter-text"></div>
        </h2>
        <div class="data-grid"></div>
      `)
    )

    this._$dataGrid = $container.find(c('.data-grid'))
    this._$filterText = $container.find(c('.filter-text'))
    this._$showDetail = $container.find(c('.show-detail'))
    this._$deleteCookie = $container.find(c('.delete-cookie'))
    this._$copyCookie = $container.find(c('.copy-cookie'))
  }

  private _initDataGrid() {
    const el = this._$dataGrid.get(0) as HTMLElement
    this._dataGrid = new LunaDataGrid(el, {
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
      .on('click', c('.refresh-cookie'), this.__triggerEventRefreshCookie)
      .on('click', c('.clear-cookie'), this.__triggerEventClearCookie)
      .on('click', c('.delete-cookie'), this.__triggerEventDeleteCookie)
      .on('click', c('.show-detail'), this.__triigerEventShowDetail)
      .on('click', c('.copy-cookie'), this.__triggerEventCopyCookie)
      .on('click', c('.filter'), this.__triggerEventFilter)
  }

  private _bindEventDataGrid() {
    this._dataGrid
      .on('select', (node: { data: { key: string } }) => {
        this._selectCookieKey = node.data.key
        this._updateButtons()
      })
      .on('deselect', () => {
        this._selectCookieKey = null
        this._updateButtons()
      })
  }

  private _triggerEventRefreshCookie() {
    this._devTools.notice('Refreshed')
    this.refresh()
  }

  private _triggerEventClearCookie() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    chobitsu.domain('Storage')!.clearDataForOrigin({
      storageTypes: 'cookies',
    })
    this.refresh()
  }

  private _triggerEventDeleteCookie() {
    // TODO
  }

  private _triigerEventShowDetail() {
    // TODO
  }

  private _triggerEventCopyCookie() {
    const cookieKey = this._selectCookieKey

    if (!cookieKey) return

    const cookieVal = this._getVal(cookieKey)
    copy(cookieVal)

    this._devTools.notice('Copied')
  }

  private _triggerEventFilter() {
    // TODO
  }

  private _getVal(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { cookies }: { cookies: IResCookie[] } = chobitsu
      .domain('Network')!
      .getCookies()

    const cookie = cookies.find((item) => item.name === key)
    if (!cookie) {
      return ''
    }

    return cookie.value
  }

  private _updateButtons() {
    const $showDetail = this._$showDetail
    const $deleteCookie = this._$deleteCookie
    const $copyCookie = this._$copyCookie

    const btnDisabledCls = c('btn-disabled')

    if (this._selectCookieKey === null) {
      $showDetail.addClass(btnDisabledCls)
      $deleteCookie.addClass(btnDisabledCls)
      $copyCookie.addClass(btnDisabledCls)
    } else {
      $showDetail.rmClass(btnDisabledCls)
      $deleteCookie.rmClass(btnDisabledCls)
      $copyCookie.rmClass(btnDisabledCls)
    }
  }
}
