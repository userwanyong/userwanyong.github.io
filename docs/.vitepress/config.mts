import { defineConfig } from 'vitepress'

const base = '/blog/'
export default defineConfig({
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
      message: '©2025 <a href="https://github.com/userwanyong">TONG</a>. All rights reserved.',
      copyright: 'Contact me: 2026804718@qq.com</a>'
    },
    outline: {
      level: [2, 5],// 右侧边栏显示2-5级标题
      label: '页面导航' // 替换 On this page
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
