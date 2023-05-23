import { defineStore } from 'pinia'
import variable from '@/style/variable.module.scss'

// 获取 SCSS 变量
const helloColor = variable.helloColor

export const useMarkdownStore = defineStore('MARKDOWN', {
    state: () => ({
        name: '0000.Hello',
        color: helloColor
    }),
    getters: {},
    actions: {},
    persist: {
        enabled: true,
        strategies: [
            {
                storage: sessionStorage
            }
        ]
    }
})
