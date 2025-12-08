import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Config
const srcDir = path.resolve(process.cwd(), 'public', 'images', 'event')
const outDir = path.resolve(process.cwd(), 'public', 'images', 'generated')
const sizes = [400, 800, 1200]

async function ensureOut() {
  await fs.promises.mkdir(outDir, { recursive: true })
}

function filenameParts(filename) {
  const ext = path.extname(filename)
  const name = path.basename(filename, ext)
  return { name, ext }
}

async function processFile(file) {
  const input = path.join(srcDir, file)
  const { name } = filenameParts(file)
  for (const w of sizes) {
    const outWebp = path.join(outDir, `${name}-${w}.webp`)
    const outAvif = path.join(outDir, `${name}-${w}.avif`)
    try {
      await sharp(input).resize({ width: w }).webp({ quality: 80 }).toFile(outWebp)
      await sharp(input).resize({ width: w }).avif({ quality: 60 }).toFile(outAvif)
      console.log('Written', outWebp, outAvif)
    } catch (err) {
      console.error('Error processing', input, err.message)
    }
  }
}

async function run() {
  await ensureOut()
  const files = await fs.promises.readdir(srcDir).catch(() => [])
  const images = files.filter(f => /\.(jpe?g|png)$/i.test(f))
  if (!images.length) {
    console.log('No source images found in', srcDir)
    return
  }
  const placeholders = {}
  for (const f of images) {
    await processFile(f)
    // create tiny placeholder (20px wide) and base64 encode
    try {
      const input = path.join(srcDir, f)
      const buf = await sharp(input).resize({ width: 20 }).jpeg({ quality: 40 }).toBuffer()
      const b64 = `data:image/jpeg;base64,${buf.toString('base64')}`
      const { name } = filenameParts(f)
      placeholders[name] = b64
    } catch (err) {
      console.error('Error creating placeholder for', f, err.message)
    }
  }

  // write placeholders manifest
  try {
    const manifestPath = path.join(outDir, 'placeholders.json')
    await fs.promises.writeFile(manifestPath, JSON.stringify(placeholders, null, 2), 'utf8')
    console.log('Wrote placeholders manifest', manifestPath)
  } catch (err) {
    console.error('Error writing placeholders manifest', err.message)
  }

  console.log('Done. Generated images live in public/images/generated')
}

run().catch(err => { console.error(err); process.exit(1) })
