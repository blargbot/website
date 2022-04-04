import axios from 'axios'

export default async function (req, res, next) {
  const outputMatch = req.url.match(/^\/output\/(.*)\.txt$/)
  if (outputMatch) {
    try {
      const url = process.env._AXIOS_BASE_URL_ + 'outputs/' + outputMatch[1];
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

  next()
}
