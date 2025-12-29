<template>
  <div id="app">
    <!-- 现代化导航栏 -->
    <header class="header">
      <div class="container">
        <!-- Logo - 添加点击事件 -->
        <div 
          class="logo"
          @click="handleLogoClick"
          @mouseenter="showClickHint = true"
          @mouseleave="showClickHint = false"
        >
          <span class="logo-text">我的博客</span>
          <!-- 点击提示 -->
          <div v-if="showClickHint && clickCount > 0 && clickCount < 5" class="click-hint">
            ✨ 再点击 {{ 5 - clickCount }} 次有惊喜！
          </div>
        </div>
        
        <!-- 导航菜单 -->
        <nav class="nav">
          <router-link to="/" class="nav-link">
            <i class="icon-home"></i>
            <span>首页</span>
          </router-link>
          <router-link to="/blog" class="nav-link">
            <i class="icon-blog"></i>
            <span>文章</span>
          </router-link>
          <router-link to="/games" class="nav-link">
            <i class="icon-game"></i>
            <span>小游戏</span>
          </router-link>
          <router-link to="/about" class="nav-link">
            <i class="icon-about"></i>
            <span>关于</span>
          </router-link>
        </nav>
        
        <!-- 主题切换（可选） -->
        <button class="theme-toggle" @click="toggleTheme">
          <i class="icon-theme"></i>
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 现代化页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>我的博客</h4>
            <p>记录技术学习与生活感悟</p>
          </div>
          <div class="footer-section">
            <h4>联系我</h4>
            <div class="social-links">
              <a href="#" class="social-link">GitHub</a>
              <a href="#" class="social-link">邮箱:1172148901@qq.com</a>
              <a href="#" class="social-link">Twitter</a>
            </div>
          </div>
          <div class="footer-section">
            <p class="copyright">©2025 我的博客 · 保留所有权利</p>
          </div>
        </div>
      </div>
    </footer>

    <!-- ==================== 彩蛋区域 ==================== -->
    
    <!-- 彩蛋触发提示 -->
    <div v-if="showClickHint && clickCount === 5" class="easter-egg-triggered">
      🎉 彩蛋已触发！正在加载惊喜...
    </div>

    <!-- 彩蛋效果容器 -->
    <div v-if="easterEggActive" class="easter-egg-container">
      <!-- 烟花效果 -->
      <div 
        v-for="(firework, index) in fireworks" 
        :key="'firework-' + index"
        class="firework"
        :style="firework.style"
      >
        🎆
      </div>
      
      <!-- 星星效果 -->
      <div 
        v-for="(star, index) in stars" 
        :key="'star-' + index"
        class="star"
        :style="star.style"
      >
        ⭐
      </div>
      
      <!-- 彩弹效果 -->
      <div 
        v-for="(confetti, index) in confettiPieces" 
        :key="'confetti-' + index"
        class="confetti"
        :style="confetti.style"
      >
        {{ confetti.emoji }}
      </div>
      
      <!-- 彩蛋消息弹窗 -->
      <div class="egg-message-box" :class="{ show: showEggMessage }">
        <div class="egg-header">
          <h3>🎊 恭喜发现彩蛋！</h3>
          <button class="egg-close" @click="closeEasterEgg">✕</button>
        </div>
        <div class="egg-content">
          <p class="egg-title">你获得了「{{ eggTitle }}」</p>
          <p class="egg-desc">{{ eggDescription }}</p>
          
          <div class="egg-features">
            <div class="feature">
              <span class="feature-icon">✨</span>
              <span>全屏粒子特效</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🌈</span>
              <span>彩虹渐变背景</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🎵</span>
              <span>背景音乐</span>
            </div>
          </div>
          
          <div class="egg-actions">
            <button class="egg-btn primary" @click="applyEggEffects">
              应用效果
            </button>
            <button class="egg-btn secondary" @click="closeEasterEgg">
              暂时关闭
            </button>
            <button class="egg-btn music" @click="toggleMusic">
              {{ isMusicPlaying ? '🔊 关闭音乐' : '🔇 播放音乐' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 背景音乐 -->
    <audio ref="backgroundMusic" loop>
      <source src="https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 主题切换
const isDarkTheme = ref(false)

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.documentElement.setAttribute('data-theme', 
    isDarkTheme.value ? 'dark' : 'light'
  )
}

// ==================== 彩蛋功能 ====================
const clickCount = ref(0)
const lastClickTime = ref(0)
const showClickHint = ref(false)
const easterEggActive = ref(false)
const showEggMessage = ref(false)
const isMusicPlaying = ref(false)

// 彩蛋内容
const eggTitle = ref('隐藏的派对模式')
const eggDescription = ref('解锁了专属庆祝特效和背景音乐！')

// 特效数据
const fireworks = ref([])
const stars = ref([])
const confettiPieces = ref([])

// 背景音乐引用
const backgroundMusic = ref(null)

// 处理Logo点击
const handleLogoClick = (event) => {
  const now = Date.now()
  
  // 添加点击动画效果
  const logoElement = event.currentTarget
  logoElement.classList.add('logo-click')
  setTimeout(() => {
    logoElement.classList.remove('logo-click')
  }, 300)
  
  // 计算点击间隔
  if (now - lastClickTime.value < 800) { // 800ms内算快速点击
    clickCount.value++
    
    // 显示点击反馈
    createClickEffect(event.clientX, event.clientY, clickCount.value)
    
    // 5次触发彩蛋
    if (clickCount.value === 5) {
      activateEasterEgg()
    } else if (clickCount.value > 5) {
      clickCount.value = 0
    }
  } else {
    clickCount.value = 1
  }
  
  lastClickTime.value = now
}

// 创建点击效果
const createClickEffect = (x, y, count) => {
  // 创建涟漪效果
  const ripple = document.createElement('div')
  ripple.className = 'click-ripple'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.textContent = count
  document.body.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// 激活彩蛋
const activateEasterEgg = () => {
  console.log('🎉 彩蛋激活！')
  easterEggActive.value = true
  
  // 创建烟花
  createFireworks()
  
  // 创建星星
  createStars()
  
  // 创建彩带
  createConfetti()
  
  // 显示消息
  setTimeout(() => {
    showEggMessage.value = true
  }, 800)
  
  // 30秒后自动关闭
  setTimeout(() => {
    if (easterEggActive.value) {
      closeEasterEgg()
    }
  }, 30000)
}

// 创建烟花
const createFireworks = () => {
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      fireworks.value.push({
        id: Date.now() + i,
        style: {
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          fontSize: Math.random() * 30 + 20 + 'px',
          animationDelay: Math.random() * 2 + 's'
        }
      })
    }, i * 100)
  }
}

// 创建星星
const createStars = () => {
  for (let i = 0; i < 50; i++) {
    stars.value.push({
      id: Date.now() + i,
      style: {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        fontSize: Math.random() * 20 + 15 + 'px',
        animationDuration: Math.random() * 5 + 3 + 's',
        animationDelay: Math.random() * 2 + 's'
      }
    })
  }
}

// 创建彩带
const createConfetti = () => {
  const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '⭐', '🎆', '🎇', '🌈', '💥']
  
  for (let i = 0; i < 100; i++) {
    confettiPieces.value.push({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      style: {
        left: Math.random() * 100 + '%',
        top: '-50px',
        fontSize: Math.random() * 20 + 15 + 'px',
        animationDuration: Math.random() * 5 + 2 + 's',
        animationDelay: Math.random() * 1 + 's',
        color: `hsl(${Math.random() * 360}, 100%, 60%)`
      }
    })
  }
}

// 应用彩蛋效果
const applyEggEffects = () => {
  // 改变页面背景
  document.body.style.background = 'linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4, #a1c4fd)'
  document.body.style.backgroundSize = '400% 400%'
  document.body.style.animation = 'gradientBG 15s ease infinite'
  
  // 添加跳舞动画到导航链接
  document.querySelectorAll('.nav-link').forEach(el => {
    el.style.animation = 'dance 0.5s ease infinite alternate'
  })
}

// 切换音乐
const toggleMusic = () => {
  if (isMusicPlaying.value) {
    backgroundMusic.value.pause()
  } else {
    backgroundMusic.value.play().catch(e => {
      console.log('音乐播放失败:', e)
      // 如果自动播放被阻止，显示提示
      const playMusic = confirm('浏览器阻止了自动播放，点击确认后，请手动点击播放音乐按钮')
      if (playMusic) {
        isMusicPlaying.value = false
      }
    })
  }
  isMusicPlaying.value = !isMusicPlaying.value
}

// 关闭彩蛋
const closeEasterEgg = () => {
  easterEggActive.value = false
  showEggMessage.value = false
  fireworks.value = []
  stars.value = []
  confettiPieces.value = []
  clickCount.value = 0
  
  // 恢复页面样式
  document.body.style.background = ''
  document.body.style.animation = ''
  
  document.querySelectorAll('.nav-link').forEach(el => {
    el.style.animation = ''
  })
  
  // 停止音乐
  if (backgroundMusic.value) {
    backgroundMusic.value.pause()
    backgroundMusic.value.currentTime = 0
  }
  isMusicPlaying.value = false
}
</script>

<style>
/* ========== 全局样式重置 ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* 浅色主题变量 */
  --primary-color: #42b883;
  --primary-dark: #2c3e50;
  --bg-color: #ffffff;
  --surface-color: #f8f9fa;
  --text-color: #2c3e50;
  --text-secondary: #5c6b7e;
  --border-color: #eaeaea;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.12);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

[data-theme="dark"] {
  /* 深色主题变量 */
  --primary-color: #42d392;
  --primary-dark: #1a1a1a;
  --bg-color: #0f0f0f;
  --surface-color: #1a1a1a;
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: #2a2a2a;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.5);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  transition: background-color 0.3s, color 0.3s;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ========== 容器 ========== */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ========== 导航栏样式 ========== */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s;
}

[data-theme="dark"] .header {
  background-color: rgba(26, 26, 26, 0.95);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 24px;
}

/* Logo样式 */
.logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s;
}

/* 导航菜单 */
.nav {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  opacity: 0;
  transition: opacity 0.3s;
  z-index: -1;
}

.nav-link:hover {
  color: var(--primary-color);
  transform: translateY(-2px);
}

.nav-link:hover::before {
  opacity: 0.1;
}

.nav-link.router-link-active {
  color: var(--primary-color);
  background-color: rgba(66, 184, 131, 0.1);
  box-shadow: var(--shadow-sm);
}

.nav-link.router-link-active::before {
  opacity: 0;
}

/* 图标样式 */
.nav-link i {
  font-style: normal;
}

.icon-home::before { content: "🏠"; }
.icon-blog::before { content: "📝"; }
.icon-game::before { content: "🎮"; }
.icon-about::before { content: "👤"; }
.icon-theme::before { content: "🌙"; }

/* 主题切换按钮 */
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--surface-color);
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.theme-toggle:hover {
  transform: rotate(30deg);
  background: var(--primary-color);
  color: white;
  box-shadow: var(--shadow-md);
}

/* ========== 主要内容区域 ========== */
.main {
  flex: 1;
  padding: 40px 0;
}

/* ========== 页脚样式 ========== */
.footer {
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h4 {
  color: var(--text-color);
  margin-bottom: 16px;
  font-size: 1.1rem;
}

.footer-section p {
  color: var(--text-secondary);
  line-height: 1.8;
}

.social-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.social-link {
  color: var(--text-secondary);
  text-decoration: none;
  padding: 6px 0;
  position: relative;
  transition: color 0.3s;
}

.social-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s;
}

.social-link:hover {
  color: var(--primary-color);
}

.social-link:hover::after {
  width: 100%;
}

.copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* ========== 路由过渡动画 ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .header .container {
    height: 60px;
    padding: 0 16px;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .nav-link {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-link i {
    font-size: 1.2rem;
  }
  
  .main {
    padding: 20px 0;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .nav {
    gap: 4px;
  }
  
  .nav-link {
    padding: 8px 12px;
  }
}

/* ==================== 彩蛋相关样式 ==================== */

/* Logo点击动画 */
.logo-click {
  animation: logoBounce 0.3s ease;
}

@keyframes logoBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.9); }
}

/* 点击提示 */
.click-hint {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  white-space: nowrap;
  animation: fadeInUp 0.3s ease;
  z-index: 1001;
  margin-top: 8px;
  box-shadow: var(--shadow-sm);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 点击涟漪效果 */
.click-ripple {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  pointer-events: none;
  z-index: 9999;
  animation: ripple 0.6s ease-out;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(66, 184, 131, 0.5);
}

@keyframes ripple {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* 彩蛋触发提示 */
.easter-egg-triggered {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 12px 20px;
  border-radius: var(--radius-md);
  animation: slideInRight 0.5s ease;
  z-index: 10001;
  box-shadow: var(--shadow-md);
  font-weight: 500;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 彩蛋容器 */
.easter-egg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
  overflow: hidden;
}

/* 烟花效果 */
.firework {
  position: absolute;
  font-size: 24px;
  opacity: 0.8;
  animation: fireworkExplode 1.5s ease-out infinite;
  pointer-events: none;
}

@keyframes fireworkExplode {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(3) rotate(360deg);
    opacity: 0;
  }
}

/* 星星效果 */
.star {
  position: absolute;
  animation: starTwinkle 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 彩带效果 */
.confetti {
  position: absolute;
  animation: confettiFall linear infinite;
  pointer-events: none;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-50px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 彩蛋消息框 */
.egg-message-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  pointer-events: auto;
  opacity: 0;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10000;
}

[data-theme="dark"] .egg-message-box {
  background: var(--surface-color);
  color: var(--text-color);
}

.egg-message-box.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.egg-header {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.egg-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.egg-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.egg-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.egg-content {
  padding: 24px;
}

.egg-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 8px;
}

.egg-desc {
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.6;
}

.egg-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--surface-color);
  border-radius: var(--radius-md);
  text-align: center;
}

.feature-icon {
  font-size: 1.5rem;
}

.egg-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.egg-btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.egg-btn.primary {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.egg-btn.secondary {
  background: var(--surface-color);
  color: var(--text-color);
  border: 2px solid var(--border-color);
}

.egg-btn.music {
  background: #ff6b6b;
  color: white;
}

.egg-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 背景渐变动画 */
@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 跳舞动画 */
@keyframes dance {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-5px);
  }
}

/* 彩蛋响应式调整 */
@media (max-width: 768px) {
  .egg-message-box {
    width: 95%;
    max-width: 400px;
  }
  
  .egg-actions {
    flex-direction: column;
  }
  
  .egg-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .egg-message-box {
    max-width: 320px;
  }
  
  .egg-header {
    padding: 16px;
  }
  
  .egg-header h3 {
    font-size: 1.2rem;
  }
  
  .egg-content {
    padding: 16px;
  }
  
  .egg-features {
    grid-template-columns: 1fr;
  }
  
  .easter-egg-triggered {
    font-size: 0.9rem;
    padding: 10px 16px;
  }
}
</style>