// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './hidden.css'
import MyLayout from './components/MyLayout.vue'

export default {
    extends: DefaultTheme,
    Layout: MyLayout,

}

