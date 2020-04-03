import express from 'express'
const app = express()

const port = 3000

app.get('/action', function (req, res) {
  res.send('hello world')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
