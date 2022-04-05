import axios from 'axios'

export default async function (req, res, next) {
  const outputMatch = req.url.match(/^\/dumps\/(.*)\.txt$/)
  if (!outputMatch) {
    next()
    return
  }

  try {
    const url = process.env._AXIOS_BASE_URL_ + 'dumps/' + outputMatch[1]
    const dump = await axios.get(url)

    res.setHeader('Content-Type', 'text/plain')
    res.write(dump.data.content)
    res.end()
  } catch (err) {
    res.setHeader('Content-Type', 'text/plain')
    res.write(err.stack)
    res.end()
  }
}
