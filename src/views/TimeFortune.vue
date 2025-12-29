<template>
  <div class="time-fortune" :class="currentHourClass">
    <!-- 时辰主面板 -->
    <div class="fortune-main">
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
          <button class="draw-btn" @click="drawNewLottery">
            {{ hasDrawnToday ? '已求签' : '🔮 求一签' }}
          </button>
        </div>
        
        <!-- 时辰特效 -->
        <div class="hour-effects">
          <div v-for="n in effectCount" :key="n" class="effect-dot" :style="getEffectStyle(n)"></div>
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
    
    <!-- 时辰详情弹窗 -->
    <div v-if="showHourDetail" class="hour-detail-modal" @click.self="showHourDetail = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ selectedHourDetail.name }}时</h3>
          <button class="close-modal" @click="showHourDetail = false">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h4><span class="icon">📖</span> 时辰典故</h4>
            <p>{{ selectedHourDetail.story }}</p>
          </div>
          <div class="detail-section">
            <h4><span class="icon">🌟</span> 对应星宿</h4>
            <p>{{ selectedHourDetail.constellation }}</p>
          </div>
          <div class="detail-section">
            <h4><span class="icon">🎵</span> 推荐音乐</h4>
            <div class="music-suggestion">
              <span>{{ selectedHourDetail.music }}</span>
              <button class="play-btn" @click="playHourMusic">▶️ 播放</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 时辰数据
const allHours = [
  { id: 1, name: '子', label: '子时', range: '23:00-01:00', emoji: '🐭', luck: 'good', 
    story: '子时是一天的开始，老鼠最为活跃的时刻。此时阴气最盛，阳气初生，宜静养休息。',
    constellation: '虚宿', music: '《平湖秋月》' },
  { id: 2, name: '丑', label: '丑时', range: '01:00-03:00', emoji: '🐂', luck: 'neutral',
    story: '丑时牛开始反刍，人在此时处于深度睡眠。此时肝经当令，宜深度休息。',
    constellation: '斗宿', music: '《汉宫秋月》' },
  { id: 3, name: '丑', label: '丑时', range: '01:00-03:00', emoji: '🐂', luck: 'neutral',
    story: '丑时牛开始反刍，人在此时处于深度睡眠。此时肝经当令，宜深度休息。',
    constellation: '斗宿', music: '《汉宫秋月》' },
  { id: 4, name: '寅', label: '寅时', range: '03:00-05:00', emoji: '🐯', luck: 'good',
    story: '寅时老虎最为凶猛，人在此时肺经当令，气血开始重新分配。',
    constellation: '箕宿', music: '《渔舟唱晚》' },
  { id: 5, name: '卯', label: '卯时', range: '05:00-07:00', emoji: '🐇', luck: 'excellent',
    story: '卯时兔子出窝吃草，此时日出，天门开，宜起床活动，迎接新的一天。',
    constellation: '尾宿', music: '《高山流水》' },
  { id: 6, name: '辰', label: '辰时', range: '07:00-09:00', emoji: '🐉', luck: 'good',
    story: '辰时龙行雨，此时胃经当令，宜吃早餐，补充能量。',
    constellation: '心宿', music: '《阳春白雪》' },
  { id: 7, name: '巳', label: '巳时', range: '09:00-11:00', emoji: '🐍', luck: 'neutral',
    story: '巳时蛇开始活跃，此时脾经当令，是一天中第一个黄金时间。',
    constellation: '房宿', music: '《梅花三弄》' },
  { id: 8, name: '午', label: '午时', range: '11:00-13:00', emoji: '🐎', luck: 'good',
    story: '午时马奔跑不息，此时心经当令，宜小憩片刻，养心安神。',
    constellation: '氐宿', music: '《十面埋伏》' },
  { id: 9, name: '未', label: '未时', range: '13:00-15:00', emoji: '🐐', luck: 'neutral',
    story: '未时羊吃草，此时小肠经当令，宜处理需要细致耐心的工作。',
    constellation: '亢宿', music: '《夕阳箫鼓》' },
  { id: 10, name: '申', label: '申时', range: '15:00-17:00', emoji: '🐒', luck: 'excellent',
    story: '申时猴子活跃，此时膀胱经当令，是一天中第二个黄金时间。',
    constellation: '角宿', music: '《汉宫秋月》' },
  { id: 11, name: '酉', label: '酉时', range: '17:00-19:00', emoji: '🐓', luck: 'good',
    story: '酉时鸡归巢，此时肾经当令，宜休息，不宜剧烈运动。',
    constellation: '轸宿', music: '《渔樵问答》' },
  { id: 12, name: '戌', label: '戌时', range: '19:00-21:00', emoji: '🐕', luck: 'neutral',
    story: '戌时狗开始守夜，此时心包经当令，宜与家人交流，放松心情。',
    constellation: '翼宿', music: '《胡笳十八拍》' },
  { id: 13, name: '亥', label: '亥时', range: '21:00-23:00', emoji: '🐖', luck: 'good',
    story: '亥时猪酣睡，此时三焦经当令，宜准备休息，不宜再进食。',
    constellation: '张宿', music: '《平沙落雁》' }
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

// 状态
const currentHourId = ref(1)
const currentTime = ref('')
const currentDate = ref('')
const showHourDetail = ref(false)
const hasDrawnToday = ref(false)
const dailyFortune = ref({})
const effectCount = ref(50)

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

const selectedHourDetail = computed(() => currentHour.value)

// 方法
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
  showHourDetail.value = true
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

const playHourMusic = () => {
  // 这里可以添加播放音乐的逻辑
  alert(`播放 ${selectedHourDetail.value.music}`)
}

const getEffectStyle = (index) => {
  const size = Math.random() * 8 + 2
  const opacity = Math.random() * 0.5 + 0.2
  const x = Math.random() * 100
  const y = Math.random() * 100
  const duration = Math.random() * 3 + 2
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    opacity: opacity,
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${duration}s`
  }
}

// 初始化
onMounted(() => {
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
  
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
.time-fortune {
  font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
  padding: 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}

/* 不同时辰的背景色 */
.time-fortune.hour-子 { background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%); }
.time-fortune.hour-丑 { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); }
.time-fortune.hour-寅 { background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%); }
.time-fortune.hour-卯 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; }
.time-fortune.hour-辰 { background: linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%); color: #333; }
.time-fortune.hour-巳 { background: linear-gradient(135deg, #ffe259 0%, #ffa751 100%); color: #333; }
.time-fortune.hour-午 { background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%); }
.time-fortune.hour-未 { background: linear-gradient(135deg, #654ea3 0%, #eaafc8 100%); }
.time-fortune.hour-申 { background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%); }
.time-fortune.hour-酉 { background: linear-gradient(135deg, #cc2b5e 0%, #753a88 100%); }
.time-fortune.hour-戌 { background: linear-gradient(135deg, #42275a 0%, #734b6d 100%); }
.time-fortune.hour-亥 { background: linear-gradient(135deg, #141e30 0%, #243b55 100%); }

.fortune-main {
  position: relative;
  z-index: 2;
}

.time-display {
  text-align: center;
  margin-bottom: 30px;
}

.chinese-time {
  font-size: 3.5rem;
  font-weight: 900;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
  font-family: 'STKaiti', '楷体', serif;
}

.current-time {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 5px;
}

.date {
  font-size: 1rem;
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
  font-size: 2rem;
  font-weight: bold;
}

.hour-range {
  font-size: 1.1rem;
}

.animal-sign {
  font-size: 1.5rem;
}

.fortune-indicator {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.fortune-level {
  font-size: 2rem;
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
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
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
  font-size: 1.2rem;
  font-weight: bold;
  margin: 10px 0;
  font-family: 'STKaiti', '楷体', serif;
}

.lottery-type {
  font-size: 0.9rem;
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
  margin-top: 20px;
}

.hour-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 8px 5px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hour-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hour-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
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

.hour-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  color: #333;
}

.modal-header {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-modal {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  color: #667eea;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.music-suggestion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 10px 15px;
  border-radius: 8px;
}

.play-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.hour-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.effect-dot {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: floatEffect linear infinite;
}

@keyframes floatEffect {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hour-selector {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .recommendations {
    grid-template-columns: 1fr;
  }
  
  .chinese-time {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .hour-selector {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .hour-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .fortune-level {
    font-size: 1.5rem;
  }
}
</style>