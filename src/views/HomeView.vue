<template>
    <el-container class="app-wrapper">
        <el-aside width="300px" class="sidebar-container">
            <el-menu
                class="el-menu-vertical-demo"
                :default-active="hello"
                active-text-color="#00AF9B"
            >
                <el-menu-item
                    v-for="name in nameList" :key="name" :index="name"
                    @click="chooseMarkdown(name)"
                >
                    <p class="item">{{ name }}</p>
                </el-menu-item>
            </el-menu>
            <el-tag class="ml-2 tag" type="success" effect="dark" color="#00AF9B">
                Note Total Number {{ noteNumber }}
            </el-tag>
        </el-aside>
        <el-main>
            <component class="markdown-body" v-bind:is="markdownList[markdownName]"/>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'

// 查询 /markdown 文件夹中的 Markdown 文件
// true 同时查询子目录, 正则表达式匹配 .md 文件
const requireComponent = require.context('../../markdown', true, /\.md$/)

// 存储所有获取到的 Markdown 文件
let markdownList = {}

// Markdown 文件名列表
let nameList = []

requireComponent.keys().sort().forEach(fileName => {
    // 获取文件名
    let name = fileName.split('/').pop().replace(/\.\w+$/, '')
    // 存储文件名
    nameList.push(name)
    // 获取组件配置
    const config = requireComponent(fileName)
    // 若该组件是通过 export default 导出的, 优先使用 .default, 否则使用模块的根
    markdownList[name] = config.default || config
})

// 笔记数量
let noteNumber = nameList.length - 1

// 默认显示欢迎页
let hello = '0000.Hello'

// 当前 Markdown 文件的名称
let markdownName = ref(hello)

// 切换 Markdown 文件
const chooseMarkdown = (name) => {
    markdownName.value = name
}
</script>

<style scoped>
.item {
    font-weight: bold;
    font-size: 16px;
}

.tag {
    margin-left: 20px;
    margin-top: 20px;
}
</style>
