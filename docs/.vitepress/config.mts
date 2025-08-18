import { defineConfig } from 'vitepress'
import vitepressProtectPlugin from "vitepress-protect-plugin"

const base = '/'
export default defineConfig({
  head: [
    ['link', {rel: 'icon', href: 'https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/logo.png'}]
  ],
  vite: {
    plugins: [
      vitepressProtectPlugin({
        disableF12: false, // 是否禁用F12开发者模式
        disableCopy: true, // 是否禁用文本复制
        disableSelect: false, // 是否禁用文本选择
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
    // en: {
    //   label: 'English',
    //   lang: 'en',
    //   link: '/en/',
    // },
  },
  base,
  title: "YONG",
  description: "这是我的博客",
  cleanUrls: true,// 清除.html后缀
  lastUpdated: true,
  themeConfig: {
    logo: 'https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/logo.png',
    siteTitle: 'YONG',
    search: {
      provider: "local",
    },
    footer: {
      message: '©2025 <a href="https://github.com/userwanyong">YONG</a>. All rights reserved.',
      copyright: 'Contact me: 2026804718@qq.com</a>'
    },
    //侧边栏文字更改(移动端) 默认 Menu //
    sidebarMenuLabel: '目录',
    //返回顶部文字修改 默认 Return to top //
    returnToTopLabel: '返回顶部',
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
      {text: '我的主页', link: '/'},
      {
        text: '技术文档',
        items: [
          {
            text: '中间件',
            items: [
              {text: 'Elasticsearch', link: '/study/component/elasticsearch'},
              {text: 'RabbitMQ', link: '/study/component/rabbitmq'},
              {text: 'Xxl-job', link: '/study/component/xxl-job'},
            ]
          },
          {
            text: '数据库',
            items: [
              {text: 'Mysql', link: '/study/database/mysql'},
              {text: 'Redis', link: '/study/database/redis'},
            ]
          },
          {
            text: '实用工具',
            items: [
              {text: 'Git', link: '/study/util/git'},
            ]
          },
        ],
      },
      {
        text: '项目经历',
        items: [
          {
            text: '项目',
            items: [
              {text: '营动空间', link: '/experience/project/marketing'},
              {text: 'MCP 服务中心', link: '/experience/project/mcp-server'},
              {text: 'AI-Agent', link: '/experience/project/ai-agent'},
            ]
          },
          {
            text: '组件',
            items: [
              {text: 'DCC 动态配置中心', link: '/experience/component/dcc'},
            ]
          },
        ],
      }
    ],
    socialLinks: [
      {icon: 'github', link: 'https://github.com/userwanyong'},
      {icon: 'gitee', link: 'https://gitee.com/user_wan'}
    ],
    sidebar: {
      '/study/': [
        {
          text: '中间件',
          collapsed: false,
          items: [
            {text: 'Elasticsearch', link: '/study/component/elasticsearch'},
            {text: 'RabbitMQ', link: '/study/component/rabbitmq'},
            {text: 'Xxl-job', link: '/study/component/xxl-job'},
          ]
        },
        {
          text: '数据库',
          collapsed: false,
          items: [
            {text: 'Mysql', link: '/study/database/mysql'},
            {text: 'Redis', link: '/study/database/redis'},
          ]
        },
        {
          text: '实用工具',
          collapsed: false,
          items: [
            {text: 'Git', link: '/study/util/git'},
          ]
        }
      ],
      '/experience/': [
        {
          text: '项目',
          collapsed: false,
          items: [
            {text: '营动空间', link: '/experience/project/marketing'},
            {text: 'MCP 服务中心', link: '/experience/project/mcp-server'},
            {text: 'AI-Agent', link: '/experience/project/ai-agent'},
          ]
        },
        {
          text: '组件',
          collapsed: false,
          items: [
            {text: 'DCC 动态配置中心', link: '/experience/component/dcc'},
          ]
        }
      ],
    }
  }

})
