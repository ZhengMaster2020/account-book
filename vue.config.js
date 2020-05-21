module.exports = {
  devServer: {
    port: '8080',
    proxy: {
      '/api/file': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        pathRewrite: {'^/api' : ''}
      },
    }
  }
}
