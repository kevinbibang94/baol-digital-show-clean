import puppeteer from 'puppeteer'
import fs from 'fs'

const pages = [
  { url: 'http://localhost:5173/', name: 'home' },
  { url: 'http://localhost:5173/programme', name: 'programme' },
  { url: 'http://localhost:5173/intervenants', name: 'intervenants' },
  { url: 'http://localhost:5173/contact', name: 'contact' },
]

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'desktop', width: 1280, height: 900 },
]

async function run() {
  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots')
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  try {
    for (const pageDef of pages) {
      const page = await browser.newPage()
      for (const vp of viewports) {
        await page.setViewport({ width: vp.width, height: vp.height })
        try {
          console.log(`Opening ${pageDef.url} at ${vp.name} (${vp.width}x${vp.height})`)
          await page.goto(pageDef.url, { waitUntil: 'networkidle2', timeout: 30000 })
        } catch (err) {
          console.warn(`Failed to load ${pageDef.url}: ${err.message}`)
        }
        // small delay to allow animations to settle
        await page.waitForTimeout(600)
        const filename = `screenshots/${pageDef.name}-${vp.name}.png`
        await page.screenshot({ path: filename, fullPage: true })
        console.log('Saved', filename)
      }
      await page.close()
    }
  } finally {
    await browser.close()
  }
}

run().catch(err => { console.error(err); process.exit(1) })
