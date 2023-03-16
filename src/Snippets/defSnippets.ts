import { IDefSnippet } from './Types.d'
import Url from 'licia/Url'
import now from 'licia/now'

const defSnippets: IDefSnippet[] = [
  {
    name: 'Refresh Page',
    fn() {
      const url = new Url()
      url.setQuery('timestamp', now())

      window.location.replace(url.toString())
    },
    desc: 'Add timestamp to url and refresh',
  },
]

export default defSnippets
