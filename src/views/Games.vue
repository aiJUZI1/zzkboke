<!-- src/views/Games.vue -->
<template>
  <div class="games-page">
    <div class="page-header">
      <h1>🎮 博客小游戏</h1>
      <p>学习累了？来玩个小游戏放松一下吧！</p>
      <router-link to="/" class="back-link">← 返回博客</router-link>
    </div>
    
    <div class="games-container">
      <!-- 贪吃蛇游戏 -->
      <SnakeGame />
      
      <!-- 可以在这里添加更多游戏 -->
      <div class="coming-soon">
        <h3>🎯 更多游戏开发中...</h3>
        <div class="game-list">
          <div class="game-card">俄罗斯方块</div>
          <div class="game-card">2048</div>
          <div class="game-card">打字测试</div>
          <div class="game-card">记忆翻牌</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SnakeGame from '@/components/SnakeGame.vue'
</script>

<style scoped>
.games-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  border-radius: 12px;
  color: white;
}

.page-header h1 {
  font-size: 2.5em;
  margin: 0 0 10px 0;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: white;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 20px;
  transition: all 0.3s;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
}

.coming-soon {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-top: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.game-card {
  background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s;
}

.game-card:hover {
  transform: translateY(-5px);
}
</style>