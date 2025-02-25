// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './hidden.css'
import MyLayout from './components/MyLayout.vue'
import 'nprogress-v2/dist/index.css' // 进度条样式

export default {
    extends: DefaultTheme,
    Layout: MyLayout,

}

