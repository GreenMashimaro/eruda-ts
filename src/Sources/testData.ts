import { IData } from './Types'

export const htmlData: IData = {
  type: 'html',
  value: `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      />
      <title>Manual</title>
      <link rel="stylesheet" href="style.css" />
      <script src="assets/eruda.js"></script>
      <script src="util.js"></script>
    </head>
    <body id="body" class="test">
      <header>Manual Test</header>
      <nav>
        <ul>
          <li>
            <a href="#" id="issue17">#17</a>
          </li>
          <li>
            <a href="#" id="plugin">Plugin</a>
          </li>
          <li>
            <a href="#" id="issue29">#29</a>
          </li>
          <li>
            <a href="#" id="issue31">#31</a>
          </li>
          <li>
            <a href="#" id="issue33">#33</a>
          </li>
          <li>
            <a href="#" id="trigger-error">Trigger Error</a>
          </li>
          <li>
            <a href="#" id="big-array">Big Array</a>
          </li>
          <li>
            <a href="#" id="override-style">Override Style</a>
          </li>
          <li>
            <a href="#" id="log">Log</a>
          </li>
          <li>
            <a href="#" id="log-10000">Log 10000</a>
          </li>
          <li>
            <a href="#" id="log-1000">Log 1000</a>
          </li>
        </ul>
        <div>
          <img src="https://niupic.com/dist/img/padlock.png" alt="">
          <img src="https://niupic.com/dist/img/share.png" alt="">
          <img src="https://niupic.com/dist/img/link.png" alt="">
        </div>
      </nav>
      <script>
        function addClickEvent(id, listener) {
          document.getElementById(id).addEventListener(
            'click',
            function (e) {
              e.preventDefault()
              listener()
            },
            false
          )
        }
        addClickEvent('issue17', function () {
          var B = function () {}
          var A = function () {
            this._data = 'eruda'
          }
          A.prototype = Object.create(B.prototype)
          Object.defineProperty(A.prototype, 'data', {
            get: function () {
              return this._data
            },
          })
          var a = new A()
          console.log(a)
        })
        addClickEvent('plugin', function () {
          eruda.add({ name: 'test' })
          eruda.add(function (eruda) {
            return {
              name: 'test2',
              init: function ($el) {
                this._$el = $el
                this._$el.html('This is the new plugin')
              },
            }
          })
          var Tool = eruda.Tool
          eruda.add(
            new (Tool.extend({
              name: 'test3',
              init: function ($el) {
                this.callSuper(Tool, 'init', arguments)
                this._$el.html('This is another new plugin')
              },
            }))()
          )
        })
        addClickEvent('issue29', function () {
          new Promise(function (resolve, reject) {
            resolve()
          }).then(function (res) {
            var a = res.a
          })
        })
        addClickEvent('issue31', function () {
          addEventListener('resize', function () {})
        })
        addClickEvent('issue33', function () {
          util.evalCss(':root {--test: 10px;}')
        })
        addClickEvent('trigger-error', function () {
          triggerError()
        })
        addClickEvent('big-array', function () {
          var arr = []
          for (var i = 0; i < 10000; i++) {
            arr.push(i)
          }
          console.log(arr)
        })
        addClickEvent('override-style', function () {
          util.evalCss('.eruda-nav-bar {background: red !important;}')
        })
        addClickEvent('log', function () {
          console.clear()
          console.log('log')
          console.log('number:', 5)
          console.log('boolean:', true, false)
          console.log('null:', null)
          console.log('undefined:', undefined)
          console.log('regexp:', /test/gi)
          for (var i = 0; i < 10; i++) {
            console.log('repeat log')
          }
          console.warn('warn')
          console.error(Error('test'))
          console.info('info')
          console.debug('debug')
          console.time('test')
          console.timeEnd('test')
          console.count('luna')
          console.count('luna')
          console.assert(true, 'assert msg')
          var site1 = { name: 'Runoob', site: 'www.runoob.com' }
          var site2 = { name: 'Google', site: 'www.google.com' }
          var site3 = { name: 'Taobao', site: 'www.taobao.com' }
          console.table([site1, site2, site3], ['site'])
          var el = util.toEl(
            '<div class="test"><div class="test-inner"></div></div>'
          )
          console.log('test dom', el)
          console.dir(el)
          console.log('%c Oh my heavens!', 'background: #222; color: #bada55')
          console.log('This is the outer level')
          console.group()
          console.log('Level 2')
          console.group()
          console.log('Level 3')
          console.warn('More of level 3')
          console.groupEnd()
          console.log('Back to level 2')
          console.groupEnd()
          console.log('Back to the outer level')
          console.log(
            'navigator: %o location: %o performance: %o',
            navigator,
            location,
            performance
          )
          var arr = []
          for (var i = 0; i < 10000; i++) arr.push(i)
          console.log(arr)
        })
        addClickEvent('log-10000', function () {
          for (var i = 0; i < 10000; i++) {
            console.log(location, i)
          }
        })
        addClickEvent('log-1000', function () {
          for (var i = 0; i < 1000; i++) {
            console.log(location, i)
          }
        })
      </script>
      <script>
        eruda.init()
        eruda.show()
      </script>
    </body>
  </html>
  `,
}

export const objectData: IData = {
  type: 'object',
  value: [
    {
      w: 'w_ss_panel_office_frequently',
    },
    {
      w: 'w_ss_panel_news_and_info',
    },
    {
      w: 'w_ss_panel_video_music',
    },
    {
      w: 'w_ss_panel_document_template',
    },
    {
      w: 'w_ss_panel_shopping_trip',
    },
    {
      w: 'w_ss_panel_entertainment',
    },
    {
      w: 'w_ss_panel_e_government',
    },
    {
      w: 'w_ss_panel_academic_library',
    },
    {
      w: 'w_ss_panel_job_search',
    },
    {
      w: 'w_ss_panel_graphic_creation',
    },
    {
      w: 'w_ss_panel_email_login',
    },
    {
      w: 'w_ss_panel_educational_learning',
    },
    {
      w: 'w_ss_panel_life_service',
    },
    {
      w: 'w_ss_panel_office_software',
    },
    {
      w: 'w_ss_panel_enterprise_inquiry',
    },
    {
      w: 'w_ss_panel_bank_payment',
    },
    {
      w: 'w_ss_panel_language_translation',
    },
    {
      w: 'w_ss_panel_active_community',
    },
  ],
}

export const rawData: IData = {
  type: 'raw',
  value: 'abcd',
}

export const imgData: IData = {
  type: 'img',
  value: {
    width: 128,
    height: 128,
    src: 'https://niupic.com/dist/img/link.png',
  },
}

export const iframeData: IData = {
  type: 'iframe',
  value: 'https://hao.qq.com/',
}
