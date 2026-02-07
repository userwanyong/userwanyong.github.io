---
layout: home

hero:
  name: "👋 Hi , I'm ~YONG~"
  text: "My Personal Tech Blog"
  tagline: "ogether探索技术的奥秘，共同进步"
  image:
    src: https://markdown-my.oss-cn-beijing.aliyuncs.com/picture/logo.png
    alt: 个人头像
  actions:
    - theme: brand
      text: 开始探索
      link: /study/component/elasticsearch
    - theme: alt
      text: Git Hub
      link: https://github.com/userwanyong

features:
  - icon: 📚
    title: 文章专栏
    details: Maven 发包、自定义 Spring Boot Starter等
    link: /article/tutorial/custom-spring-boot-starter
  - icon: 📱
    title: 项目专栏
    details: 幸运补给站、灵犀AI助手、MCP服务中心等
    link: /experience/project/marketing
  - icon: 🚀
    title: 组件专栏
    details: 动态配置中心、设计模式框架、动态限流组件等
    link: /experience/component/dcc
  - icon: 🐰
    title: 中间件专栏
    details: Elasticsearch、RabbitMQ、Xxl-job等
    link: /study/component/elasticsearch
  - icon: 🗄️
    title: 数据库专栏
    details: Mysql、Redis等
    link: /study/database/mysql
  - icon: 🔍
    title: 实用工具专栏
    details: Git等
    link: /study/util/git
---

<HomeUnderline />
<confetti />

<div class="bubbles">
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
  <div class="bubble"></div>
</div>



<style>

@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0) scale(0.5);
    opacity: 0.2;
  }
  50% {
    transform: translateX(-20px) scale(0.8);
    opacity: 0.6;
  }
  100% {
    bottom: 1080px;
    transform: translateX(-40px) scale(1);
    opacity: 0;
  }
}

/* 标题文字渐变动画 */
.name {
  background-size: 200% auto;
  animation: shine 3s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

/* 按钮悬停效果 */
.VPButton {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.VPButton:hover {
  transform: translateY(-2px);
}

.VPButton.brand:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shine-button 1.5s infinite;
}

@keyframes shine-button {
  100% {
    left: 100%;
  }
}

/* 页面加载动画 */
.VPContent {
  animation: fadeIn 1s ease-in-out;
  position: relative;
  z-index: 1;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 特性卡片内容动画 */
.VPFeature .title, .VPFeature .details {
  transition: transform 0.3s ease;
}

.VPFeature:hover .title {
  transform: translateX(5px);
}

.VPFeature:hover .details {
  transform: translateX(3px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .VPFeature:hover {
    transform: translateY(-3px);
  }
}
</style>

<script>
// 页面加载完成后执行
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    // 添加鼠标跟随效果
  if (typeof document !== 'undefined') {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // 添加鼠标跟随样式
    // const style = document.createElement('style');
    // style.textContent = `
    //   .custom-cursor {
    //     position: fixed;
    //     width: 20px;
    //     height: 20px;
    //     border-radius: 50%;
    //     background-color: rgba(189, 52, 254, 0.3);
    //     pointer-events: none;
    //     transform: translate(-50%, -50%);
    //     z-index: 9999;
    //     transition: transform 0.1s, width 0.3s, height 0.3s, background-color 0.3s;
    //   }
    //  
    //   .custom-cursor.active {
    //     width: 40px;
    //     height: 40px;
    //     background-color: rgba(65, 209, 255, 0.2);
    //   }
    // `;
    // document.head.appendChild(style);
    
    // 鼠标移动时更新光标位置
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
    
    // 鼠标点击时添加动画效果
    document.addEventListener('mousedown', () => {
      cursor.classList.add('active');
    });
    
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('active');
    });
    
      // 为链接添加悬停效果
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
      });
      
      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
      });
    });
  }
  });
}
</script>



