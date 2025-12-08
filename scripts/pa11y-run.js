import pa11y from 'pa11y'
import fs from 'fs'

const pages = ['http://localhost:5173/', 'http://localhost:5173/programme', 'http://localhost:5173/intervenants', 'http://localhost:5173/contact']

;(async () => {
  for (const url of pages) {
    try {
      console.log('Testing', url)
      const results = await pa11y(url, { standard: 'WCAG2AA' })
      const filename = `pa11y-${url.replace(/https?:\/\//, '').replace(/[:/\\?=&]/g, '-')}.json`
      fs.writeFileSync(filename, JSON.stringify(results, null, 2))
      console.log('Saved', filename)
    } catch (err) {
      console.error('Error testing', url, err.message)
    }
  }
})()
