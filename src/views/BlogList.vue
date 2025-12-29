<template>
  <div class="blog-list">
    <h1>文章列表</h1>
    
    <div class="filters">
      <div class="categories">
        <span 
          v-for="cat in categories" 
          :key="cat"
          :class="{ active: activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </span>
      </div>
    </div>
    
    <div class="blogs-grid">
      <BlogCard 
        v-for="blog in filteredBlogs" 
        :key="blog.id"
        :title="blog.title"
        :excerpt="blog.excerpt"
        :date="blog.date"
        :category="blog.category"
        :tags="blog.tags"
        @click="goToBlog(blog.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BlogCard from '@/components/BlogCard.vue'

const router = useRouter()

// 模拟数据
const blogs = ref([
  {
    id: 1,
    title: 'Vue 3入门指南',
    excerpt: '学习Vue 3的基础知识和新特性，包括Composition API、响应式系统等...',
    date: '2025-12-22',
    category: '技术',
    tags: ['Vue', '前端', 'JavaScript']
  },
  {
    id: 2,
    title: 'TypeScript最佳实践',
    excerpt: '分享在Vue项目中使用TypeScript的一些最佳实践和技巧...',
    date: '2025-12-20',
    category: '技术',
    tags: ['TypeScript', 'Vue']
  },
  {
    id: 3,
    title: 'CSS Grid布局详解',
    excerpt: '深入理解CSS Grid布局，创建复杂的响应式网页设计...',
    date: '2025-12-23',
    category: '技术',
    tags: ['CSS', '前端']
  },
  {
    id: 4,
    title: '我的2025年总结',
    excerpt: '回顾过去一年的学习、工作和生活感悟...',
    date: '2025-12-25',
    category: '生活',
    tags: ['总结', '随笔']
  },
  {
    id: 5,
    title: 'Vue Router深度解析',
    excerpt: '深入理解Vue Router的工作原理和高级用法...',
    date: '2025-12-20',
    category: '技术',
    tags: ['Vue Router', '路由', '前端']
  },
  {
    id: 6,
    title: '前端性能优化技巧',
    excerpt: '分享一些实用的前端性能优化方法和工具...',
    date: '2025-12-18',
    category: '技术',
    tags: ['性能优化', '前端', '最佳实践']
  }
])

const categories = ref(['全部', '技术', '生活', '随笔'])
const activeCategory = ref('全部')

// 筛选文章
const filteredBlogs = computed(() => {
  if (activeCategory.value === '全部') {
    return blogs.value
  }
  return blogs.value.filter(blog => blog.category === activeCategory.value)
})

// 跳转到文章详情
const goToBlog = (id) => {
  router.push(`/blog/${id}`)
}
</script>

<style scoped>
.blog-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 160px);
}

.blog-list h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: 2.5rem;
  background: linear-gradient(45deg, #2c3e50, #42b883);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filters {
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.categories {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.categories span {
  padding: 10px 24px;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #5c6b7e;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.categories span:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #42b883;
}

.categories span.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
  box-shadow: 0 4px 15px rgba(66, 184, 131, 0.4);
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

/* 空状态提示 */
.blogs-grid:empty::after {
  content: '暂无文章';
  display: block;
  text-align: center;
  padding: 60px;
  color: #8a9ba8;
  font-size: 1.2rem;
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .blogs-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .blog-list h1 {
    font-size: 2rem;
  }
  
  .blog-list {
    padding: 20px 15px;
  }
  
  .categories {
    gap: 10px;
  }
  
  .categories span {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
  
  .filters {
    padding: 15px;
  }
}

@media (min-width: 1200px) {
  .blogs-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>