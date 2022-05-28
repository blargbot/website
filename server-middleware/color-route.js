import Jimp from 'jimp'

export default async function (req, res, next) {
  const outputMatch = req.url.match(/^\/colou?r\/(.*)\/?$/)
  if (!outputMatch) {
    next()
    return
  }

  const hex = Number('0x' + outputMatch[1] + 'ff')
  if (isNaN(hex)) {
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({
      error: 'That is not a hex code, you scrub!'
    }))
    res.end()
  } else {
    const img = await new Jimp(256, 256, hex)
    const buffer = await img.getBufferAsync(Jimp.MIME_PNG)

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Length', buffer.length)
    res.write(buffer)
    res.end()
  }
}
