const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    // 禁用对依赖包的转译处理
    transpileDependencies: false,
    // Webpack 配置
    chainWebpack: config => {
        // 加载 Markdown 格式的文件
        config.module
            .rule('md')
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
    // CSS 配置
    css: {
        loaderOptions: {
            // SASS 配置
            sass: {
                // 全局引入样式文件
                additionalData: `@import "@/style/variable.scss";`
            }
        }
    },
    // 开发配置
    devServer: {
        host: '127.0.0.1',
        port: 18003,
        open: true
    }
})
