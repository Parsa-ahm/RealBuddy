const sharp = require('sharp')
const toIco = require('to-ico')
const fs = require('fs')
const path = require('path')

async function buildIcon() {
  const svgPath = path.join(__dirname, '../Assets/Logo.svg')
  const outDir = path.join(__dirname, 'assets')

  // Create assets directory if it doesn't exist
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  try {
    // Check if SVG file exists
    if (!fs.existsSync(svgPath)) {
      throw new Error(`SVG file not found at ${svgPath}`)
    }

    const sizes = [16, 32, 48, 64, 128, 256]
    const pngBuffers = await Promise.all(
      sizes.map(size =>
        sharp(svgPath)
          .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer()
      )
    )

    const icoBuffer = await toIco(pngBuffers)
    fs.writeFileSync(path.join(outDir, 'icon.ico'), icoBuffer)
    fs.writeFileSync(path.join(outDir, 'icon.png'), pngBuffers[5]) // 256px for electron-builder
    console.log('✓ icon.ico and icon.png generated successfully')
    process.exit(0)
  } catch (err) {
    console.error('✗ Icon generation failed:', err.message)
    process.exit(1)
  }
}

buildIcon()
