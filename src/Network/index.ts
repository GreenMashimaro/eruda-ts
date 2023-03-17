import {
  ILoadingFinishedData,
  IReqeustWillBeSent,
  IRequest,
  IResponseReceived,
  IResponseReceivedExtraInfo,
} from './Types.d'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import $ from 'licia/$'
import { classPrefix as c, getFileName } from '@/lib/util'
import LunaDataGrid from 'luna-data-grid'
import chobitsu from '@/lib/chobitsu'
import ms from 'licia/ms'

import NetworkScss from './Network.scss'
import { getType } from './util'

export class Network extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(NetworkScss)
  private _$network!: $.$
  private _$detail!: $.$
  private _$requests!: $.$
  private _$control!: $.$
  private _$filterText!: $.$
  private _requestDataGrid!: LunaDataGrid
  private _isRecording = true
  private _requests: { [key: string]: IRequest } = {}

  private _reqWillBeSent = this.__reqWillBeSent.bind(this)
  private _resReceivedExtraInfo = this.__resReceivedExtraInfo.bind(this)
  private _resReceived = this.__resReceived.bind(this)
  private _loadingFinished = this.__loadingFinished.bind(this)

  constructor() {
    super('network')

    this._bindEvent()
  }

  public dispose(): void {
    destroyStyle(this._cssEl)

    this.clear()

    this._unbindEventNetwork()
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    this._initTpl()

    const requestEl = this._$requests.get(0) as HTMLElement
    this._requestDataGrid = new LunaDataGrid(requestEl, {
      columns: [
        {
          id: 'name',
          title: 'Name',
          sortable: true,
          weight: 30,
        },
        {
          id: 'method',
          title: 'Method',
          sortable: true,
          weight: 14,
        },
        {
          id: 'status',
          title: 'Status',
          sortable: true,
          weight: 14,
        },
        {
          id: 'type',
          title: 'Type',
          sortable: true,
          weight: 14,
        },
        {
          id: 'size',
          title: 'Size',
          sortable: true,
          weight: 14,
        },
        {
          id: 'time',
          title: 'Time',
          sortable: true,
          weight: 14,
        },
      ],
    })
  }

  private clear() {
    this._requestDataGrid.clear()
  }

  private _initTpl() {
    const $el = this._$el
    $el.html(
      c(`
        <div class="network">
          <div class="control">
            <span class="icon-record record recording"></span>
            <span class="icon-clear clear-request"></span>
            <span class="icon-eye icon-disabled show-detail"></span>
            <span class="icon-copy icon-disabled copy-curl"></span>
            <span class="filter-text"></span>
            <span class="icon-filter filter"></span>
          </div>
          <div class="requests"></div>
        </div>
        <div class="detail"></div>
      `)
    )
    this._$network = $el.find(c('.network'))
    this._$detail = $el.find(c('.detail'))
    this._$requests = $el.find(c('.requests'))
    this._$control = $el.find(c('.control'))
    this._$filterText = $el.find(c('.filter-text'))
  }

  private _bindEvent() {
    this._bindEventNetwork()
  }

  private _bindEventNetwork() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const network = chobitsu.domain('Network')!
    network.enable()
    network.on('requestWillBeSent', this._reqWillBeSent)
    network.on('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.on('responseReceived', this._resReceived)
    network.on('loadingFinished', this._loadingFinished)
  }

  private _unbindEventNetwork() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const network = chobitsu.domain('Network')!
    network.off('requestWillBeSent', this._reqWillBeSent)
    network.off('responseReceivedExtraInfo', this._resReceivedExtraInfo)
    network.off('responseReceived', this._resReceived)
    network.off('loadingFinished', this._loadingFinished)
  }

  private __reqWillBeSent(params: IReqeustWillBeSent) {
    if (!this._isRecording) {
      return
    }

    const request: IRequest = {
      name: getFileName(params.request.url),
      method: params.request.method,
      status: 'pending',
      type: 'unknown',
      size: 0,
      time: 0,
      url: params.request.url,
      subType: 'unknown',
      data: params.request.postData,
      startTime: params.timestamp * 1000,
      resTxt: '',
      done: false,
      reqHeaders: params.request.headers || {},
      resHeaders: {},
      hasErr: false,

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      render: () => {},
    }

    // TODO: Possible memory leaks
    let node: ReturnType<import('luna-data-grid').default['append']> | null = null

    request.render = () => {
      const data = {
        name: request.name,
        method: request.method,
        status: `${request.status}`,
        type: request.type,
        size: `${request.size}`,
        time: `${request.time}`,
      }

      if (node) {
        node.data = data
        node.render()
      } else {
        node = this._requestDataGrid.append(data, { selectable: true })
        $(node.container).data('id', params.requestId)
      }

      if (request.hasErr) {
        $(node.container).addClass(c('request-error'))
      }
    }

    request.render()

    this._requests[params.requestId] = request
  }

  private __resReceivedExtraInfo(params: IResponseReceivedExtraInfo) {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    request.resHeaders = params.headers

    this._updateType(request)
    request.render()
  }

  private __resReceived(params: IResponseReceived) {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    const response = params.response
    const status = response.status
    const headers = response.headers

    request.status = status

    if (status < 200 || status >= 300) {
      request.hasErr = true
    }
    if (headers) {
      request.resHeaders = headers
    }

    request.render()
  }

  private __loadingFinished(params: ILoadingFinishedData) {
    const request = this._requests[params.requestId]
    if (!this._isRecording || !request) {
      return
    }

    const time = params.timestamp * 1000
    request.time = time - request.startTime
    request.displayTime = ms(request.time)

    request.size = params.encodeDataLength
    request.done = true
    request.resTxt = chobitsu.domain('Network')?.getResponseBody({
      requestId: params.requestId,
    }).body
  }

  private _updateType(request: IRequest) {
    const contentType = request.resHeaders['content-type'] || ''
    const { type, subType } = getType(contentType)

    request.type = type
    request.subType = subType
  }
}
