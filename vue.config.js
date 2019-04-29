module.exports = {
    devServer: {
        open: process.platform === 'darwin',
        host: 'localhost',
        port: 3000,
        // host: '192.100.2.39',
        // port: 12580,
        https: false,
        hotOnly: false,
        proxy: null, // 设置代理
    },
}