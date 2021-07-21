const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { Readable } = require('stream')

const helpers = require('@/utils/helper')

/**
 * Resize image
 * @param {string} imagePath
 * @param {{ replace?: boolean, writeFile?: boolean }} options
 *  - replace: defaults to false
 *  - writeFile: defaults to false
 */

const resize = async (imagePath, options) => {
  const { replace = false, writeFile = false } = helpers.ensureObject(options)

  if (!fs.existsSync(imagePath)) {
    throw new Error('The path to image doesn\'t valid.')
  }

  let { width, height, orientation } = await sharp(imagePath).metadata()

  const ratio = width / height
  const [MAX_WIDTH, MAX_HEIGHT] = ratio > 1 ? [2560, 1440] : [1440, 2560]

  if (width > MAX_WIDTH) {
    width = MAX_WIDTH
    height = Math.round(width / ratio)
  }

  if (height > MAX_HEIGHT) {
    height = MAX_HEIGHT
    width = Math.round(ratio * height)
  }

  const buffer = await sharp(fs.readFileSync(imagePath))
    .resize(width, height)
    .toFormat('jpeg')
    .withMetadata({ orientation })
    .toBuffer()

  const filename = `${path.basename(imagePath, path.extname(imagePath))}${replace ? '' : '-resized'}${path.extname(imagePath)}`

  if (!writeFile) {
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    return { filename, stream }
  }

  const filePath = path.join(
    path.dirname(imagePath),
    filename
  )
  fs.writeFileSync(filePath, buffer, 'binary')

  return { filePath }
}

module.exports = {
  resize
}
