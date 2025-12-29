<template>
  <div class="blog-card" @click="$emit('click')">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <span class="category">{{ category }}</span>
    </div>
    <div class="card-content">
      <p>{{ excerpt }}</p>
    </div>
    <div class="card-footer">
      <span class="date">{{ date }}</span>
      <div class="tags">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: '未分类'
  },
  tags: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
/* 基础卡片样式 */
.blog-card {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 20px;
  padding: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  height: 100%;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(0, 0, 0, 0.03);
}

/* 背景装饰效果 */
.blog-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(135deg, 
    rgba(66, 184, 131, 0.1) 0%,
    rgba(53, 73, 94, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s;
  z-index: 0;
}

/* 悬停效果 */
.blog-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(66, 184, 131, 0.2);
}

.blog-card:hover::after {
  opacity: 1;
}

/* 顶部渐变条 */
.blog-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #42b883, #35495e);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.blog-card:hover::before {
  transform: scaleX(1);
}

/* 卡片内容应该在装饰层之上 */
.blog-card > * {
  position: relative;
  z-index: 1;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
  flex: 1;
  transition: color 0.3s;
  position: relative;
  display: inline-block;
}

/* 标题下划线动画 */
.card-header h3::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 3px;
  background: #42b883;
  transition: width 0.3s;
}

.blog-card:hover .card-header h3 {
  color: #42b883;
}

.blog-card:hover .card-header h3::after {
  width: 100%;
}

/* 分类标签 */
.category {
  background: #f0f9ff;
  color: #42b883;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: 12px;
  white-space: nowrap;
  border: 1px solid rgba(66, 184, 131, 0.2);
}

/* 内容部分 */
.card-content p {
  color: #5c6b7e;
  line-height: 1.7;
  margin: 0 0 20px 0;
  
  /* 多行文本省略（兼容所有现代浏览器） */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  
  /* 标准属性（未来支持） */
  display: -moz-box;
  -moz-box-orient: vertical;
  -moz-line-clamp: 3;
  
  display: box;
  box-orient: vertical;
  line-clamp: 3;
  
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1rem;
}

/* 底部信息 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.date {
  color: #8a9ba8;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 标签样式 */
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tag {
  background: #f5f7fa;
  color: #5c6b7e;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* 标签流光效果 */
.tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.8), 
    transparent);
  transition: left 0.5s;
}

.tag:hover {
  background: #42b883;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.tag:hover::before {
  left: 100%;
}
</style>