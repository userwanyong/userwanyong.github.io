import {defineConfig} from 'vitepress'
import vitepressProtectPlugin from "vitepress-protect-plugin"

const base = '/'
export default defineConfig({
    head: [
        ['link', {rel: 'icon', href: 'https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/logo.png'}],
        // Open Graph
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:site_name', content: 'YONG的博客' }],
        ['meta', { property: 'og:title', content: 'YONG - 技术博客与项目分享' }],
        ['meta', { property: 'og:description', content: '分享 Spring Boot、Java、数据库、中间件等技术文章，以及项目开发经验总结' }],
        ['meta', { property: 'og:image', content: 'https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/logo.png' }],
        ['meta', { property: 'og:url', content: 'https://userwanyong.github.io/' }],
        // Twitter Card
        ['meta', { name: 'twitter:card', content: 'summary' }],
        ['meta', { name: 'twitter:title', content: 'YONG - 技术博客与项目分享' }],
        ['meta', { name: 'twitter:description', content: '分享 Spring Boot、Java、数据库、中间件等技术文章，以及项目开发经验总结' }],
        ['meta', { name: 'twitter:image', content: 'https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/logo.png' }],
    ],
    vite: {
        plugins: [
            vitepressProtectPlugin({
                disableF12: false, // 是否禁用F12开发者模式
                disableCopy: false, // 是否禁用文本复制
                disableSelect: false, // 是否禁用文本选择
            }),
        ],
    },
    //markdown配置
    markdown: {
        // 组件插入h1标题下
        config: (md) => {
            md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
                let htmlResult = slf.renderToken(tokens, idx, options);
                if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`;
                return htmlResult;
            }
        },
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
    // lastUpdated: true,
    themeConfig: {
        logo: 'https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/logo.png',
        siteTitle: 'YONG',
        search: {
            provider: "local",
        },
        footer: {
            message: '©2026 <a href="https://github.com/userwanyong">YONG</a>. All rights reserved.',
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
        // lastUpdated: {
        //     text: '最后更新于',
        //     formatOptions: {
        //         dateStyle: 'medium', // 可选值full、long、medium、short
        //         timeStyle: 'short' // 可选值full、long、medium、short
        //     },
        // },
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
            {text: '🏠 我的主页', link: '/'},
            {
                text: '📚 我的文章',
                items: [
                    {
                        text: '🚅 教程',
                        items: [
                            {text: '📘 自定义 Spring Boot Starter', link: '/article/tutorial/custom-spring-boot-starter'},
                            {text: '📗 Maven 自动发包', link: '/article/tutorial/maven-publish-package'},
                            {text: '📙 Win11 安装 Wsl 与 Docker', link: '/article/tutorial/wsl-docker'},
                            {text: '📕 Github Page 自定义域名', link: '/article/tutorial/github-page'},
                            {text: '📗 EdgeOne 免费 CDN', link: '/article/tutorial/edgeone-cdn'},
                        ]
                    },
                    {
                        text: '🚉 八股小记',
                        items: [
                            {text: '📘 Java 八股汇总', link: '/article/eight-legged/java'},
                            {text: '📗 Mysql 八股汇总', link: '/article/eight-legged/mysql'},
                        ]
                    }
                ]
            },
            {
                text: '📝 技术文档',
                items: [
                    {
                        text: '📂 中间件',
                        items: [
                            {text: '🔍 Elasticsearch', link: '/study/component/elasticsearch'},
                            {text: '🔍 RabbitMQ', link: '/study/component/rabbitmq'},
                            {text: '🔍 Xxl-job', link: '/study/component/xxl-job'},
                        ]
                    },
                    {
                        text: '📂 数据库',
                        items: [
                            {text: '🔍 Mysql', link: '/study/database/mysql'},
                            {text: '🔍 Redis', link: '/study/database/redis'},
                        ]
                    },
                    {
                        text: '📂 实用工具',
                        items: [
                            {text: '🔍 Git', link: '/study/util/git'},
                        ]
                    },
                ],
            },
            {
                text: '🚴 项目经历',
                items: [
                    {
                        text: '🔗 项目',
                        items: [
                            {text: '🍎 幸运补给站', link: '/experience/project/marketing'},
                            {text: '🍑 灵犀AI助手', link: '/experience/project/ai-agent'},
                            {text: '🍅 CC 交互式入门', link: '/experience/project/claude-code'},
                            {text: '🍏 MCP 服务中心', link: '/experience/project/mcp-server'},
                        ]
                    },
                    {
                        text: '🔧 组件',
                        items: [
                            {text: '🍩 DCC 动态配置中心', link: '/experience/component/dcc'},
                            {text: '🍪 设计模式框架', link: '/experience/component/design-framework'},
                            {text: '🍰 动态限流组件', link: '/experience/component/rate-limiter'},
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
            '/article/': [
                {
                    text: '教程',
                    collapsed: false,
                    items: [
                        {text: '自定义 SpringBootStarter', link: '/article/tutorial/custom-spring-boot-starter'},
                        {text: 'Maven 自动发包', link: '/article/tutorial/maven-publish-package'},
                        {text: 'Win11 安装Wsl与Docker', link: '/article/tutorial/wsl-docker'},
                        {text: 'Github Page 自定义域名', link: '/article/tutorial/github-page'},
                        {text: 'EdgeOne 免费 CDN', link: '/article/tutorial/edgeone-cdn'},
                    ]
                },
                {
                    text: '八股小记',
                    collapsed: false,
                    items: [
                        {text: 'Java 八股汇总', link: '/article/eight-legged/java'},
                        {text: 'Mysql 八股汇总', link: '/article/eight-legged/mysql'},
                    ]
                }
            ],
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
                        {text: '幸运补给站', link: '/experience/project/marketing'},
                        {text: '灵犀AI助手', link: '/experience/project/ai-agent'},
                        {text: 'CC 交互式入门', link: '/experience/project/claude-code'},
                        {text: 'MCP 服务中心', link: '/experience/project/mcp-server'},
                    ]
                },
                {
                    text: '组件',
                    collapsed: false,
                    items: [
                        {text: 'DCC 动态配置中心', link: '/experience/component/dcc'},
                        {text: '设计模式框架', link: '/experience/component/design-framework'},
                        {text: '动态限流组件', link: '/experience/component/rate-limiter'},
                    ]
                }
            ],
        }
    }

})
