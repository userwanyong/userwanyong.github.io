# Claude Code 交互式快速入门

<img src="https://img.shields.io/badge/-Claude Code-FFA500" alt="" style="display: inline-block;margin-right: 2px"/>
<img src="https://img.shields.io/badge/-AI-8A2BE2" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-Cli-32CD32" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-编程工具-FF4500" alt="" style="display: inline-block;margin-right: 2px"/> 
<img src="https://img.shields.io/badge/-Vibe Coding-1E90FF" alt="" style="display: inline-block;margin-right: 2px"/> 


<Linkcard url="https://cc.wanyj.cn" title="体验地址" description="https://cc.wanyj.cn" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202508181539171.png"></Linkcard>
<Linkcard url="https://github.com/userwanyong/claude-code-interactive-tutorial" title="Github地址" description="https://github.com/userwanyong/claude-code-interactive-tutorial" logo="https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/202508181539171.png"></Linkcard>


## 1. 简介
一个交互式的 Claude Code 命令行学习平台，通过模拟真实终端环境帮助开发者快速掌握 Claude Code 的核心命令。



## 2. 特性

- 🖥️ **真实终端模拟** - 仿真的命令行界面，提供沉浸式学习体验
- 📚 **结构化学习模块** - 分步骤引导学习 Claude Code 内置命令
- 🏆 **成就系统** - 通过完成目标解锁徽章，激励持续学习
- 📊 **进度追踪** - 自动保存学习进度，随时继续学习
- 📱 **响应式设计** - 完美适配桌面端和移动端设备
- 💾 **本地存储** - 无需后端，所有数据存储在浏览器本地

## 3. 快速开始

### 3.1. 环境要求

- Node.js 18+ 或 20+
- npm 9+ 或 10+

### 3.2. 安装依赖

```bash
git clone https://github.com/yourusername/claude-code-interactive-tutorial.git
cd claude-code-interactive-tutorial
npm install
```

### 3.3. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 3.4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## 4. 学习模块

### 模块 1：内置命令

涵盖 Claude Code 的所有核心内置命令：

- `/config` - 打开配置界面
- `/clear` - 清除对话历史
- `/compact` - 压缩对话历史
- `/context` - 查看上下文使用情况
- `/cost` - 查看令牌使用统计
- `/doctor` - 检查安装健康状况
- `/export` - 导出对话
- `/help` - 获取帮助信息
- `/init` - 初始化项目
- `/mcp` - 管理 MCP 连接
- `/memory` - 编辑内存文件
- `/model` - 切换 AI 模型
- `/permissions` - 查看权限设置
- `/plan` - 进入规划模式
- `/resume` - 恢复会话
- `/stats` - 查看使用统计
- `/status` - 查看系统状态
- `/tasks` - 管理后台任务
- `/theme` - 切换主题
- `/todos` - 查看待办事项
- `/usage` - 查看订阅使用情况

## 5. 核心功能

### 5.1. 虚拟终端模拟器

- 仿真的命令行界面
- 支持命令输入和输出显示
- 预设命令快速执行
- 命令历史记录
- 清屏和复制功能

### 5.2. 学习进度追踪

- 实时显示整体完成进度
- 每个模块和步骤的完成状态
- 已掌握命令统计
- 数据自动保存到 localStorage

### 5.3. 成就系统

| 成就                | 描述                |
| ------------------- | ------------------- |
| 🎓 初学者           | 完成第一个学习模块  |
| 🌟 进阶学习者       | 完成 50% 的学习进度 |
| 👑 Claude Code 大师 | 完成所有学习模块    |
| 💻 第一次交互       | 成功执行第一条命令  |
| ⚡ 命令大师         | 掌握所有常用命令    |

## 6. 项目结构

```
claude-code-tutorial/
├── src/
│   ├── components/         # React 组件
│   │   ├── Terminal/      # 虚拟终端组件
│   │   ├── Sidebar/       # 侧边栏导航
│   │   ├── Module/        # 学习模块内容
│   │   ├── Progress/      # 进度和成就显示
│   │   ├── Layout/        # 布局组件
│   │   └── Help/         # 帮助系统
│   ├── hooks/            # 自定义 Hooks
│   │   ├── useTerminal.ts    # 终端逻辑
│   │   ├── useProgress.ts    # 进度管理
│   │   └── useStorage.ts    # 存储封装
│   ├── context/          # React Context
│   │   ├── AppContext.ts     # 应用全局状态
│   │   └── AppProvider.tsx   # Context 提供者
│   ├── data/             # 静态数据
│   │   ├── modules.ts         # 学习模块定义
│   │   ├── commands.ts        # 命令库
│   │   └── achievements.ts    # 成就定义
│   ├── types/            # TypeScript 类型定义
│   ├── App.tsx           # 主应用组件
│   └── main.tsx          # 应用入口
├── public/               # 静态资源
├── index.html            # HTML 入口
├── package.json          # 项目配置
├── vite.config.ts        # Vite 配置
└── tsconfig.json        # TypeScript 配置
```

## 7. 技术栈

- **React 19** - 用户界面框架
- **TypeScript 5.9** - 类型安全
- **Vite 7** - 构建工具
- **Tailwind CSS v4** - 样式框架
- **React Icons** - 图标库

## 8. 可用命令

| 命令                | 描述           |
| ------------------- | -------------- |
| `npm run dev`     | 启动开发服务器 |
| `npm run build`   | 构建生产版本   |
| `npm run preview` | 预览生产构建   |
| `npm run lint`    | 运行代码检查   |
