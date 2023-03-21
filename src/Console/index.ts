import { DevTools } from '@/DevTools'
import { Tool } from '@/DevTools/Tool'
import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDisposable } from 'eruda'
import $ from 'licia/$'
import { classPrefix as c } from '@/lib/util'
import LunaConsole from 'luna-console'
import { CONSOLE_METHOD } from './Constants'

import ConsoleScss from './Console.scss'

export class Console extends Tool implements IDisposable {
  private _cssEl: HTMLElement = evalCss(ConsoleScss)

  private _logger!: LunaConsole

  private _$control!: $.$
  private _$inputContainer!: $.$
  private _$input!: $.$
  private _$logsContainer!: $.$
  private _$inputBtns!: $.$
  private _$filterText!: $.$
  private _$level!: $.$

  private __triggerEventTextarea = this._triggerEventTextarea.bind(this)
  private __triggerEventLevel = this._triggerEventLevel.bind(this)
  private __triggerEventInputBtnCancel = this._triggerEventInputBtnCancel.bind(this)
  private __triggerEventInputBtnExecute = this._triggerEventInputBtnExecute.bind(this)

  constructor() {
    super('console')
  }

  public dispose(): void {
    destroyStyle(this._cssEl)
  }

  public init($el: $.$, devTools: DevTools) {
    super.init($el, devTools)

    this._appendTpl()
    this._initLogger()
    this._overrideConsole()

    this._bindEvent()
  }

  private _appendTpl() {
    const $el = this._$el

    $el.append(
      c(`
        <div class="control">
          <span class="icon-clear clear-console"></span>
          <span class="level active" data-level="all">All</span>
          <span class="level" data-level="info">Info</span>
          <span class="level" data-level="warning">Warning</span>
          <span class="level" data-level="error">Error</span>
          <span class="filter-text"></span>
          <span class="icon-filter filter"></span>
          <span class="icon-copy icon-disabled copy"></span>
        </div>
        <div class="logs-container"></div>
        <div class="input-container">
          <div class="buttons">
            <div class="button cancel">Cancel</div>
            <div class="button execute">Execute</div>
          </div>
          <span class="icon-arrow-right"></span>
          <textarea class="input"></textarea>
        </div>
      `)
    )

    this._$control = $el.find(c('.control'))
    this._$inputContainer = $el.find(c('.input-container'))
    this._$input = $el.find(c('.input'))
    this._$logsContainer = $el.find(c('.logs-container'))
    this._$inputBtns = $el.find(c('.buttons'))
    this._$filterText = $el.find(c('.filter-text'))
    this._$level = $el.find(c('.level'))
  }

  private _bindEvent() {
    this._$control.on('click', c('.level'), this.__triggerEventLevel)
    this._$input.on('focusin', this.__triggerEventTextarea)
    this._$inputBtns
      .on('click', c('.cancel'), this.__triggerEventInputBtnCancel)
      .on('click', c('.execute'), this.__triggerEventInputBtnExecute)
  }

  private _triggerEventLevel(ev: { curTarget: HTMLElement }) {
    const el = ev.curTarget
    const _level = $(el).data('level')
    const allLevel = ['verbose', 'info', 'warning', 'error']
    const level = _level === 'all' ? allLevel : _level
    this._logger.setOption('level', level)
  }

  private _triggerEventTextarea() {
    this._$inputContainer.addClass(c('active'))
    this._$inputBtns.css('display', 'flex')
  }

  private _triggerEventInputBtnCancel() {
    this._hideInputContainerAndBtns()
  }

  private _triggerEventInputBtnExecute() {
    const value = this._$input.val().trim()
    if (value === '') {
      return
    }

    this._logger.evaluate(value)
    this._hideInputContainerAndBtns()
    this._blurInput()
  }

  private _initLogger() {
    const logsContainerEl = this._$logsContainer.get(0) as HTMLElement
    const logger = new LunaConsole(logsContainerEl, {
      asyncRender: true,
      maxNum: 0,
      showHeader: false,
      unenumerable: true,
      accessGetter: true,
      lazyEvaluation: true,
    })

    logger.on('optionChange', (name: string, value: string) => {
      if (name !== 'level') {
        return
      }

      const activeCls = c('active')

      this._$level.rmClass(activeCls)
      this._$level.each((index: number, el: HTMLElement) => {
        const $el = $(el)
        if ($el.data('level') === value) {
          $el.addClass(activeCls)
        }
      })
    })

    this._logger = logger
  }

  private _overrideConsole() {
    const windowConsole = window.console

    CONSOLE_METHOD.forEach((name) => {
      if (!windowConsole[name]) {
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const origin: (...args: any[]) => void = windowConsole[name].bind(windowConsole)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      windowConsole[name] = (...args: any[]) => {
        // @ts-expect-error
        this._logger[name](...args)
        origin(...args)
      }
    })
  }

  private _hideInputContainerAndBtns() {
    this._$inputContainer.rmClass(c('active'))
    this._$inputBtns.hide()
  }

  private _blurInput() {
    const inputEl = this._$input.get(0) as HTMLInputElement
    inputEl.blur()
  }
}
