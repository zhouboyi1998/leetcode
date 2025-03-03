<template>
    <el-container class="app-wrapper">
        <el-aside width="360px" class="sidebar-container">
            <el-scrollbar class="sidebar-scrollbar">
                <el-menu class="el-menu-vertical-demo"
                         unique-opened
                         :default-active="markdownName"
                         :active-text-color="activeTextColor">
                    <el-sub-menu index="hello" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon>
                                <Info :color="helloColor"/>
                            </el-icon>
                            <span class="sub-menu" :style="{ color: helloColor }">
                                LeetCode {{ allNumber }}
                            </span>
                        </template>
                        <el-menu-item v-for="name in helloList" :key="name" :index="name" @click="clickMenuItem(name)">
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="easy" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon>
                                <Mood :color="easyColor"/>
                            </el-icon>
                            <span class="sub-menu" :style="{ color: easyColor }">
                                Easy {{ easyNumber }}
                            </span>
                        </template>
                        <el-menu-item v-for="name in easyList" :key="name" :index="name" @click="clickMenuItem(name)">
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="medium" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon>
                                <SentimentNeutral :color="mediumColor"/>
                            </el-icon>
                            <span class="sub-menu" :style="{ color: mediumColor }">
                                Medium {{ mediumNumber }}
                            </span>
                        </template>
                        <el-menu-item v-for="name in mediumList" :key="name" :index="name" @click="clickMenuItem(name)">
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="hard" @click="clickSubMenu($event)">
                        <template #title>
                            <el-icon>
                                <MoodBad :color="hardColor"/>
                            </el-icon>
                            <span class="sub-menu" :style="{ color: hardColor }">
                                Hard {{ hardNumber }}
                            </span>
                        </template>
                        <el-menu-item
                            v-for="name in hardList" :key="name" :index="name"
                            @click="clickMenuItem(name)">
                            <span class="item">{{ name }}</span>
                        </el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <el-container>
            <el-header>
                <div class="header-right">
                    <el-tag class="ml-2 tag-one" type="info" effect="light" @click="clickTag($event)">
                        All {{ allNumber }}
                    </el-tag>
                    <el-tag class="ml-2 tag-two" type="success" effect="light" @click="clickTag($event)">
                        Easy {{ easyNumber }}
                    </el-tag>
                    <el-tag class="ml-2 tag-two" type="warning" effect="light" @click="clickTag($event)">
                        Medium {{ mediumNumber }}
                    </el-tag>
                    <el-tag class="ml-2 tag-two" type="danger" effect="light" @click="clickTag($event)">
                        Hard {{ hardNumber }}
                    </el-tag>
                    <ScreenFull/>
                </div>
            </el-header>
            <el-main>
                <el-scrollbar class="content-scrollbar" ref="contentScrollbar">
                    <component class="markdown-body" v-bind:is="markdownList[markdownName]"/>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useMarkdownStore } from '@/store/markdown'
import { ElNotification } from 'element-plus'
import Info from '~icons/material-symbols/info-rounded'
import Mood from '~icons/material-symbols/mood-rounded'
import SentimentNeutral from '~icons/material-symbols/sentiment-neutral-rounded'
import MoodBad from '~icons/material-symbols/mood-bad-rounded'
import ScreenFull from '@/views/header/ScreenFull'
import variable from '@/style/variable.module.scss'

// 获取 Pinia 仓库
const markdownStore = useMarkdownStore()

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

// 内容区当前显示的 Markdown 文件的名称
let markdownName = ref(markdownStore.name)

// 从 SCSS 中获取颜色
const helloColor = variable.helloColor
const easyColor = variable.easyColor
const mediumColor = variable.mediumColor
const hardColor = variable.hardColor

// 当前菜单项 (menu-item) 颜色
let activeTextColor = ref(markdownStore.color)

// 当前子菜单 (sub-menu) 颜色
let subMenuColor = markdownStore.color

// 侧边栏切换子菜单
const clickSubMenu = (e) => {
    let text = e.target.outerText
    let color = switchTextColor(text.split(' ')[0]).color
    if (color != null && color !== '') {
        // 保存当前选中的子菜单 (sub-menu) 颜色
        subMenuColor = color
    }
}

// 内容区滚动条
const contentScrollbar = ref(null)

// 重置内容区滚动条
const resetContentScrollbar = () => {
    if (contentScrollbar.value != null) {
        // 将内容区滚动条重置回顶部
        contentScrollbar.value.$el.querySelector('.el-scrollbar__wrap').scrollTop = 0
    }
}

// 侧边栏切换菜单项
const clickMenuItem = (name) => {
    // 保存当前选中的 Markdown 文件名和当前子菜单 (sub-menu) 颜色
    markdownStore.$patch({ name: name, color: subMenuColor })
    // 获取 Markdown 文件名
    markdownName.value = markdownStore.name
    // 点击子菜单并且点击菜单项后, 将当前菜单项 (menu-item) 颜色改变为当前子菜单 (sub-menu) 颜色
    activeTextColor.value = markdownStore.color

    // 重置内容区滚动条
    resetContentScrollbar()
}

// 点击 Tag 标签触发通知
const clickTag = (e) => {
    // 获取 el-tag 标签上的文本
    let text = e.currentTarget.children[0].outerText

    // 根据 text 文本的开头, 获取颜色、通知类型
    let { type, color } = switchTextColor(text.split(' ')[0])

    // 弹出 el-notification 通知
    ElNotification({
        // 通知内容
        message: '<span style="color: ' + color + ';">' + text + '</span>',
        // 是否将 message 属性作为 HTML 片段处理
        dangerouslyUseHTMLString: true,
        // 通知类型
        type: type,
        // 显示时间 (单位: 毫秒)
        duration: 5000,
        // 是否显示关闭按钮
        showClose: false,
        // 通知位置相对屏幕顶部的偏移量
        offset: 40
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
        case 'LeetCode':
            color = helloColor
            type = 'info'
            break
        case 'Easy':
            color = easyColor
            type = 'success'
            break
        case 'Medium':
            color = mediumColor
            type = 'warning'
            break
        case 'Hard':
            color = hardColor
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

<style scoped lang="scss">

</style>
