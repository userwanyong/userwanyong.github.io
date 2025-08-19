// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './hidden.css'
import './vp-code.css'
import './vp-code-group.css'
import './bubbles.css'
import './sidebarIcon.css'
import MyLayout from './components/MyLayout.vue'
import Linkcard from './components/Linkcard.vue'
import { NProgress } from 'nprogress-v2/dist/index.js' // 进度条组件
import 'nprogress-v2/dist/index.css' // 进度条样式
import { inBrowser } from 'vitepress'
import './rainbow.css';
import { watch } from 'vue';
import HomeUnderline from "./components/HomeUnderline.vue"
import confetti from "./components/confetti.vue"
import ArticleMetadata from "./components/ArticleMetadata.vue"
import busuanzi from 'busuanzi.pure.js'

// 彩虹背景动画样式
let homePageStyle: HTMLStyleElement | undefined

export default {
    extends: DefaultTheme,
    Layout: MyLayout,
    enhanceApp({app,router}) {
        // 注册全局组件
        app.component('Linkcard', Linkcard)
        app.component('HomeUnderline' , HomeUnderline)
        app.component('confetti' , confetti)
        app.component('ArticleMetadata' , ArticleMetadata)

        if (inBrowser) {
            router.onAfterRouteChanged = () => {
                busuanzi.fetch()
            }
            NProgress.configure({ showSpinner: false })
            router.onBeforeRouteChange = () => {
                NProgress.start() // 开始进度条
            }
            router.onAfterRouteChanged = () => {
                NProgress.done() // 停止进度条
            }
            // 彩虹背景动画样式
            if (typeof window !== 'undefined') {
                watch(
                    () => router.route.data.relativePath,
                    () => updateHomePageStyle(location.pathname === '/'),
                    { immediate: true },
                )
            }
        }
    }
}
// 彩虹背景动画样式
function updateHomePageStyle(value: boolean) {
    if (value) {
        if (homePageStyle) return

        homePageStyle = document.createElement('style')
        homePageStyle.innerHTML = `
    :root {
      animation: rainbow 12s linear infinite;
    }`
        document.body.appendChild(homePageStyle)
    } else {
        if (!homePageStyle) return

        homePageStyle.remove()
        homePageStyle = undefined
    }
}


