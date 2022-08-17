<template>
    <div class="home">
        <markdown class="markdown-body"></markdown>
    </div>
</template>

<script>
// 查询 ../../public/markdown 文件夹, true 同时查询子目录, /\.md$/ 正则表达式匹配 markdown 文件
const requireComponent = require.context('../../public/markdown', true, /\.md$/)

// 存储所有获取到的 markdown 文件
let markdownList = {}

requireComponent.keys().forEach(fileName => {
    // 获取文件名
    let name = fileName.split('/').pop().replace(/\.\w+$/, '')
    // 获取组件配置
    const config = requireComponent(fileName)
    // 若该组件是通过 export default 导出的, 优先使用 .default, 否则使用模块的根
    markdownList[name] = config.default || config
})

// 获取当前显示的 markdown 文件
let Markdown = markdownList['one']

export default {
    name: 'HomeView',
    components: {
        Markdown
    }
}
</script>
