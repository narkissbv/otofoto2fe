module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        pathRewrite: {'^/api' : '/'}
      },
    }
  },
  runtimeCompiler: true
}
