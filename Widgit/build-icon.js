const sharp = require('sharp')
const toIco = require('to-ico')
const fs = require('fs')
const path = require('path')

async function buildIcon() {
  const svgPath = path.join(__dirname, '../Assets/Logo.svg')
  const outDir = path.join(__dirname, 'assets')

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)

  const sizes = [16, 32, 48, 64, 128, 256]
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(svgPath).resize(size, size).png().toBuffer()
    )
  )

  const icoBuffer = await toIco(pngBuffers)
  fs.writeFileSync(path.join(outDir, 'icon.ico'), icoBuffer)
  fs.writeFileSync(path.join(outDir, 'icon.png'), pngBuffers[5]) // 256px for electron-builder
  console.log('icon.ico and icon.png generated in assets/')
}

buildIcon().catch(err => { console.error(err); process.exit(1) })
