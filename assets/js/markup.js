// Adapted from https://github.com/bots-gg/markup

import marked, { Renderer } from 'marked'
import hljs from 'highlight.js'
import xss from 'xss'

const onTagAttr = (tag, name, value) => {
  if (tag === 'link' && name === 'rel') {
    // Only allow link tags if they're intended for stylesheets.
    return value === 'stylesheet' ? 'rel="stylesheet"' : ''
  }

  if (tag === 'input' && name === 'type') {
    // Allow checkboxes from `- [ ]`
    return value === 'checkbox' ? 'type="checkbox"' : ''
  }
}

const whiteList = {
  ...xss.whiteList,
  // Allow marquees
  marquee: [
    'behavior',
    'direction',
    'hspace',
    'loop',
    'scrollamount',
    'scrolldelay',
    'truespeed',
    'vspace'
  ],
  style: [], // Allow plain style tags
  link: ['rel', 'href'], // Allow link tags for external stylesheets
  input: ['type'] // Allow checkbox inputs
}

// Enable custom classes & ids to assist with CSS
for (const key of Object.keys(whiteList)) { whiteList[key].push('class', 'id') }

/** Safely render markdown. */
export default function render (md, options = {}, markdownOptions = {}, xssOptions = {}) {
  if (options.anchorTags) {
    markdownOptions.renderer = new Renderer()
    markdownOptions.renderer.heading = function heading (text, level) {
      const escapedText = text.toLowerCase().replace(/<.+>.+<\/.+>/g, '').replace(/&.+;/g, '').replace(/[^\w]+/g, '-').replace(/-$/, '')

      return `
              <h${level} class="anchor-header">
                <a class="anchor-link" href="#${escapedText}">
                  <span class="header-link"></span>
                </a>
                <div class="anchor" id="${escapedText}"></div>
                ${text}
              </h${level}>`
    }
  }

  return xss(
    marked(md, {
      highlight: (code, lang) =>
        lang && hljs.getLanguage(lang)
          ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
          : code,
      smartypants: true,
      smartLists: true,
      ...markdownOptions
    }),
    {
      onTagAttr,
      whiteList,
      ...xssOptions
    }
  )
}
