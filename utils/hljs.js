import hljs from 'highlight.js/lib/core'
import DOMPurify from 'isomorphic-dompurify'

import javascript from 'highlight.js/lib/languages/javascript'
hljs.registerLanguage('javascript', javascript);

import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('xml', xml);

hljs.configure({ ignoreUnescapedHTML: true })

export const highlightSanitizedJS = js => {
  return DOMPurify.sanitize(hljs.highlight(js, {
    language: 'js', ignoreIllegals: true
  }).value)
}

export const highlightSanitizedMarkdown = html => {
  const reScripts = new RegExp('(<pre><code[^>]*?>)([\\s\\S]*?)(</code></pre>)', 'gi')

  return DOMPurify.sanitize(html.replace(reScripts, (match, open, contents, close) => {
    const highlightedContents = hljs.highlight(contents, {
      language: 'js', 
      ignoreIllegals: true
    }).value
    return `${open}${highlightedContents}${close}`
  }))
}

export const highlightSanitizedHTML = (html) => {
  const token = '@jsperfAppToken'

  const reScripts = new RegExp('(<script[^>]*?>)([\\s\\S]*?)(</script>)', 'gi');

  let swappedScripts = []

  const highlighted = hljs.highlight(
    html.replace(
      reScripts,
      (match, open, contents, close) => {
        // highlight JS inside script tags
        const highlightedContents = hljs.highlight(contents, {language: 'js', ignoreIllegals: true}).value
        // store to put back in place later
        swappedScripts.unshift(highlightedContents.replace(/&nbsp;$/, ''))
        // insert marker to replace shortly
        return `${open}${token}${close}`
      }
    ), {language: 'html', ignoreIllegals: true}
  ).value.replace(new RegExp(token, 'g'), () => swappedScripts.pop())

  return DOMPurify.sanitize(highlighted)
}

export default hljs
