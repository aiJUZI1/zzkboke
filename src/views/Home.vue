<template>
  <div class="home" :class="currentTheme">
    <!-- 主题切换按钮 -->
    <div class="theme-switcher">
      <div class="theme-selector">
        <button 
          class="theme-trigger"
          @click="toggleThemeSelector"
          :title="getSeasonName(currentTheme)"
        >
          <div class="season-icon">
            {{ getSeasonIcon(currentTheme) }}
          </div>
          <span class="season-text">{{ getSeasonName(currentTheme) }}</span>
          <span class="dropdown-arrow">▼</span>
        </button>
        
        <div v-if="showThemeSelector" class="theme-options">
          <div 
            v-for="theme in themes" 
            :key="theme.id"
            class="theme-option"
            :class="{ active: currentTheme === theme.id }"
            @click="changeTheme(theme.id)"
          >
            <div class="option-icon">{{ theme.icon }}</div>
            <div class="option-info">
              <div class="option-name">{{ theme.name }}</div>
              <div class="option-desc">{{ theme.desc }}</div>
            </div>
            <div class="option-time">{{ theme.time }}</div>
          </div>
        </div>
      </div>
      
      <!-- 季节特效元素 -->
      <div class="season-effects">
        <!-- 樱花花瓣 - 春季 -->
        <div 
          v-if="currentTheme === 'spring'" 
          class="cherry-blossom"
          v-for="n in 15"
          :key="'petal-' + n"
          :style="getPetalStyle(n)"
        >🌸</div>
        
        <!-- 雪花 - 冬季 -->
        <div 
          v-if="currentTheme === 'winter'" 
          class="snowflake"
          v-for="n in 20"
          :key="'snow-' + n"
          :style="getSnowflakeStyle(n)"
        >❄️</div>
        
        <!-- 枫叶 - 秋季 -->
        <div 
          v-if="currentTheme === 'autumn'" 
          class="maple-leaf"
          v-for="n in 10"
          :key="'leaf-' + n"
          :style="getLeafStyle(n)"
        >🍁</div>
        
        <!-- 气泡 - 夏季 -->
        <div 
          v-if="currentTheme === 'summer'" 
          class="bubble"
          v-for="n in 8"
          :key="'bubble-' + n"
          :style="getBubbleStyle(n)"
        >🫧</div>
      </div>
    </div>

    <!-- 英雄区域 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            欢迎来到我的<span class="highlight">个人博客</span>
          </h1>
          <p class="hero-subtitle">
            记录前端开发、技术学习与生活思考的点滴
          </p>
          <div class="hero-actions">
            <router-link to="/blog" class="btn btn-primary">
              浏览文章
            </router-link>
            <router-link to="/about" class="btn btn-outline">
              关于作者
            </router-link>
            <button class="btn btn-special" @click="scrollToFortune">
              🕒 查看时辰吉时
            </button>
            <!-- 在英雄区域添加天气按钮 -->
<button class="btn btn-weather" @click="scrollToWeather">
  🌤️ 天气情绪
</button>
          </div>
        </div>
        <div class="hero-image">
          <div class="floating-element"></div>
        </div>
      </div>
    </section>

    <!-- ========== 时辰吉时区域 ========== -->
    <section class="fortune-section" id="fortune-section" ref="fortuneSection">
      <div class="container">
        <div class="section-header">
          <h2>🕒 时辰吉时</h2>
          <p>查看当前时辰运势与建议</p>
        </div>
        
        <!-- 时辰吉时组件 -->
        <div class="fortune-container">
          <!-- 时辰主面板 -->
          <div class="fortune-main" :class="currentHourClass">
            <div class="time-display">
              <div class="chinese-time">{{ chineseTime }}</div>
              <div class="current-time">{{ currentTime }}</div>
              <div class="date">{{ currentDate }}</div>
            </div>
            
            <div class="fortune-content">
              <!-- 时辰信息 -->
              <div class="hour-info">
                <div class="hour-name">{{ hourName }}</div>
                <div class="hour-range">{{ hourRange }}</div>
                <div class="animal-sign">{{ animalSign }}</div>
              </div>
              
              <!-- 吉凶指示 -->
              <div class="fortune-indicator">
                <div class="fortune-level" :class="fortuneLevel">
                  {{ fortuneText }}
                </div>
                <div class="fortune-score">
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: fortuneScore + '%' }"></div>
                  </div>
                  <span class="score-text">{{ fortuneScore }}分</span>
                </div>
              </div>
              
              <!-- 宜忌事项 -->
              <div class="recommendations">
                <div class="recommend-do">
                  <h4><span class="icon">✅</span> 宜</h4>
                  <ul>
                    <li v-for="(item, index) in recommendedActions" :key="'do-' + index">
                      {{ item }}
                    </li>
                  </ul>
                </div>
                <div class="recommend-avoid">
                  <h4><span class="icon">❌</span> 忌</h4>
                  <ul>
                    <li v-for="(item, index) in avoidActions" :key="'avoid-' + index">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
              
              <!-- 每日签文 -->
              <div class="daily-lottery">
                <div class="lottery-header">
                  <span class="icon">🎴</span>
                  <h4>今日签文</h4>
                </div>
                <div class="lottery-content">
                  <p class="lottery-text">{{ dailyFortune.text }}</p>
                  <p class="lottery-type">{{ dailyFortune.type }}</p>
                </div>
                <button class="draw-btn" @click="drawNewLottery" :disabled="hasDrawnToday">
                  {{ hasDrawnToday ? '已求签' : '🔮 求一签' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 时辰切换按钮 -->
          <div class="hour-selector">
            <button 
              v-for="hour in allHours" 
              :key="hour.id"
              class="hour-btn"
              :class="{ 
                active: currentHourId === hour.id,
                [hour.luck]: true 
              }"
              @click="selectHour(hour.id)"
              :title="`${hour.name} ${hour.range} (${hour.luck === 'good' ? '吉' : '凶'})`"
            >
              <span class="hour-icon">{{ hour.emoji }}</span>
              <span class="hour-label">{{ hour.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 在时辰区域后面添加 -->
<WeatherMood />
    <!-- 精选文章 -->
    <section class="featured">
      <div class="container">
        <div class="section-header">
          <h2>精选文章</h2>
          <p>最近发布的优质内容</p>
        </div>
        <div class="featured-grid">
          <div 
            v-for="blog in featuredBlogs" 
            :key="blog.id"
            class="featured-card"
            @click="goToBlog(blog.id)"
          >
            <div class="card-badge">{{ blog.category }}</div>
            <h3>{{ blog.title }}</h3>
            <p>{{ blog.excerpt }}</p>
            <div class="card-footer">
              <span>{{ blog.date }}</span>
              <div class="tags">
                <span v-for="tag in blog.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计数据 -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalPosts }}</div>
            <div class="stat-label">文章总数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalCategories }}</div>
            <div class="stat-label">分类数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalViews }}+</div>
            <div class="stat-label">累计阅读</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.daysOnline }}</div>
            <div class="stat-label">上线天数</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术栈 -->
    <section class="tech-stack">
      <div class="container">
        <div class="section-header">
          <h2>技术栈</h2>
          <p>项目使用的主要技术</p>
        </div>
        <div class="tech-grid">
          <div class="tech-item" v-for="tech in techStack" :key="tech.name">
            <div class="tech-icon" :style="{ backgroundColor: tech.color }">
              {{ tech.icon }}
            </div>
            <h4>{{ tech.name }}</h4>
            <p>{{ tech.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import WeatherMood from '@/views/WeatherMood.vue' // 添加这行

const router = useRouter()

const scrollToWeather = () => {
  document.getElementById('weather-section')?.scrollIntoView({ 
    behavior: 'smooth' 
  })
}
// ========== 你原有的主题相关代码 ==========
const currentTheme = ref('spring')
const showThemeSelector = ref(false)

const themes = ref([
  {
    id: 'spring',
    name: '春日樱花',
    desc: '粉色浪漫主题',
    icon: '🌸',
    time: '3-5月'
  },
  {
    id: 'summer',
    name: '夏日海洋',
    desc: '清爽蓝色主题',
    icon: '🌊',
    time: '6-8月'
  },
  {
    id: 'autumn',
    name: '秋日枫叶',
    desc: '温暖橙色主题',
    icon: '🍁',
    time: '9-11月'
  },
  {
    id: 'winter',
    name: '冬日雪景',
    desc: '纯净白色主题',
    icon: '❄️',
    time: '12-2月'
  }
])

// ========== 时辰吉时相关代码 ==========
const currentHourId = ref(1)
const currentTime = ref('')
const currentDate = ref('')
const hasDrawnToday = ref(false)
const dailyFortune = ref({})
const fortuneSection = ref(null)

// 时辰数据
const allHours = [
  { id: 1, name: '子', label: '子时', range: '23:00-01:00', emoji: '🐭', luck: 'good' },
  { id: 2, name: '丑', label: '丑时', range: '01:00-03:00', emoji: '🐂', luck: 'neutral' },
  { id: 3, name: '寅', label: '寅时', range: '03:00-05:00', emoji: '🐯', luck: 'good' },
  { id: 4, name: '卯', label: '卯时', range: '05:00-07:00', emoji: '🐇', luck: 'excellent' },
  { id: 5, name: '辰', label: '辰时', range: '07:00-09:00', emoji: '🐉', luck: 'good' },
  { id: 6, name: '巳', label: '巳时', range: '09:00-11:00', emoji: '🐍', luck: 'neutral' },
  { id: 7, name: '午', label: '午时', range: '11:00-13:00', emoji: '🐎', luck: 'good' },
  { id: 8, name: '未', label: '未时', range: '13:00-15:00', emoji: '🐐', luck: 'neutral' },
  { id: 9, name: '申', label: '申时', range: '15:00-17:00', emoji: '🐒', luck: 'excellent' },
  { id: 10, name: '酉', label: '酉时', range: '17:00-19:00', emoji: '🐓', luck: 'good' },
  { id: 11, name: '戌', label: '戌时', range: '19:00-21:00', emoji: '🐕', luck: 'neutral' },
  { id: 12, name: '亥', label: '亥时', range: '21:00-23:00', emoji: '🐖', luck: 'good' }
]

// 吉言库
const fortuneTexts = [
  { text: '龙马精神，万事亨通', type: '上上签' },
  { text: '紫气东来，福星高照', type: '上签' },
  { text: '时来运转，否极泰来', type: '中上签' },
  { text: '稳中求进，厚积薄发', type: '中签' },
  { text: '静心等待，必有转机', type: '中下签' },
  { text: '小心谨慎，防微杜渐', type: '下签' }
]

// 宜忌事项库
const actionLibrary = {
  do: [
    '写代码', '学习新技术', '整理笔记', '制定计划',
    '阅读书籍', '运动锻炼', '冥想思考', '与人交流',
    '整理房间', '烹饪美食', '听音乐', '规划项目',
    '修改BUG', '优化代码', '写博客', '学习英语'
  ],
  avoid: [
    '熬夜通宵', '与人争执', '匆忙决定', '暴饮暴食',
    '过度运动', '冲动消费', '拖延症', '分心多事',
    '情绪决策', '负能量', '三心二意', '半途而废'
  ]
}

// 计算属性
const currentHour = computed(() => allHours[currentHourId.value - 1])
const chineseTime = computed(() => `${currentHour.value.name}时`)
const hourName = computed(() => currentHour.value.label)
const hourRange = computed(() => currentHour.value.range)
const animalSign = computed(() => `生肖：${currentHour.value.emoji}`)
const currentHourClass = computed(() => `hour-${currentHour.value.name}`)

// 吉凶等级
const fortuneLevel = computed(() => {
  const luck = currentHour.value.luck
  return {
    excellent: 'best',
    good: 'good', 
    neutral: 'neutral',
    bad: 'bad'
  }[luck] || 'neutral'
})

const fortuneText = computed(() => {
  const levels = {
    excellent: '大吉',
    good: '吉',
    neutral: '平',
    bad: '凶'
  }
  return levels[currentHour.value.luck] || '平'
})

const fortuneScore = computed(() => {
  const scores = {
    excellent: 90,
    good: 75,
    neutral: 60,
    bad: 40
  }
  return scores[currentHour.value.luck] || 60
})

// 宜忌事项（随机生成）
const recommendedActions = computed(() => {
  const count = Math.floor(Math.random() * 3) + 2
  return [...actionLibrary.do]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
})

const avoidActions = computed(() => {
  const count = Math.floor(Math.random() * 3) + 2
  return [...actionLibrary.avoid]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
})

// ========== 时辰相关方法 ==========
const updateTime = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  
  // 转换为时辰（简化版）
  currentHourId.value = Math.floor((hours + 1) / 2) + 1
  if (currentHourId.value > 12) currentHourId.value = 1
  
  // 格式化时间
  currentTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
}

const selectHour = (hourId) => {
  currentHourId.value = hourId
}

const drawNewLottery = () => {
  if (hasDrawnToday.value) return
  
  const randomIndex = Math.floor(Math.random() * fortuneTexts.length)
  dailyFortune.value = fortuneTexts[randomIndex]
  hasDrawnToday.value = true
  
  // 保存到本地存储，一天只能抽一次
  const today = new Date().toDateString()
  localStorage.setItem('lastLotteryDate', today)
  localStorage.setItem('dailyFortune', JSON.stringify(dailyFortune.value))
}
const weatherSection = ref(null) // 添加这行

const scrollToFortune = () => {
  if (fortuneSection.value) {
    fortuneSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// ========== 你原有的方法 ==========
const toggleThemeSelector = () => {
  showThemeSelector.value = !showThemeSelector.value
}

const changeTheme = (themeId) => {
  currentTheme.value = themeId
  showThemeSelector.value = false
  
  // 保存到本地存储
  localStorage.setItem('blog-theme', themeId)
  
  // 添加切换动画
  document.documentElement.classList.add('theme-transition')
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition')
  }, 500)
}

const getSeasonIcon = (themeId) => {
  const theme = themes.value.find(t => t.id === themeId)
  return theme ? theme.icon : '🌸'
}

const getSeasonName = (themeId) => {
  const theme = themes.value.find(t => t.id === themeId)
  return theme ? theme.name : '春日樱花'
}

const getPetalStyle = (index) => {
  const delay = (index * 0.2) % 3
  const duration = 8 + Math.random() * 10
  const left = Math.random() * 100
  const size = 20 + Math.random() * 15
  
  return {
    left: `${left}%`,
    fontSize: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const getSnowflakeStyle = (index) => {
  const delay = (index * 0.3) % 4
  const duration = 10 + Math.random() * 15
  const left = Math.random() * 100
  const size = 12 + Math.random() * 10
  
  return {
    left: `${left}%`,
    fontSize: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const getLeafStyle = (index) => {
  const delay = (index * 0.4) % 5
  const duration = 12 + Math.random() * 8
  const left = Math.random() * 100
  const size = 18 + Math.random() * 12
  
  return {
    left: `${left}%`,
    fontSize: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const getBubbleStyle = (index) => {
  const delay = (index * 0.5) % 3
  const duration = 6 + Math.random() * 6
  const left = Math.random() * 100
  const size = 15 + Math.random() * 10
  
  return {
    left: `${left}%`,
    fontSize: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const goToBlog = (id) => {
  router.push(`/blog/${id}`)
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.theme-selector')) {
    showThemeSelector.value = false
  }
}

// ========== 你原有的数据 ==========
const featuredBlogs = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    excerpt: '深入理解Vue 3的Composition API，从基础到高级应用',
    date: '2025-12-21',
    category: 'Vue',
    tags: ['Vue 3', 'Composition API', '前端']
  },
  {
    id: 2,
    title: 'TypeScript在Vue项目中的最佳实践',
    excerpt: '分享在Vue项目中高效使用TypeScript的经验和技巧',
    date: '2025-12-20',
    category: 'TypeScript',
    tags: ['TypeScript', 'Vue', '类型安全']
  },
  {
    id: 3,
    title: '现代CSS布局完全指南',
    excerpt: 'Flexbox、Grid等现代CSS布局技术的详细指南',
    date: '2025-12-22',
    category: 'CSS',
    tags: ['CSS', '布局', '响应式']
  }
])

const stats = ref({
  totalPosts: 24,
  totalCategories: 6,
  totalViews: 1520,
  daysOnline: 365
})

const techStack = ref([
  {
    name: 'Vue 3',
    icon: 'Vue',
    color: '#42b883',
    description: '渐进式JavaScript框架'
  },
  {
    name: 'Vite',
    icon: '⚡',
    color: '#646cff',
    description: '下一代前端构建工具'
  },
  {
    name: 'TypeScript',
    icon: 'TS',
    color: '#3178c6',
    description: 'JavaScript的超集'
  },
  {
    name: 'Tailwind CSS',
    icon: 'TW',
    color: '#06b6d4',
    description: '实用优先的CSS框架'
  }
])

// ========== 生命周期 ==========
onMounted(() => {
  // 从本地存储加载主题
  const savedTheme = localStorage.getItem('blog-theme')
  if (savedTheme) {
    currentTheme.value = savedTheme
  }
  
  // 添加全局点击监听
  document.addEventListener('click', handleClickOutside)
  
  // 初始化时间
  updateTime()
  const timer = setInterval(updateTime, 1000)
  
  // 检查今日是否已抽签
  const today = new Date().toDateString()
  const lastDate = localStorage.getItem('lastLotteryDate')
  const savedFortune = localStorage.getItem('dailyFortune')
  
  if (lastDate === today && savedFortune) {
    hasDrawnToday.value = true
    dailyFortune.value = JSON.parse(savedFortune)
  } else {
    // 随机一个初始签文
    const randomIndex = Math.floor(Math.random() * fortuneTexts.length)
    dailyFortune.value = fortuneTexts[randomIndex]
  }
  
  onUnmounted(() => {
    clearInterval(timer)
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* ========== 你原有的所有样式保持不变 ========== */
.home {
  overflow-x: hidden;
  position: relative;
  transition: all 0.5s ease;
}

/* 主题切换器样式 */
.theme-switcher {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1000;
}

.theme-selector {
  position: relative;
}

.theme-trigger {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 2px solid var(--border-color);
  border-radius: 50px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-weight: 600;
  color: var(--text-color);
}

.theme-trigger:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-color);
}

.season-icon {
  font-size: 1.4rem;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.season-text {
  font-size: 0.9rem;
}

.dropdown-arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.theme-selector:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.theme-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px;
  min-width: 220px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color);
  animation: fadeInDown 0.3s ease;
}

.theme-option {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 12px;
}

.theme-option:hover {
  background: var(--surface-color);
  transform: translateX(-5px);
}

.theme-option.active {
  background: var(--primary-light);
}

.option-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--surface-color);
}

.option-info {
  flex: 1;
}

.option-name {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
}

.option-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.option-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background: var(--surface-color);
  padding: 2px 8px;
  border-radius: 12px;
}

/* 季节特效 */
.season-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.cherry-blossom {
  position: absolute;
  top: -50px;
  font-size: 24px;
  opacity: 0.7;
  animation: petalFall linear infinite;
  z-index: 1;
}

.snowflake {
  position: absolute;
  top: -30px;
  font-size: 18px;
  opacity: 0.9;
  animation: snowFall linear infinite;
  z-index: 1;
}

.maple-leaf {
  position: absolute;
  top: -40px;
  font-size: 22px;
  opacity: 0.8;
  animation: leafFall linear infinite;
  z-index: 1;
}

.bubble {
  position: absolute;
  bottom: -30px;
  font-size: 20px;
  opacity: 0.6;
  animation: bubbleRise linear infinite;
  z-index: 1;
}

@keyframes petalFall {
  0% {
    transform: translateY(-50px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes snowFall {
  0% {
    transform: translateY(-30px) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(100vh) translateX(100px);
    opacity: 0;
  }
}

@keyframes leafFall {
  0% {
    transform: translateY(-40px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) rotate(720deg) translateX(50px);
    opacity: 0;
  }
}

@keyframes bubbleRise {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100vh) scale(1.2);
    opacity: 0;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 主题样式 */
.home.spring {
  --primary-color: #ff9eb5;
  --primary-light: #ffe6ec;
  --primary-dark: #ff7c9c;
  --text-color: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --bg-color: #fff9fb;
  --surface-color: #fff0f5;
  --border-color: #ffd1dc;
}

.home.summer {
  --primary-color: #4fc3f7;
  --primary-light: #e1f5fe;
  --primary-dark: #039be5;
  --text-color: #0d47a1;
  --text-secondary: #1976d2;
  --text-tertiary: #64b5f6;
  --bg-color: #f3f9ff;
  --surface-color: #e3f2fd;
  --border-color: #bbdefb;
}

.home.autumn {
  --primary-color: #ff8a65;
  --primary-light: #ffebee;
  --primary-dark: #ff5722;
  --text-color: #4e342e;
  --text-secondary: #8d6e63;
  --text-tertiary: #bcaaa4;
  --bg-color: #fff8f0;
  --surface-color: #ffecb3;
  --border-color: #ffcc80;
}

.home.winter {
  --primary-color: #bbdefb;
  --primary-light: #f5f7fa;
  --primary-dark: #90a4ae;
  --text-color: #37474f;
  --text-secondary: #607d8b;
  --text-tertiary: #b0bec5;
  --bg-color: #f8fafc;
  --surface-color: #eceff1;
  --border-color: #cfd8dc;
}

/* 全局主题过渡 */
.theme-transition * {
  transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
}

/* 英雄区域 */
.hero {
  padding: 80px 0;
  position: relative;
  overflow: hidden;
  background: var(--bg-color);
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  animation: fadeInUp 0.8s ease;
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 24px;
  color: var(--text-color);
}

.highlight {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 20px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border-radius: var(--radius-md);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.btn-outline {
  background: transparent;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-3px);
}

.btn-special {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
}

.btn-special:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

.hero-image {
  position: relative;
  animation: fadeIn 1s ease;
}

.floating-element {
  width: 400px;
  height: 400px;
  background: linear-gradient(45deg, 
    rgba(255, 158, 181, 0.1), 
    rgba(255, 124, 156, 0.05));
  border-radius: 50%;
  position: relative;
  animation: float 6s ease-in-out infinite;
}

.home.summer .floating-element {
  background: linear-gradient(45deg, 
    rgba(79, 195, 247, 0.1), 
    rgba(3, 155, 229, 0.05));
}

.home.autumn .floating-element {
  background: linear-gradient(45deg, 
    rgba(255, 138, 101, 0.1), 
    rgba(255, 87, 34, 0.05));
}

.home.winter .floating-element {
  background: linear-gradient(45deg, 
    rgba(187, 222, 251, 0.1), 
    rgba(144, 164, 174, 0.05));
}

.floating-element::before {
  content: '';
  position: absolute;
  top: 50px;
  left: 50px;
  right: 50px;
  bottom: 50px;
  background: linear-gradient(45deg, 
    rgba(255, 158, 181, 0.2), 
    rgba(255, 124, 156, 0.1));
  border-radius: 50%;
}

.home.summer .floating-element::before {
  background: linear-gradient(45deg, 
    rgba(79, 195, 247, 0.2), 
    rgba(3, 155, 229, 0.1));
}

.home.autumn .floating-element::before {
  background: linear-gradient(45deg, 
    rgba(255, 138, 101, 0.2), 
    rgba(255, 87, 34, 0.1));
}

.home.winter .floating-element::before {
  background: linear-gradient(45deg, 
    rgba(187, 222, 251, 0.2), 
    rgba(144, 164, 174, 0.1));
}

/* ========== 时辰吉时区域样式 ========== */
.fortune-section {
  padding: 80px 0;
  background: var(--surface-color);
}

.fortune-container {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.fortune-main {
  padding: 30px;
  position: relative;
  overflow: hidden;
}

/* 不同时辰的背景色 */
.fortune-main.hour-子 { background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%); color: white; }
.fortune-main.hour-丑 { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); color: white; }
.fortune-main.hour-寅 { background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%); color: white; }
.fortune-main.hour-卯 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; }
.fortune-main.hour-辰 { background: linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%); color: #333; }
.fortune-main.hour-巳 { background: linear-gradient(135deg, #ffe259 0%, #ffa751 100%); color: #333; }
.fortune-main.hour-午 { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); color: white; }
.fortune-main.hour-未 { background: linear-gradient(135deg, #654ea3 0%, #eaafc8 100%); color: white; }
.fortune-main.hour-申 { background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%); color: white; }
.fortune-main.hour-酉 { background: linear-gradient(135deg, #cc2b5e 0%, #753a88 100%); color: white; }
.fortune-main.hour-戌 { background: linear-gradient(135deg, #42275a 0%, #734b6d 100%); color: white; }
.fortune-main.hour-亥 { background: linear-gradient(135deg, #141e30 0%, #243b55 100%); color: white; }

.time-display {
  text-align: center;
  margin-bottom: 30px;
}

.chinese-time {
  font-size: 3rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 5px;
  font-family: 'STKaiti', '楷体', serif;
}

.current-time {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 5px;
}

.date {
  font-size: 0.9rem;
  opacity: 0.8;
}

.fortune-content {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
}

.hour-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.hour-name {
  font-size: 1.8rem;
  font-weight: bold;
}

.hour-range {
  font-size: 1rem;
}

.animal-sign {
  font-size: 1.3rem;
}

.fortune-indicator {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.fortune-level {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.fortune-level.best { color: #ffd700; }
.fortune-level.good { color: #4cd964; }
.fortune-level.neutral { color: #5ac8fa; }
.fortune-level.bad { color: #ff6b6b; }

.fortune-score {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #4cd964, #5ac8fa);
  transition: width 1s ease;
}

.score-text {
  font-weight: bold;
  min-width: 50px;
}

.recommendations {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.recommend-do, .recommend-avoid {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.recommend-do h4, .recommend-avoid h4 {
  margin-top: 0;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recommend-do ul, .recommend-avoid ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommend-do li, .recommend-avoid li {
  padding: 5px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.recommend-do li:last-child, .recommend-avoid li:last-child {
  border-bottom: none;
}

.daily-lottery {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  margin-bottom: 20px;
}

.lottery-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.lottery-text {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 10px 0;
  font-family: 'STKaiti', '楷体', serif;
}

.lottery-type {
  font-size: 0.85rem;
  opacity: 0.8;
  margin-bottom: 15px;
}

.draw-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.draw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.draw-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hour-selector {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 20px;
  background: var(--bg-color);
}

.hour-btn {
  background: var(--surface-color);
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 8px 5px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hour-btn:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
}

.hour-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-dark);
  box-shadow: 0 0 10px rgba(66, 184, 131, 0.3);
}

.hour-btn.good { border-bottom: 3px solid #4cd964; }
.hour-btn.excellent { border-bottom: 3px solid #ffd700; }
.hour-btn.neutral { border-bottom: 3px solid #5ac8fa; }
.hour-btn.bad { border-bottom: 3px solid #ff6b6b; }

.hour-icon {
  font-size: 1.5rem;
}

.hour-label {
  font-size: 0.8rem;
  font-weight: bold;
}

/* ========== 精选文章 ========== */
.featured {
  padding: 80px 0;
  background: var(--surface-color);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--text-color);
}

.section-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.featured-card {
  background: var(--bg-color);
  border-radius: var(--radius-lg);
  padding: 32px;
  cursor: pointer;
  transition: all 0.4s;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.featured-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.card-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--primary-color);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.featured-card h3 {
  font-size: 1.4rem;
  margin-bottom: 16px;
  color: var(--text-color);
  line-height: 1.4;
}

.featured-card p {
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.7;
}

.featured-card .card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.featured-card .tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.featured-card .tag {
  background: var(--surface-color);
  color: var(--text-secondary);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.featured-card:hover .tag {
  background: var(--primary-color);
  color: white;
}

/* 统计数据 */
.stats {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-item {
  padding: 30px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* 技术栈 */
.tech-stack {
  padding: 80px 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.tech-item {
  text-align: center;
  padding: 40px 20px;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  transition: all 0.3s;
}

.tech-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.tech-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}

.tech-item h4 {
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: var(--text-color);
}

.tech-item p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 响应式设计 */
@media (max-width: 992px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .floating-element {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
  
  .theme-switcher {
    top: 20px;
    right: 20px;
  }
  
  .chinese-time {
    font-size: 2.5rem;
  }
  
  .hour-selector {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 0;
  }
  
  .hero-title {
    font-size: 2.3rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 16px;
  }
  
  .btn {
    width: 100%;
  }
  
  .featured,
  .stats,
  .tech-stack,
  .fortune-section {
    padding: 60px 0;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .theme-trigger .season-text {
    display: none;
  }
  
  .theme-trigger {
    padding: 10px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  
  .recommendations {
    grid-template-columns: 1fr;
  }
  
  .hour-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .fortune-level {
    font-size: 1.5rem;
  }
  
  .hour-selector {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .featured-card {
    padding: 24px;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .theme-options {
    min-width: 200px;
    right: -60px;
  }
  
  .chinese-time {
    font-size: 2rem;
  }
  
  .hour-name {
    font-size: 1.5rem;
  }
}

/* 基础变量（补充） */
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.1);
}
.btn-weather {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
  border: none;
}

.btn-weather:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
}
</style>