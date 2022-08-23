<template>
    <el-container class="app-wrapper">
        <el-aside width="320px" class="sidebar-container">
            <el-scrollbar class="scrollbar">
                <el-menu
                    class="el-menu-vertical-demo"
                    :default-active="hello"
                    active-text-color="#00AF9B"
                >
                    <el-menu-item
                        v-for="name in allList" :key="name" :index="name"
                        @click="chooseMarkdown(name)"
                    >
                        <p class="item">{{ name }}</p>
                    </el-menu-item>
                </el-menu>
                <div>
                    <el-tag class="ml-2 tag" type="success" effect="dark" color="#00AF9B" @click="clickTag($event)">
                        Easy Note Number {{ easyNumber }}
                    </el-tag>
                </div>
                <div>
                    <el-tag class="ml-2 tag" type="warning" effect="dark" color="#FFB822" @click="clickTag($event)">
                        Medium Note Number {{ mediumNumber }}
                    </el-tag>
                </div>
                <div>
                    <el-tag class="ml-2 tag" type="danger" effect="dark" color="#FF2D55" @click="clickTag($event)">
                        Hard Note Number {{ hardNumber }}
                    </el-tag>
                </div>
                <div>
                    <el-tag class="ml-2 tag" type="" effect="dark" color="#AF52DE" @click="clickTag($event)">
                        All Note Number {{ allNumber }}
                    </el-tag>
                </div>
            </el-scrollbar>
        </el-aside>
        <el-main>
            <el-scrollbar class="scrollbar">
                <component class="markdown-body" v-bind:is="markdownList[markdownName]"/>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'

// 存储所有获取到的 Markdown 文件
let markdownList = {}

// 配置 Markdown 文件导出为组件
const configureComponent = (component, list) => {
    component.keys().forEach(fileName => {
        // 获取文件名
        let name = fileName.split('/').pop().replace(/\.\w+$/, '')
        // 存储文件名
        list.push(name)
        // 获取组件配置
        const config = component(fileName)
        // 若该组件是通过 export default 导出的, 优先使用 .default, 否则使用模块的根
        markdownList[name] = config.default || config
    })
}

// 查询文件夹中的 Markdown 文件, true 同时查询子目录, 正则表达式匹配 .md 文件
const helloComponent = require.context('../../markdown/hello', true, /\.md$/)
const easyComponent = require.context('../../markdown/easy', true, /\.md$/)
const mediumComponent = require.context('../../markdown/medium', true, /\.md$/)
const hardComponent = require.context('../../markdown/hard', true, /\.md$/)

// 存储各个子文件夹下的 Markdown 文件的文件名
let helloList = []
let easyList = []
let mediumList = []
let hardList = []

// 所有 Markdown 文件的文件名
let allList = []

// 配置 Markdown 组件
configureComponent(helloComponent, helloList)
configureComponent(easyComponent, easyList)
configureComponent(mediumComponent, mediumList)
configureComponent(hardComponent, hardList)

// 拼接侧边栏需要的文件名列表
allList = allList.concat(helloList, easyList, mediumList, hardList)

// 文件名排序
allList = allList.sort()

// 统计不同难度题目的笔记数量
let easyNumber = easyList.length
let mediumNumber = mediumList.length
let hardNumber = hardList.length

// 所有笔记的数量
let allNumber = easyNumber + mediumNumber + hardNumber

// 默认显示欢迎页
let hello = '0000.Hello'

// 当前 Markdown 文件的名称
let markdownName = ref(hello)

// 侧边栏切换 Markdown 文件
const chooseMarkdown = (name) => {
    markdownName.value = name
}

// 点击 Tag 标签触发通知
const clickTag = (e) => {
    // 获取 el-tag 标签上的文本
    let text = e.currentTarget.children[0].outerText
    // 通知上文本的颜色
    let color = ''
    // 通知类型
    let type = ''

    // 判断点击标签的文本开头
    switch (text.split(' ')[0]) {
        case 'Easy':
            color = '#00AF9B'
            type = 'success'
            break
        case 'Medium':
            color = '#FFB822'
            type = 'warning'
            break
        case 'Hard':
            color = '#FF2D55'
            type = 'error'
            break
        case 'All':
            color = '#AF52DE'
            type = 'info'
            break
        default:
            break
    }

    // 弹出 el-notification 通知
    ElNotification({
        dangerouslyUseHTMLString: true,
        message: '<span style="color: ' + color + ';">' + text + '</span>',
        type: type,
        showClose: false,
        duration: 5000
    })
}

// 禁用浏览器的滚动条
document.body.style.overflow = 'hidden'
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

.scrollbar {
    height: calc(100vh - 40px);
}
</style>
