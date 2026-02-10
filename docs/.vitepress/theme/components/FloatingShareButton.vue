<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const showMenu = ref(false)
const showQRCode = ref(false)

// 获取当前页面信息
const pageTitle = computed(() => document.title)
const pageUrl = computed(() => window.location.href)
const encodedTitle = computed(() => encodeURIComponent(pageTitle.value))
const encodedUrl = computed(() => encodeURIComponent(pageUrl.value))

// 分享链接
const shareLinks = {
  weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl.value}&title=${encodedTitle.value}`,
  qq: `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl.value}&title=${encodedTitle.value}`,
  twitter: `https://twitter.com/intent/tweet?url=${encodedUrl.value}&text=${encodedTitle.value}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`
}

// 打开分享窗口
const openShare = (url: string) => {
  window.open(url, '_blank', 'width=600,height=500')
  showMenu.value = false
}

// 显示微信二维码
const showWeChatQR = () => {
  showQRCode.value = true
  showMenu.value = false
}

// 复制链接
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(pageUrl.value)
    showToast('链接已复制到剪贴板！')
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = pageUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast('链接已复制到剪贴板！')
  }
  showMenu.value = false
}

// 显示提示
const showToast = (message: string) => {
  const toast = document.createElement('div')
  toast.className = 'share-toast'
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.classList.add('show')
  }, 10)
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}

// 点击外部关闭菜单
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const menu = document.querySelector('.share-menu-list')
  const btn = document.querySelector('.floating-btn')

  if (showMenu.value && menu && !menu.contains(target) && !btn?.contains(target)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="floating-share">
    <!-- 悬浮按钮 -->
    <button class="floating-btn" @click.stop="showMenu = !showMenu" :class="{ active: showMenu }" title="分享">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="share-icon">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- 分享菜单列表 -->
    <Transition name="menu">
      <div v-if="showMenu" class="share-menu-list">
        <div class="menu-title">分享到</div>

        <div class="menu-items">
          <!-- 微信 -->
          <div class="menu-item" @click="showWeChatQR">
            <svg class="icon wechat" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
            </svg>
            <span>微信</span>
          </div>

          <!-- 微博 -->
          <div class="menu-item" @click="openShare(shareLinks.weibo)">
            <svg class="icon weibo" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.98 17.45c-3.17.39-5.86-1.12-5.99-3.37-.13-2.25 2.33-4.44 5.5-4.83 3.17-.39 5.86 1.12 5.99 3.37.13 2.25-2.33 4.44-5.5 4.83zm8.79-9.52c-.54-.18-1.1-.28-1.67-.3.34-.79.53-1.68.53-2.61 0-3.35-2.39-6.07-5.33-6.07-2.76 0-5.04 2.38-5.33 5.48-2.97.83-5.12 3.35-5.12 6.33 0 3.68 3.14 6.66 7 6.66s7-2.98 7-6.66c0-1.13-.31-2.19-.85-3.11.28-.08.56-.13.85-.13 1.66 0 3 1.34 3 3s-1.34 3-3 3c-.55 0-1.07-.15-1.51-.41-.39.79-.59 1.68-.59 2.61 0 3.35 2.39 6.07 5.33 6.07 2.76 0 5.04-2.38 5.33-5.48.31-3.36-1.89-6.28-4.84-6.38z"/>
            </svg>
            <span>微博</span>
          </div>

          <!-- QQ -->
          <div class="menu-item" @click="openShare(shareLinks.qq)">
            <svg class="icon qq" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.002 2c-5.028 0-9.106 4.043-9.106 9.031 0 4.016 2.682 7.406 6.395 8.563-.088-.657-.167-1.671.036-2.389.183-.637 1.177-4.987 1.177-4.987s-.301-.602-.301-1.492c0-1.398.811-2.444 1.821-2.444.859 0 1.274.645 1.274 1.418 0 .864-.55 2.156-.833 3.351-.237.999.503 1.814 1.491 1.814 1.79 0 3.167-1.887 3.167-4.606 0-2.406-1.732-4.088-4.207-4.088-3.07 0-4.87 2.303-4.87 4.684 0 .928.358 1.922.806 2.461.088.107.1.202.074.311l-.298 1.193c-.047.187-.196.227-.452.109-1.688-.786-2.741-3.254-2.741-5.237 0-4.264 3.099-8.186 8.938-8.186 4.693 0 8.34 3.344 8.34 7.813 0 4.661-2.939 8.408-7.017 8.408-1.37 0-2.658-.712-3.099-1.553l-.845 3.215c-.306 1.174-1.134 2.647-1.689 3.546 1.271.376 2.614.577 4.002.577 5.523 0 10-4.477 10-10s-4.477-10-10-10z"/>
              <path d="M8.5 14c.828 0 1.5-.672 1.5-1.5S9.328 11 8.5 11s-1.5.672-1.5 1.5S7.672 14 8.5 14zm7 0c.828 0 1.5-.672 1.5-1.5S16.328 11 15.5 11s-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"/>
            </svg>
            <span>QQ</span>
          </div>

          <!-- Twitter -->
          <div class="menu-item" @click="openShare(shareLinks.twitter)">
            <svg class="icon twitter" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Twitter</span>
          </div>

          <!-- Facebook -->
          <div class="menu-item" @click="openShare(shareLinks.facebook)">
            <svg class="icon facebook" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </div>

          <!-- LinkedIn -->
          <div class="menu-item" @click="openShare(shareLinks.linkedin)">
            <svg class="icon linkedin" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </div>

          <!-- 复制链接 -->
          <div class="menu-item" @click="copyLink">
            <svg class="icon copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>复制链接</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 微信二维码弹窗（保持居中弹窗） -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showQRCode" class="qrcode-overlay" @click="showQRCode = false">
          <div class="qrcode-modal" @click.stop>
            <div class="qrcode-title">扫码分享到微信</div>
            <div class="qrcode-container">
              <iframe :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`" frameborder="0"></iframe>
            </div>
            <div class="qrcode-close" @click="showQRCode = false">关闭</div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* 悬浮按钮 */
.floating-btn {
  position: fixed;
  bottom: 80px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.floating-btn:active {
  transform: scale(0.95);
}

.floating-btn.active {
  background: #059669;
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
}

/* 图标动画 */
.floating-btn .share-icon,
.floating-btn .close-icon {
  position: absolute;
  width: 24px;
  height: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-btn .share-icon {
  opacity: 1;
  transform: rotate(0deg) scale(1) translateY(0);
}

.floating-btn .close-icon {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8) translateY(10px);
}

.floating-btn.active .share-icon {
  opacity: 0;
  transform: rotate(90deg) scale(0.8) translateY(-10px);
  pointer-events: none;
}

.floating-btn.active .close-icon {
  opacity: 1;
  transform: rotate(0deg) scale(1) translateY(0);
}

/* 分享菜单列表 - 在按钮左侧弹出 */
.share-menu-list {
  position: fixed;
  bottom: 80px;
  right: 100px;
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
}

.menu-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  padding: 8px 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item:hover {
  background: var(--vp-c-bg-soft);
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* 图标颜色 */
.icon.wechat {
  color: #09BB07;
}

.icon.weibo {
  color: #E6162D;
}

.icon.qq {
  color: #12B7F5;
}

.icon.twitter {
  color: #1DA1F2;
}

.icon.facebook {
  color: #1877F2;
}

.icon.linkedin {
  color: #0A66C2;
}

.icon.copy {
  color: #666;
}

.menu-item span {
  font-size: 14px;
  color: var(--vp-c-text-1);
}

/* 二维码弹窗 */
.qrcode-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.qrcode-modal {
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.qrcode-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-align: center;
  margin-bottom: 16px;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.qrcode-container iframe {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}

.qrcode-close {
  text-align: center;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.qrcode-close:hover {
  background: var(--vp-c-bg-soft-hover);
}

/* Toast 提示 */
.share-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10001;
}

.share-toast.show {
  opacity: 1;
}

/* 菜单动画 */
.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .floating-btn {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
  }

  .share-menu-list {
    bottom: 90px;
    right: 20px;
    min-width: 180px;
  }

  .menu-item {
    padding: 8px 10px;
  }

  .icon {
    width: 18px;
    height: 18px;
  }

  .menu-item span {
    font-size: 13px;
  }
}
</style>
