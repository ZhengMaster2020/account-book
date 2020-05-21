import axios from 'axios'

export function fetchData(){
  axios.get('/api/file/bill', (req, res) => {
    console.log(res, 'res')
  }) 
  axios.get('/api/file/categories', (req, res) => {
    console.log(res, 'res')
  })
}
