import { defineConfig } from 'vitepress'
import vitepressProtectPlugin from "vitepress-protect-plugin"

const base = '/'
export default defineConfig({
  vite: {
    plugins: [
      vitepressProtectPlugin({
        disableF12: true, // 禁用F12开发者模式
        disableCopy: true, // 禁用文本复制
        disableSelect: false, // 禁用文本选择
      }),
    ],
  },
  //markdown配置
  markdown: {
    lineNumbers: true,
    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
  },
  //多语言 (新建一个en文件夹，将docs下面的md文件[如index.md、study文件夹]复制进去即可)
  locales: {
    root: {
      label: '简体中文',
      lang: 'Zh_CN',
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
    },
  },
  base,
  title: "YONG",
  description: "这是我的博客",
  cleanUrls: true,// 清除.html后缀
  lastUpdated: true,
  themeConfig: {
    logo: 'https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/avatar.jpg',
    siteTitle: 'YONG',
    search: {
      provider: "local",
    },
    footer: {
      message: '©2025 <a href="https://github.com/userwanyong">YONG</a>. All rights reserved.',
      copyright: 'Contact me: 2026804718@qq.com</a>'
    },
    //侧边栏文字更改(移动端) 默认 Menu //
    sidebarMenuLabel:'目录',
    //返回顶部文字修改 默认 Return to top //
    returnToTopLabel:'返回顶部',
    //编辑本页 //
    editLink: {
      pattern: 'https://github.com/userwanyong/userwanyong.github.io', // 改成自己的仓库
      text: '在GitHub编辑本页'
    },
    //上次更新时间 //
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'medium', // 可选值full、long、medium、short
        timeStyle: 'short' // 可选值full、long、medium、short
      },
    },
    //自定义上下页名 //
    docFooter: {
      prev: '上一章',
      next: '下一章',
    },
    outline: {
      level: [2, 5],// 右侧边栏显示2-5级标题
      label: '大纲' // 替换 On this page
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '教程',
        items: [
          {
            text: '组件',
            items: [
              { text: 'Elasticsearch', link: '/study/component/elasticsearch' },
              { text: 'RabbitMQ', link: '/study/component/rabbitmq' },
            ]
          },
          {
            text: '数据库',
            items: [
              { text: 'Mysql', link: '/study/database/mysql' },
              { text: 'Redis', link: '/study/database/redis' },
            ]
          },
        ],
      }
    ],
    sidebar: [
      {
        text: '组件',
        collapsed: false,
        items: [
          { text: 'Elasticsearch', link: '/study/component/elasticsearch' },
          { text: 'RabbitMQ', link: '/study/component/rabbitmq' },
        ]
      },
      {
        text: '数据库',
        collapsed: false,
        items: [
          { text: 'Mysql', link: '/study/database/mysql' },
          { text: 'Redis', link: '/study/database/redis' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/userwanyong' },
      { icon: 'gitee', link: 'https://gitee.com/user_wan' }
    ],
  }

})
