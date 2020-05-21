const fs = require('fs')
const Papa = require('papaparse')


const changeCSVToJSON= (path, format='utf-8') => {
  console.log(path, format, 'path')
  fs.readFile(path, format, function(err, data) {
    console.log('err,', err)
    if (err) return `读取${path}相应文件失败，error:${err}`
    // console.log(data, 'data')
    const resultData = Papa.parse(data, { header: true }).data
    console.log(resultData, 'json')
    return resultData
  })
}

// changeCSVToJSON('./src/mock/bill.csv')

module.exports = {
  // 将cvs格式转换为json数据格式
  changeCSVToJSON
}

