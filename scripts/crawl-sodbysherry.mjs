import * as cheerio from 'cheerio'
import { mkdir, writeFile } from 'node:fs/promises'

const sitemapUrls = [
  'https://www.sodbysherry.com/post-sitemap.xml',
  'https://www.sodbysherry.com/page-sitemap.xml',
  'https://www.sodbysherry.com/product-sitemap.xml',
  'https://www.sodbysherry.com/category-sitemap.xml',
  'https://www.sodbysherry.com/product_cat-sitemap.xml',
  'https://www.sodbysherry.com/product_tag-sitemap.xml',
]

const ignoredUrlParts = ['/cart/', '/checkout/', '/my-account/']

function uniq(values) {
  return [...new Set(values)]
}

function compactText(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function sentenceList(text) {
  return uniq(
    text
      .split(/(?<=[.!?])\s+/)
      .map(compactText)
      .filter((item) => item.length >= 35 && item.length <= 260),
  ).slice(0, 18)
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim())
}

function classify(url) {
  if (url.includes('/product/')) return 'Product'
  if (url.includes('/product-category/')) return 'Product category'
  if (url.includes('/product-tag/')) return 'Product tag'
  if (url.includes('/category/')) return 'Post category'
  if (url.includes('/2017/')) return 'Post'
  return 'Page'
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml',
      'User-Agent': 'SodBySherryPitchCrawler/1.0 (+https://github.com/BrianACRM/sod-by-sherry-pitch)',
    },
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.text()
}

async function crawlPage(url) {
  const html = await fetchText(url)
  const $ = cheerio.load(html)
  $('script, style, noscript, svg, form, nav').remove()

  const title = compactText($('h1').first().text() || $('title').first().text() || url)
  const metaDescription = compactText($('meta[name="description"]').attr('content') || '')
  const prices = uniq(
    [...html.matchAll(/\$[0-9][0-9,]*(?:\.[0-9]{2})?(?:\s?[–-]\s?\$?[0-9][0-9,]*(?:\.[0-9]{2})?)?/g)].map(
      (match) => compactText(match[0]),
    ),
  )
  const statistics = uniq(
    [...compactText($.text()).matchAll(/\b(?:[0-9]+(?:\.[0-9]+)?\s?(?:%|sq\.?\s?ft|square feet|years?|days?|hours?|lbs?|pounds?|inches?|pallets?|gallons?)|[0-9]+\s?[xX]\s?[0-9]+)\b/g)].map(
      (match) => match[0],
    ),
  ).slice(0, 30)
  const headings = uniq(
    $('h1,h2,h3')
      .map((_, element) => compactText($(element).text()))
      .get()
      .filter(Boolean),
  )
  const links = uniq(
    $('a[href]')
      .map((_, element) => {
        const href = $(element).attr('href')
        try {
          return new URL(href, url).href
        } catch {
          return ''
        }
      })
      .get()
      .filter((href) => href.startsWith('https://www.sodbysherry.com/')),
  ).slice(0, 35)
  const images = uniq(
    $('img[src]')
      .map((_, element) => {
        const src = $(element).attr('src')
        try {
          return new URL(src, url).href
        } catch {
          return ''
        }
      })
      .get()
      .filter(Boolean),
  ).slice(0, 60)
  const text = compactText($('.entry-content, main, article, body').first().text())

  return {
    url,
    type: classify(url),
    title,
    metaDescription,
    headings,
    prices,
    statistics,
    keyText: sentenceList(text),
    imageCount: images.length,
    images,
    internalLinks: links,
  }
}

async function main() {
  const sitemapXml = await Promise.all(sitemapUrls.map(fetchText))
  const urls = uniq(sitemapXml.flatMap(extractLocs))
  const pages = []

  for (const url of urls) {
    if (ignoredUrlParts.some((part) => url.includes(part))) {
      pages.push({
        url,
        type: classify(url),
        title: url,
        metaDescription: 'Transactional WooCommerce system page. Preserve the route and checkout/account function.',
        headings: [],
        prices: [],
        statistics: [],
        keyText: ['Transactional WooCommerce system page. Preserve the route and checkout/account function.'],
        imageCount: 0,
        images: [],
        internalLinks: [],
      })
      continue
    }

    try {
      pages.push(await crawlPage(url))
      console.log(`Crawled ${url}`)
    } catch (error) {
      pages.push({
        url,
        type: classify(url),
        title: url,
        error: error.message,
        metaDescription: '',
        headings: [],
        prices: [],
        statistics: [],
        keyText: [],
        imageCount: 0,
        images: [],
        internalLinks: [],
      })
      console.warn(`Failed ${url}: ${error.message}`)
    }
  }

  const summary = {
    crawledAt: new Date().toISOString(),
    source: 'https://www.sodbysherry.com/sitemap.xml',
    pageCount: pages.length,
    pages,
  }

  await mkdir('docs', { recursive: true })
  await mkdir('src/data', { recursive: true })
  await writeFile('docs/sodbysherry-content-inventory.json', `${JSON.stringify(summary, null, 2)}\n`)
  await writeFile(
    'src/data/siteContent.js',
    `export const siteContent = ${JSON.stringify(summary, null, 2)}\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
