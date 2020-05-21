const express = require('express')
const fs = require('fs')
const Papa = require('papaparse')
const app = express()
const cors = require('cors')

const router = express.Router()
app.use(cors())

app.get('/', (req, res) => res.end('Hello port 8088 is listening'))

// 中间件--根据请求参数filename设置要读取csv文档
app.use('/file/:filename', (req, res, next) => {
  res.set({ 'Content-Type': 'application/json' })
  req.filename = req.params.filename
  console.log(req.filename, 'file')
  next()
}, router)

//根据filename读取csv文档
router.get('/', (req, res) => {
  fs.readFile(`./serve/mock/${req.filename}.csv`, 'utf-8', (err, result) => {
    if(err) return res.status(500).end(`read ${req.filename}.csv file fail, error: ${err}`)
      const { data } = Papa.parse(result, { header: true })
      res.send(data)
  })
})


app.listen(8088, () => console.log(`Server is listening on 8088 port`))