<!-- src/views/WeatherMood.vue -->
<template>
  <section class="weather-mood-section" id="weather-section">
    <div class="container">
      <div class="section-header">
        <h2>🌤️ 天气情绪</h2>
        <p>根据天气和时辰推荐最佳状态</p>
      </div>
      
      <div class="weather-mood-container">
        <!-- 实时天气显示 -->
        <div class="weather-display" :class="weatherClass">
          <div class="weather-main">
            <div class="weather-icon">{{ weatherEmoji }}</div>
            <div class="weather-info">
              <div class="temperature">{{ temperature }}°C</div>
              <div class="weather-text">{{ weatherText }}</div>
              <div class="location">📍 {{ location }}</div>
            </div>
          </div>
          
          <!-- 天气详情 -->
          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-label">湿度</span>
              <span class="detail-value">{{ humidity }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">风速</span>
              <span class="detail-value">{{ windSpeed }} km/h</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">体感</span>
              <span class="detail-value">{{ feelsLike }}°C</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">能见度</span>
              <span class="detail-value">{{ visibility }} km</span>
            </div>
          </div>
        </div>
        
        <!-- 情绪状态推荐 -->
        <div class="mood-recommendation" :class="moodClass">
          <div class="mood-header">
            <h3>🎯 当前推荐</h3>
            <div class="mood-score">
              <div class="score-circle" :style="moodScoreStyle">
                <span>{{ moodScore }}分</span>
              </div>
            </div>
          </div>
          
          <div class="mood-content">
            <div class="mood-title">{{ moodTitle }}</div>
            <div class="mood-desc">{{ moodDescription }}</div>
            
            <div class="mood-tags">
              <span class="mood-tag" v-for="tag in moodTags" :key="tag">
                {{ tag }}
              </span>
            </div>
            
            <div class="recommendation-grid">
              <div class="recommend-card" v-for="(item, index) in recommendations" :key="index">
                <div class="card-icon">{{ item.emoji }}</div>
                <div class="card-content">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.desc }}</p>
                </div>
              </div>
            </div>
            
            <!-- 🎵 完善的学习音乐推荐 -->
            <div class="music-section">
              <h4>🎵 学习音乐推荐</h4>
              
              <!-- 音乐类型选择 -->
              <div class="music-categories">
                <button 
                  v-for="category in musicCategories" 
                  :key="category.id"
                  class="category-btn"
                  :class="{ active: currentCategory === category.id }"
                  @click="changeCategory(category.id)"
                >
                  <span class="category-icon">{{ category.icon }}</span>
                  <span class="category-name">{{ category.name }}</span>
                </button>
              </div>
              
              <!-- 音乐列表 -->
              <div class="music-list">
                <div 
                  v-for="(music, index) in filteredMusic" 
                  :key="music.id"
                  class="music-item"
                  :class="{ playing: currentMusicId === music.id }"
                >
                  <div class="music-info">
                    <div class="music-title">
                      <span class="music-icon">{{ music.emoji }}</span>
                      {{ music.name }}
                    </div>
                    <div class="music-meta">
                      <span class="music-duration">{{ music.duration }}</span>
                      <span class="music-tag">{{ music.tag }}</span>
                    </div>
                  </div>
                  <div class="music-actions">
                    <button 
                      class="play-btn"
                      @click="playMusic(music)"
                      :title="currentMusicId === music.id ? '暂停' : '播放'"
                    >
                      {{ currentMusicId === music.id && isPlaying ? '⏸️' : '▶️' }}
                    </button>
                    <button 
                      class="like-btn"
                      @click="toggleLike(music.id)"
                      :class="{ liked: likedMusic.includes(music.id) }"
                      title="收藏"
                    >
                      {{ likedMusic.includes(music.id) ? '❤️' : '🤍' }}
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- 音乐播放器 -->
              <div class="music-player" v-if="currentMusic">
                <div class="player-info">
                  <div class="player-title">{{ currentMusic.name }}</div>
                  <div class="player-artist">{{ currentMusic.artist }}</div>
                </div>
                <div class="player-controls">
                  <button class="player-btn prev-btn" @click="prevMusic">⏮️</button>
                  <button class="player-btn play-btn-main" @click="togglePlay">
                    {{ isPlaying ? '⏸️' : '▶️' }}
                  </button>
                  <button class="player-btn next-btn" @click="nextMusic">⏭️</button>
                </div>
                <div class="player-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                  </div>
                  <div class="progress-time">
                    {{ formatTime(currentTime) }} / {{ formatTime(currentMusic.durationInSeconds) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 心情日记 -->
        <div class="mood-journal">
          <h4>📝 记录此刻心情</h4>
          <textarea 
            v-model="currentMoodNote" 
            placeholder="记录下此刻的心情吧..."
            rows="3"
          ></textarea>
          <div class="journal-actions">
            <button class="save-btn" @click="saveMoodNote">
              💾 保存心情
            </button>
            <button class="share-btn" @click="shareMoodNote">
              📤 分享心情
            </button>
          </div>
          <div class="mood-history" v-if="moodHistory.length > 0">
            <div class="history-item" v-for="(note, index) in moodHistory.slice(0, 3)" :key="index">
              <span class="history-time">{{ note.time }}</span>
              <span class="history-text">{{ note.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 天气状态
const weatherEmoji = ref('☀️')
const temperature = ref(25)
const weatherText = ref('晴朗')
const location = ref('北京')
const humidity = ref(65)
const windSpeed = ref(12)
const feelsLike = ref(26)
const visibility = ref(10)

// 心情状态
const moodScore = ref(85)
const moodTitle = ref('精力充沛')
const moodDescription = ref('天气晴朗，温度适宜，是学习新技术的好时机！')
const moodTags = ref(['专注', '高效', '积极'])
const currentMoodNote = ref('')
const moodHistory = ref([])

// 推荐列表
const recommendations = ref([
  { emoji: '💻', title: '学习新技术', desc: '尝试学习Vue 3的新特性' },
  { emoji: '📝', title: '写技术博客', desc: '记录今天的学习心得' },
  { emoji: '🎨', title: '设计项目', desc: '优化现有项目的UI界面' },
  { emoji: '📚', title: '阅读书籍', desc: '阅读技术相关书籍' }
])

// 🎵 完善音乐数据
const musicCategories = ref([
  { id: 'focus', name: '专注学习', icon: '🎯', color: '#4cd964' },
  { id: 'coding', name: '编程音乐', icon: '💻', color: '#5ac8fa' },
  { id: 'chill', name: '放松休息', icon: '🌿', color: '#ffcc00' },
  { id: 'energy', name: '能量提升', icon: '⚡', color: '#ff6b6b' }
])

const musicList = ref([
  { 
    id: 1, 
    name: 'Lofi Coding', 
    artist: 'Lofi Girl', 
    emoji: '🎧', 
    duration: '2:15:30',
    durationInSeconds: 8130,
    tag: '专注',
    category: 'coding',
    bpm: 85
  },
  { 
    id: 2, 
    name: 'Deep Focus', 
    artist: 'Study Music', 
    emoji: '📚', 
    duration: '1:45:20',
    durationInSeconds: 6320,
    tag: '学习',
    category: 'focus',
    bpm: 70
  },
  { 
    id: 3, 
    name: 'Chill Vibes', 
    artist: 'Relaxation', 
    emoji: '🌿', 
    duration: '1:30:15',
    durationInSeconds: 5415,
    tag: '放松',
    category: 'chill',
    bpm: 60
  },
  { 
    id: 4, 
    name: 'Energy Boost', 
    artist: 'Productivity', 
    emoji: '⚡', 
    duration: '1:20:45',
    durationInSeconds: 4845,
    tag: '能量',
    category: 'energy',
    bpm: 120
  },
  { 
    id: 5, 
    name: 'Ambient Coding', 
    artist: 'Code Flow', 
    emoji: '💻', 
    duration: '2:30:00',
    durationInSeconds: 9000,
    tag: '编程',
    category: 'coding',
    bpm: 90
  },
  { 
    id: 6, 
    name: 'Study Session', 
    artist: 'Learn Fast', 
    emoji: '📝', 
    duration: '2:00:00',
    durationInSeconds: 7200,
    tag: '学习',
    category: 'focus',
    bpm: 75
  }
])

// 音乐播放状态
const currentCategory = ref('focus')
const currentMusicId = ref(1)
const currentMusic = ref(null)
const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(80)
const currentTime = ref(0)
const progress = ref(0)
const likedMusic = ref([1, 3])
const playTimer = ref(null)

// 计算属性
const weatherClass = computed(() => {
  const temp = temperature.value
  if (temp >= 30) return 'weather-hot'
  if (temp >= 20) return 'weather-warm'
  if (temp >= 10) return 'weather-cool'
  return 'weather-cold'
})

const moodClass = computed(() => {
  const score = moodScore.value
  if (score >= 80) return 'mood-excellent'
  if (score >= 60) return 'mood-good'
  if (score >= 40) return 'mood-normal'
  return 'mood-bad'
})

const moodScoreStyle = computed(() => {
  const hue = (moodScore.value / 100) * 120 // 0-120度，从红到绿
  return {
    background: `conic-gradient(hsl(${hue}, 100%, 50%) ${moodScore.value * 3.6}deg, #e0e0e0 0deg)`
  }
})

const filteredMusic = computed(() => {
  return musicList.value.filter(music => music.category === currentCategory.value)
})

// 方法
const changeCategory = (categoryId) => {
  currentCategory.value = categoryId
}

const playMusic = (music) => {
  if (currentMusicId.value === music.id && isPlaying.value) {
    pauseMusic()
  } else {
    currentMusicId.value = music.id
    currentMusic.value = music
    isPlaying.value = true
    currentTime.value = 0
    progress.value = 0
    
    // 模拟播放
    clearInterval(playTimer.value)
    playTimer.value = setInterval(() => {
      if (currentTime.value < music.durationInSeconds) {
        currentTime.value++
        progress.value = (currentTime.value / music.durationInSeconds) * 100
      } else {
        nextMusic()
      }
    }, 1000)
  }
}

const pauseMusic = () => {
  isPlaying.value = false
  clearInterval(playTimer.value)
}

const togglePlay = () => {
  if (!currentMusic.value) return
  isPlaying.value ? pauseMusic() : playMusic(currentMusic.value)
}

const nextMusic = () => {
  const currentIndex = filteredMusic.value.findIndex(m => m.id === currentMusicId.value)
  const nextIndex = (currentIndex + 1) % filteredMusic.value.length
  playMusic(filteredMusic.value[nextIndex])
}

const prevMusic = () => {
  const currentIndex = filteredMusic.value.findIndex(m => m.id === currentMusicId.value)
  const prevIndex = (currentIndex - 1 + filteredMusic.value.length) % filteredMusic.value.length
  playMusic(filteredMusic.value[prevIndex])
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
}

const toggleLike = (musicId) => {
  const index = likedMusic.value.indexOf(musicId)
  if (index > -1) {
    likedMusic.value.splice(index, 1)
  } else {
    likedMusic.value.push(musicId)
  }
  localStorage.setItem('likedMusic', JSON.stringify(likedMusic.value))
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const saveMoodNote = () => {
  if (!currentMoodNote.value.trim()) return
  
  const now = new Date()
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  
  moodHistory.value.unshift({
    time: timeStr,
    text: currentMoodNote.value
  })
  
  localStorage.setItem('moodHistory', JSON.stringify(moodHistory.value))
  currentMoodNote.value = ''
  alert('心情已保存！')
}

const shareMoodNote = () => {
  if (!currentMoodNote.value.trim()) {
    alert('请先输入心情内容！')
    return
  }
  
  const shareText = `此刻心情：${currentMoodNote.value}\n天气：${weatherText.value} ${temperature.value}°C`
  
  if (navigator.share) {
    navigator.share({
      title: '我的此刻心情',
      text: shareText
    })
  } else {
    navigator.clipboard.writeText(shareText)
    alert('心情已复制到剪贴板！')
  }
}

// 模拟天气变化
const updateWeather = () => {
  const now = new Date()
  const hour = now.getHours()
  
  if (hour >= 5 && hour < 8) {
    weatherEmoji.value = '🌅'
    weatherText.value = '日出'
    temperature.value = 19
  } else if (hour >= 8 && hour < 12) {
    weatherEmoji.value = '☀️'
    weatherText.value = '晴朗'
    temperature.value = 24 + Math.floor(Math.random() * 6)
  } else if (hour >= 12 && hour < 14) {
    weatherEmoji.value = '☀️'
    weatherText.value = '晴朗'
    temperature.value = 28 + Math.floor(Math.random() * 4)
  } else if (hour >= 14 && hour < 17) {
    weatherEmoji.value = '⛅'
    weatherText.value = '多云'
    temperature.value = 26 + Math.floor(Math.random() * 3)
  } else if (hour >= 17 && hour < 19) {
    weatherEmoji.value = '🌇'
    weatherText.value = '日落'
    temperature.value = 23
  } else {
    weatherEmoji.value = '🌙'
    weatherText.value = '晴朗'
    temperature.value = 18 + Math.floor(Math.random() * 4)
  }
  
  feelsLike.value = temperature.value + 1
}

// 根据天气更新心情
const updateMoodByWeather = () => {
  const temp = temperature.value
  let baseScore = 60
  
  if (temp >= 20 && temp <= 26) baseScore += 20
  else if (temp >= 27 && temp <= 30) baseScore += 10
  else if (temp > 30) baseScore -= 5
  else if (temp < 10) baseScore -= 10
  
  moodScore.value = Math.max(10, Math.min(100, baseScore))
  
  if (moodScore.value >= 80) {
    moodTitle.value = '精力充沛'
    moodDescription.value = '天气舒适，心情愉悦，正是学习工作的好时机！'
    moodTags.value = ['专注', '高效', '积极']
    currentCategory.value = 'focus'
  } else if (moodScore.value >= 60) {
    moodTitle.value = '状态良好'
    moodDescription.value = '天气不错，保持良好状态继续努力。'
    moodTags.value = ['专注', '稳定', '认真']
    currentCategory.value = 'coding'
  } else if (moodScore.value >= 40) {
    moodTitle.value = '保持平常心'
    moodDescription.value = '天气一般，保持平常心，做点轻松的工作。'
    moodTags.value = ['耐心', '坚持', '调整']
    currentCategory.value = 'chill'
  } else {
    moodTitle.value = '需要调整'
    moodDescription.value = '天气不佳，建议放松心情，听听音乐。'
    moodTags.value = ['休息', '调整', '放松']
    currentCategory.value = 'chill'
  }
}

// 初始化
onMounted(() => {
  updateWeather()
  updateMoodByWeather()
  
  // 默认播放第一首音乐
  currentMusic.value = filteredMusic.value[0]
  
  // 每30分钟更新一次天气
  setInterval(() => {
    updateWeather()
    updateMoodByWeather()
  }, 30 * 60 * 1000)
  
  // 加载心情历史
  const savedHistory = localStorage.getItem('moodHistory')
  if (savedHistory) {
    moodHistory.value = JSON.parse(savedHistory)
  }
  
  // 加载收藏音乐
  const savedLikes = localStorage.getItem('likedMusic')
  if (savedLikes) {
    likedMusic.value = JSON.parse(savedLikes)
  }
  
  // 组件卸载时清理定时器
  return () => {
    clearInterval(playTimer.value)
  }
})
</script>

<style scoped>
/* 天气情绪独立样式 - 不会影响其他组件 */
.weather-mood-section {
  padding: 80px 0;
  background: var(--surface-color, #f8f9fa);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-header h2 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--text-color, #333);
}

.section-header p {
  color: var(--text-secondary, #666);
  font-size: 1.1rem;
}

.weather-mood-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.weather-display {
  grid-column: 1 / -1;
  background: var(--bg-color, #ffffff);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.weather-hot { background: linear-gradient(135deg, #ff7e5f, #feb47b) !important; color: white; }
.weather-warm { background: linear-gradient(135deg, #667eea, #764ba2) !important; color: white; }
.weather-cool { background: linear-gradient(135deg, #a8ff78, #78ffd6) !important; color: #333; }
.weather-cold { background: linear-gradient(135deg, #4facfe, #00f2fe) !important; color: white; }

.weather-main {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 20px;
}

.weather-icon {
  font-size: 4rem;
}

.weather-info {
  flex: 1;
}

.temperature {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 8px;
}

.weather-text {
  font-size: 1.4rem;
  margin-bottom: 5px;
}

.location {
  opacity: 0.9;
  font-size: 0.95rem;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.detail-label {
  font-size: 0.85rem;
  opacity: 0.8;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.mood-recommendation {
  background: var(--bg-color, #ffffff);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.mood-excellent { border-left: 5px solid #4cd964; }
.mood-good { border-left: 5px solid #5ac8fa; }
.mood-normal { border-left: 5px solid #ffcc00; }
.mood-bad { border-left: 5px solid #ff6b6b; }

.mood-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mood-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-color, #333);
}

.mood-score {
  position: relative;
}

.score-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  position: relative;
  color: var(--text-color, #333);
}

.score-circle::before {
  content: '';
  position: absolute;
  width: 60px;
  height: 60px;
  background: var(--bg-color, #ffffff);
  border-radius: 50%;
  top: 5px;
  left: 5px;
}

.score-circle span {
  position: relative;
  z-index: 1;
}

.mood-content {
  margin-top: 15px;
}

.mood-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--primary-color, #42b883);
}

.mood-desc {
  color: var(--text-secondary, #666);
  line-height: 1.6;
  margin-bottom: 15px;
}

.mood-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.mood-tag {
  background: var(--surface-color, #f8f9fa);
  color: var(--text-color, #333);
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.recommendation-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.recommend-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--surface-color, #f8f9fa);
  border-radius: 12px;
  transition: all 0.3s;
}

.recommend-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 1.8rem;
}

.card-content h4 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: var(--text-color, #333);
}

.card-content p {
  margin: 0;
  color: var(--text-secondary, #666);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 🎵 完善音乐部分样式 */
.music-section {
  margin-top: 30px;
}

.music-section h4 {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: var(--text-color, #333);
}

.music-categories {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: var(--surface-color, #f8f9fa);
  border: 2px solid var(--border-color, #eaeaea);
  border-radius: 12px;
  color: var(--text-color, #333);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 500;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-btn.active {
  background: var(--primary-color, #42b883);
  color: white;
  border-color: var(--primary-color, #42b883);
}

.category-icon {
  font-size: 1.2rem;
}

.music-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.music-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--surface-color, #f8f9fa);
  border-radius: 12px;
  border-left: 4px solid transparent;
  transition: all 0.3s;
}

.music-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.music-item.playing {
  border-left-color: var(--primary-color, #42b883);
  background: rgba(66, 184, 131, 0.05);
}

.music-info {
  flex: 1;
}

.music-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: var(--text-color, #333);
  margin-bottom: 5px;
}

.music-icon {
  font-size: 1.2rem;
}

.music-meta {
  display: flex;
  gap: 15px;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
}

.music-tag {
  background: rgba(66, 184, 131, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--primary-color, #42b883);
}

.music-actions {
  display: flex;
  gap: 10px;
}

.play-btn, .like-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.play-btn {
  background: var(--primary-color, #42b883);
  color: white;
}

.like-btn {
  background: var(--surface-color, #f8f9fa);
  color: var(--text-color, #333);
  border: 2px solid var(--border-color, #eaeaea);
}

.play-btn:hover, .like-btn:hover {
  transform: scale(1.1);
}

.like-btn.liked {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

/* 音乐播放器 */
.music-player {
  background: var(--bg-color, #ffffff);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.player-info {
  text-align: center;
  margin-bottom: 20px;
}

.player-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color, #333);
  margin-bottom: 5px;
}

.player-artist {
  color: var(--text-secondary, #666);
  font-size: 0.95rem;
}

.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-bottom: 20px;
}

.player-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px;
}

.player-btn:hover {
  transform: scale(1.1);
}

.play-btn-main {
  background: var(--primary-color, #42b883);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-progress {
  margin-top: 20px;
}

.progress-bar {
  height: 6px;
  background: var(--surface-color, #f8f9fa);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color, #42b883);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.progress-time {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-secondary, #666);
}

/* 心情日记 */
.mood-journal {
  grid-column: 1 / -1;
  background: var(--bg-color, #ffffff);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
}

.mood-journal h4 {
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  color: var(--text-color, #333);
}

.mood-journal textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid var(--border-color, #eaeaea);
  border-radius: 12px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 15px;
  transition: border-color 0.3s;
}

.mood-journal textarea:focus {
  outline: none;
  border-color: var(--primary-color, #42b883);
}

.journal-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.save-btn, .share-btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
}

.save-btn {
  background: var(--primary-color, #42b883);
  color: white;
}

.share-btn {
  background: var(--surface-color, #f8f9fa);
  color: var(--text-color, #333);
  border: 2px solid var(--border-color, #eaeaea);
}

.save-btn:hover, .share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mood-history {
  border-top: 1px solid var(--border-color, #eaeaea);
  padding-top: 20px;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.history-item:last-child {
  border-bottom: none;
}

.history-time {
  min-width: 60px;
  color: var(--primary-color, #42b883);
  font-weight: 500;
  font-size: 0.9rem;
}

.history-text {
  color: var(--text-secondary, #666);
  line-height: 1.5;
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .weather-mood-container {
    grid-template-columns: 1fr;
  }
  
  .weather-details {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .weather-mood-section {
    padding: 60px 0;
  }
  
  .weather-main {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .temperature {
    font-size: 2.5rem;
  }
  
  .weather-icon {
    font-size: 3rem;
  }
  
  .mood-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .music-categories {
    justify-content: center;
  }
  
  .music-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .music-actions {
    width: 100%;
    justify-content: center;
  }
  
  .journal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .weather-details {
    grid-template-columns: 1fr;
  }
  
  .temperature {
    font-size: 2rem;
  }
  
  .weather-icon {
    font-size: 2.5rem;
  }
  
  .mood-tags {
    justify-content: center;
  }
  
  .history-item {
    flex-direction: column;
    gap: 5px;
  }
  
  .history-time {
    min-width: auto;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .category-btn {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
}
</style>