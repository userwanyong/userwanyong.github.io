import { defineConfig } from 'vitepress'

const base = '/'
export default defineConfig({
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
      label: '目录' // 替换 On this page
    },
    nav: [
      { text: '介绍', link: '/' },
      { text: '教程', link: '/study/elasticsearch' }
    ],
    sidebar: [
      {
        text: '组件',
        collapsed: false,
        items: [
          { text: 'Elasticsearch', link: '/study/elasticsearch' },
          { text: 'RabbitMQ', link: '/study/rabbitmq' },
        ]
      },
      {
        text: '数据库',
        collapsed: false,
        items: [
          { text: 'Mysql', link: '/study/mysql' },
          { text: 'Redis', link: '/study/redis' },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/userwanyong' },
      { icon: 'gitee', link: 'https://gitee.com/user_wan' }
    ],
  }

})
