const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    // 禁用对依赖包的转译处理
    transpileDependencies: false,
    // 加载 Markdown 格式的文件
    chainWebpack: config => {
        config.module.rule('md')
            .test(/\.md/)
            .use('vue-loader')
            .loader('vue-loader')
            .end()
            .use('vue-markdown-loader')
            .loader('vue-markdown-loader/lib/markdown-compiler')
            .options({
                raw: true
            })
    },
    // 开发配置
    devServer: {
        host: '127.0.0.1',
        port: 18003,
        open: true
    }
})
