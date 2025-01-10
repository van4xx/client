module.exports = {
  // ...остальные настройки
  devServer: {
    port: 3000,
    hot: true,
    client: {
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: 3000,
      },
    },
  },
}; 