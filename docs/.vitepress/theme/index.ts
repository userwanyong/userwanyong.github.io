// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './hidden.css'
import './vp-code.css'
import './vp-code-group.css'
import MyLayout from './components/MyLayout.vue'
import Linkcard from "./components/Linkcard.vue"

export default {
    extends: DefaultTheme,
    Layout: MyLayout,
    enhanceApp({app}) {
        // 注册全局组件
        app.component('Linkcard' , Linkcard)
    }

}

