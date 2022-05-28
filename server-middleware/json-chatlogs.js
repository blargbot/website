import axios from 'axios'

export default async function (req, res, next) {
  const outputMatch = req.url.match(/^\/logs\/(.*)\.json$/)
  if (!outputMatch) {
    next()
    return
  }

  try {
    const url = process.env._AXIOS_BASE_URL_ + 'chatlogs/' + outputMatch[1]

    const logs = await axios.get(url)
    logs.data.messages.sort((a, b) => {
      return new Date(a.msgtime) - new Date(b.msgtime)
    })

    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify(logs.data.messages, null, 2))
    res.end()
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain')
    res.write(err.stack)
    res.end()
  }
}
