type Headers = {
  [key: string]: string
}

export interface IRequest {
  name: string
  url: string
  status: 'pending' | number
  type: string
  subType: string
  size: number
  data: unknown
  method: string
  startTime: number
  time: number
  displayTime?: string
  resTxt: string
  done: boolean
  reqHeaders: Headers
  resHeaders: Headers
  hasErr: boolean

  render: () => void
}

export interface IReqeustWillBeSent {
  requestId: string
  request: {
    method: string
    url: string
    headers: Headers
    postData: unknown
  }
  type: string
  timestamp: number
}

export interface IResponseReceivedExtraInfo {
  requestId: string
  headers: Headers
}

export interface IResponseReceived {
  requestId: string
  type: string
  response: {
    headers?: Headers
    status: number
  }
  timestamp: number
}

export interface ILoadingFinishedData {
  requestId: string
  encodeDataLength: number
  timestamp: number
}
