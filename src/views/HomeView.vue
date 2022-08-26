<template>
    <el-container class="app-wrapper">
        <el-aside width="360px" class="sidebar-container">
            <el-scrollbar class="scrollbar">
                <el-menu
                    class="el-menu-vertical-demo"
                    unique-opened
                    :active-text-color="activeTextColor"
                >
                    <el-sub-menu index="hello" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon style="color: #AF52DE">
                                <InfoFilled/>
                            </el-icon>
                            <span class="sub-menu" style="color: #AF52DE">
                                Hello LeetCode {{ allNumber }}
                            </span>
                        </template>
                        <el-menu-item
                            v-for="name in helloList" :key="name" :index="name"
                            @click="clickMenuItem(name)"
                        >
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="easy" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon style="color: #00AF9B">
                                <SuccessFilled/>
                            </el-icon>
                            <span class="sub-menu" style="color: #00AF9B">
                                Easy Difficulty Note {{ easyNumber }}
                            </span>
                        </template>
                        <el-menu-item
                            v-for="name in easyList" :key="name" :index="name"
                            @click="clickMenuItem(name)"
                        >
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="medium" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon style="color: #FFB822">
                                <WarningFilled/>
                            </el-icon>
                            <span class="sub-menu" style="color: #FFB822">
                                Medium Difficulty Note {{ mediumNumber }}
                            </span>
                        </template>
                        <el-menu-item
                            v-for="name in mediumList" :key="name" :index="name"
                            @click="clickMenuItem(name)"
                        >
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="hard" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon style="color: #FF2D55">
                                <CircleCloseFilled/>
                            </el-icon>
                            <span class="sub-menu" style="color: #FF2D55">
                                Hard Difficulty Note {{ hardNumber }}
                            </span>
                        </template>
                        <el-menu-item
                            v-for="name in hardList" :key="name" :index="name"
                            @click="clickMenuItem(name)"
                        >
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
                <div>
                    <el-tag
                        class="ml-2 tag-one" type="info" effect="light" round
                        @click="clickTag($event)"
                    >
                        Hello LeetCode {{ allNumber }}
                    </el-tag>
                </div>
                <div>
                    <el-tag
                        class="ml-2 tag-two" type="success" effect="light" round
                        @click="clickTag($event)"
                    >
                        Easy Difficulty Note {{ easyNumber }}
                    </el-tag>
                </div>
                <div>
                    <el-tag
                        class="ml-2 tag-two" type="warning" effect="light" round
                        @click="clickTag($event)"
                    >
                        Medium Difficulty Note {{ mediumNumber }}
                    </el-tag>
                </div>
                <div>
                    <el-tag
                        class="ml-2 tag-two" type="danger" effect="light" round
                        @click="clickTag($event)"
                    >
                        Hard Difficulty Note {{ hardNumber }}
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
import {
    InfoFilled, SuccessFilled, WarningFilled, CircleCloseFilled
} from '@element-plus/icons-vue'

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

// 配置 Markdown 组件
configureComponent(helloComponent, helloList)
configureComponent(easyComponent, easyList)
configureComponent(mediumComponent, mediumList)
configureComponent(hardComponent, hardList)

// 统计不同难度题目的笔记数量
let easyNumber = easyList.length
let mediumNumber = mediumList.length
let hardNumber = hardList.length

// 所有笔记的数量
let allNumber = easyNumber + mediumNumber + hardNumber

// 欢迎页
let hello = '0000.Hello'

// 内容区当前显示的 Markdown 文件的名称 (默认显示 hello 欢迎页)
let markdownName = ref(hello)

let activeTextColor = ref('#AF52DE')

// 侧边栏切换子菜单
const clickSubMenu = (e) => {
    let text = e.target.outerText
    let color = switchTextColor(text.split(' ')[0]).color
    if (color != null && color !== '') {
        activeTextColor.value = color
    }
}

// 侧边栏切换菜单项
const clickMenuItem = (name) => {
    markdownName.value = name
}

// 点击 Tag 标签触发通知
const clickTag = (e) => {
    // 获取 el-tag 标签上的文本
    let text = e.currentTarget.children[0].outerText

    // 根据 text 文本的开头, 获取颜色、通知类型
    let { type, color } = switchTextColor(text.split(' ')[0])

    // 弹出 el-notification 通知
    ElNotification({
        dangerouslyUseHTMLString: true,
        message: '<span style="color: ' + color + ';">' + text + '</span>',
        type: type,
        showClose: false,
        duration: 5000
    })
}

// 按文本获取 ElementUI 相关信息
const switchTextColor = (text) => {
    // 文本颜色
    let color = ''
    // 通知类型
    let type = ''

    // 根据文本设置颜色、通知类型
    switch (text) {
        case 'All':
        case 'Hello':
            color = '#AF52DE'
            type = 'info'
            break
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
        default:
            break
    }

    return { type, color }
}

// 禁用浏览器的滚动条
document.body.style.overflow = 'hidden'
</script>

<style scoped>
/* 子菜单 */
.sub-menu {
    font-weight: bold;
    font-size: 16px;
}

/* 菜单项 */
.item {
    font-weight: bold;
    font-size: 16px;
}

/* 标签1 */
.tag-one {
    margin-left: 20px;
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    color: #AF52DE;
    background-color: rgba(175, 82, 222, .1);
}

/* 标签1: 鼠标悬停 */
.tag-one:hover {
    font-size: 15px;
    background-color: #FFFFFF;
}

/* 标签2 */
.tag-two {
    margin-left: 20px;
    margin-top: 20px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
}

/* 标签2: 鼠标悬停 */
.tag-two:hover {
    font-size: 15px;
    background-color: #FFFFFF;
}

/* 滚动条 */
.scrollbar {
    /* 计算 el-scrollbar 滚动条正确显示的高度 */
    height: calc(100vh - 40px);
}
</style>
