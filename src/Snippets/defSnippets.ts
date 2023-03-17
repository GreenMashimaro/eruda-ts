import { destroyStyle, evalCss } from '@/lib/evalCss'
import { IDefSnippet } from './Types.d'
import Url from 'licia/Url'
import now from 'licia/now'
import trim from 'licia/trim'
import $ from 'licia/$'
import LunaModal from 'luna-modal'
import { isErudaEl } from '@/lib/util'

let style: HTMLElement | null = null
const defSnippets: IDefSnippet[] = [
  {
    name: 'Border All',
    fn() {
      if (style) {
        destroyStyle(style)
        style = null
        return
      }

      style = evalCss(
        '* { outline: 2px dashed #707d8b; outline-offset: -3px; }',
        document.head
      )
    },
    desc: 'Add color borders to all elements',
  },
  {
    name: 'Refresh Page',
    fn() {
      const url = new Url()
      url.setQuery('timestamp', now())

      window.location.replace(url.toString())
    },
    desc: 'Add timestamp to url and refresh',
  },
  {
    name: 'Search Text',
    fn() {
      LunaModal.prompt('Enter the text').then((_keyword) => {
        const keyword = trim(_keyword || '')
        search(keyword)
      })
    },
    desc: 'Highlight given text on page',
  },
  {
    name: 'Edit Page',
    fn() {
      const body = document.body
      body.contentEditable = `${body.contentEditable !== 'true'}`
    },
    desc: 'Toggle body contentEditable',
  },
]

function search(text: string) {
  const root = document.body
  const regText = new RegExp(text, 'ig')

  traverse(root, (node: Element) => {
    const $node = $(node)

    if (!$node.hasClass('eruda-search-highlight-block')) {
      return null
    }

    return document.createTextNode($node.text()) as unknown as Element
  })

  traverse(root, (node: Element) => {
    if (node.nodeType !== 3) return null

    let val = node.nodeValue || ''
    val = val.replace(regText, (match) => `<span class="eruda-keyword">${match}</span>`)

    if (val === node.nodeValue) return null

    const $ret = $(document.createElement('div'))
    $ret.html(val)
    $ret.addClass('eruda-search-highlight-block')

    return $ret.get(0)
  })
}

function traverse(
  root: Node,
  processor: (node: Element) => Element | null
): Element | null {
  const childNodes = root.childNodes

  if (isErudaEl(root as Element)) {
    return null
  }

  for (let i = 0, len = childNodes.length; i < len; i++) {
    const newNode = traverse(childNodes[i], processor)

    if (newNode) {
      root.replaceChild(newNode, childNodes[i])
    }
  }

  return processor(root as Element)
}

export default defSnippets
