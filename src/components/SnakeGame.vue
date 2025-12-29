<!-- src/components/SnakeGame.vue -->
<template>
  <div class="snake-game">
    <div class="game-header">
      <h2>🐍 贪吃蛇游戏</h2>
      <div class="game-stats">
        <span>分数: {{ score }}</span>
        <span>长度: {{ snake.length }}</span>
        <span>速度: {{ speedLevel }}</span>
      </div>
    </div>
    
    <div class="game-area">
      <canvas 
        ref="gameCanvas" 
        :width="canvasWidth" 
        :height="canvasHeight"
        tabindex="0"
        @keydown="handleKeydown"
      ></canvas>
    </div>
    
    <div class="game-controls">
      <button @click="startGame" class="btn start-btn">
        {{ isPlaying ? '重新开始' : '开始游戏' }}
      </button>
      <button @click="pauseGame" class="btn pause-btn">
        {{ isPaused ? '继续' : '暂停' }}
      </button>
      <button @click="changeSpeed" class="btn speed-btn">
        速度: {{ speedLevel }}
      </button>
    </div>
    
    <div class="game-instructions">
      <h4>操作说明：</h4>
      <p>←↑↓→ 或 WASD 控制方向</p>
      <p>空格键暂停/继续</p>
      <p>吃到红色食物增长身体</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasWidth = 400
const canvasHeight = 400
const gridSize = 20

const gameCanvas = ref(null)
const ctx = ref(null)
const isPlaying = ref(false)
const isPaused = ref(false)
const score = ref(0)
const speed = ref(150)
const speedLevel = ref('普通')

// 贪吃蛇数据
const snake = ref([
  { x: 200, y: 200 },
  { x: 180, y: 200 },
  { x: 160, y: 200 }
])

const food = ref({ x: 0, y: 0 })
const direction = ref({ x: gridSize, y: 0 })
const gameLoop = ref(null)

// 初始化游戏
const initGame = () => {
  if (!gameCanvas.value) return
  ctx.value = gameCanvas.value.getContext('2d')
  generateFood()
  gameCanvas.value.focus()
}

// 生成食物
const generateFood = () => {
  const maxX = Math.floor(canvasWidth / gridSize)
  const maxY = Math.floor(canvasHeight / gridSize)
  
  food.value = {
    x: Math.floor(Math.random() * maxX) * gridSize,
    y: Math.floor(Math.random() * maxY) * gridSize
  }
  
  // 确保食物不在蛇身上
  for (let segment of snake.value) {
    if (segment.x === food.value.x && segment.y === food.value.y) {
      generateFood()
      break
    }
  }
}

// 绘制游戏
const drawGame = () => {
  if (!ctx.value) return
  
  // 清空画布
  ctx.value.fillStyle = '#1a1a2e'
  ctx.value.fillRect(0, 0, canvasWidth, canvasHeight)
  
  // 绘制网格
  ctx.value.strokeStyle = '#16213e'
  ctx.value.lineWidth = 0.5
  for (let x = 0; x < canvasWidth; x += gridSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(x, 0)
    ctx.value.lineTo(x, canvasHeight)
    ctx.value.stroke()
  }
  for (let y = 0; y < canvasHeight; y += gridSize) {
    ctx.value.beginPath()
    ctx.value.moveTo(0, y)
    ctx.value.lineTo(canvasWidth, y)
    ctx.value.stroke()
  }
  
  // 绘制蛇
  snake.value.forEach((segment, index) => {
    if (index === 0) {
      // 蛇头
      ctx.value.fillStyle = '#4CAF50'
    } else {
      // 蛇身
      ctx.value.fillStyle = '#8BC34A'
    }
    ctx.value.fillRect(segment.x, segment.y, gridSize - 1, gridSize - 1)
    
    // 蛇身圆角
    ctx.value.strokeStyle = '#388E3C'
    ctx.value.lineWidth = 1
    ctx.value.strokeRect(segment.x + 1, segment.y + 1, gridSize - 3, gridSize - 3)
  })
  
  // 绘制食物
  ctx.value.fillStyle = '#FF5252'
  ctx.value.beginPath()
  const centerX = food.value.x + gridSize / 2
  const centerY = food.value.y + gridSize / 2
  const radius = gridSize / 2 - 2
  ctx.value.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.value.fill()
  
  // 食物光泽效果
  ctx.value.fillStyle = '#FF8A80'
  ctx.value.beginPath()
  ctx.value.arc(centerX - 3, centerY - 3, radius / 3, 0, Math.PI * 2)
  ctx.value.fill()
}

// 更新游戏状态
const updateGame = () => {
  if (!isPlaying.value || isPaused.value) return
  
  // 移动蛇头
  const head = { ...snake.value[0] }
  head.x += direction.value.x
  head.y += direction.value.y
  
  // 检查碰撞
  if (
    head.x < 0 || 
    head.x >= canvasWidth || 
    head.y < 0 || 
    head.y >= canvasHeight ||
    snake.value.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver()
    return
  }
  
  // 添加新头
  snake.value.unshift(head)
  
  // 检查是否吃到食物
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10
    generateFood()
  } else {
    // 没吃到食物就移除尾巴
    snake.value.pop()
  }
  
  drawGame()
}

// 开始游戏
const startGame = () => {
  isPlaying.value = true
  isPaused.value = false
  score.value = 0
  snake.value = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ]
  direction.value = { x: gridSize, y: 0 }
  generateFood()
  drawGame()
  
  if (gameLoop.value) {
    clearInterval(gameLoop.value)
  }
  
  gameLoop.value = setInterval(updateGame, speed.value)
  gameCanvas.value.focus()
}

// 暂停游戏
const pauseGame = () => {
  if (!isPlaying.value) return
  isPaused.value = !isPaused.value
}

// 改变速度
const changeSpeed = () => {
  const speeds = [
    { value: 200, level: '慢速' },
    { value: 150, level: '普通' },
    { value: 100, level: '快速' },
    { value: 70, level: '极速' }
  ]
  
  const currentIndex = speeds.findIndex(s => s.value === speed.value)
  const nextIndex = (currentIndex + 1) % speeds.length
  
  speed.value = speeds[nextIndex].value
  speedLevel.value = speeds[nextIndex].level
  
  if (isPlaying.value && !isPaused.value) {
    clearInterval(gameLoop.value)
    gameLoop.value = setInterval(updateGame, speed.value)
  }
}

// 游戏结束
const gameOver = () => {
  isPlaying.value = false
  clearInterval(gameLoop.value)
  alert(`游戏结束！得分：${score.value}`)
}

// 键盘控制
const handleKeydown = (e) => {
  if (!isPlaying.value) return
  
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (direction.value.y === 0) {
        direction.value = { x: 0, y: -gridSize }
      }
      break
    case 'ArrowDown':
    case 's':
    case 'S':
      if (direction.value.y === 0) {
        direction.value = { x: 0, y: gridSize }
      }
      break
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (direction.value.x === 0) {
        direction.value = { x: -gridSize, y: 0 }
      }
      break
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (direction.value.x === 0) {
        direction.value = { x: gridSize, y: 0 }
      }
      break
    case ' ':
      pauseGame()
      break
  }
}

onMounted(() => {
  initGame()
  drawGame()
})

onUnmounted(() => {
  if (gameLoop.value) {
    clearInterval(gameLoop.value)
  }
})
</script>

<style scoped>
.snake-game {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  margin: 30px auto;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.game-header {
  text-align: center;
  margin-bottom: 20px;
}

.game-header h2 {
  margin: 0 0 10px 0;
  color: #4CAF50;
}

.game-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 18px;
}

.game-stats span {
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.game-area {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.game-area canvas {
  border: 3px solid #0f3460;
  border-radius: 8px;
  background: #1a1a2e;
  outline: none;
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.btn {
  padding: 10px 25px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
  color: white;
}

.pause-btn {
  background: linear-gradient(45deg, #2196F3, #03A9F4);
  color: white;
}

.speed-btn {
  background: linear-gradient(45deg, #FF9800, #FFC107);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.game-instructions {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 14px;
}

.game-instructions h4 {
  margin: 0 0 10px 0;
  color: #FFC107;
}
</style>