<template>
  <div class="blog-detail">
    <button @click="$router.back()" class="back-btn">← 返回列表</button>
    
    <article v-if="blog">
      <div class="article-header">
        <h1 class="title">{{ blog.title }}</h1>
        
        <div class="meta-info">
          <div class="meta-left">
            <span class="date">📅 {{ formatDate(blog.date) }}</span>
            <span class="author">👤 {{ blog.author }}</span>
            <span class="category" :style="{ backgroundColor: blog.categoryColor }">
              {{ blog.category }}
            </span>
          </div>
          <div class="meta-right">
            <span class="views">👁️ {{ blog.views }} 阅读</span>
            <span class="likes">❤️ {{ blog.likes }} 点赞</span>
            <span class="comments">💬 {{ blog.comments }} 评论</span>
          </div>
        </div>
        
        <div class="cover-image" v-if="blog.coverImage">
          <img :src="blog.coverImage" :alt="blog.title" />
        </div>
      </div>
      
      <div class="article-content" v-html="renderedContent"></div>
      
      <div class="article-footer">
        <div class="tags">
          <span v-for="tag in blog.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
        
        <div class="actions">
          <button class="action-btn" @click="likeArticle">
            ❤️ {{ liked ? '已点赞' : '点赞' }} ({{ blog.likes }})
          </button>
          <button class="action-btn" @click="shareArticle">
            ↗️ 分享
          </button>
          <button class="action-btn" @click="bookmarkArticle">
            🔖 {{ bookmarked ? '已收藏' : '收藏' }}
          </button>
        </div>
      </div>
    </article>
    
    <div class="navigation">
      <router-link v-if="prevBlog" :to="'/blog/' + prevBlog.id" class="nav-link prev">
        <div class="nav-label">上一篇</div>
        <div class="nav-title">{{ prevBlog.title }}</div>
      </router-link>
      
      <router-link v-if="nextBlog" :to="'/blog/' + nextBlog.id" class="nav-link next">
        <div class="nav-label">下一篇</div>
        <div class="nav-title">{{ nextBlog.title }}</div>
      </router-link>
    </div>
    
    <div class="related-articles" v-if="relatedBlogs.length > 0">
      <h3>相关文章</h3>
      <div class="related-list">
        <div 
          v-for="related in relatedBlogs" 
          :key="related.id"
          class="related-item"
          @click="$router.push('/blog/' + related.id)"
        >
          <h4>{{ related.title }}</h4>
          <div class="related-meta">
            <span>{{ formatDate(related.date) }}</span>
            <span>{{ related.views }} 阅读</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const route = useRoute()
const blog = ref<any>(null)
const liked = ref(false)
const bookmarked = ref(false)

// 修正 marked 配置
marked.setOptions({
  'highlight': function(code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
  breaks: true,
  gfm: true
} as any)

// 6篇完整的博客数据（内容与标题完全匹配）
const mockBlogs = [
  {
    id: 1,
    title: 'Vue 3 Composition API 完整教程',
    content: `# Vue 3 Composition API 完整教程

Vue 3的Composition API彻底改变了我们编写Vue组件的方式，提供了更灵活、可维护的代码组织方案。

## 什么是Composition API？

Composition API是一组基于函数的API，允许您以更具逻辑性的方式组织组件代码。相比Options API，它提供了：

### 优势：
1. **更好的代码组织**：相关逻辑可以集中在一起
2. **更好的逻辑复用**：通过组合式函数轻松复用逻辑
3. **更好的TypeScript支持**：完整的类型推断
4. **更小的打包体积**：Tree-shaking友好

## 核心API详解

### 1. ref 和 reactive
\`\`\`javascript
import { ref, reactive } from 'vue'

// ref 用于基本类型
const count = ref(0)
const name = ref('张三')

// reactive 用于对象
const user = reactive({
  name: '李四',
  age: 25,
  email: 'lisi@example.com'
})

// 访问值
console.log(count.value) // 0
console.log(user.name)   // 李四
\`\`\`

### 2. computed 计算属性
\`\`\`javascript
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(2)

// 计算总价
const totalPrice = computed(() => price.value * quantity.value)

// 带setter的计算属性
const fullName = computed({
  get() {
    return \`\${firstName.value} \${lastName.value}\`
  },
  set(newValue) {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})
\`\`\`

### 3. watch 和 watchEffect
\`\`\`javascript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const user = ref({ name: '张三', age: 25 })

// watch：监听特定数据源
watch(count, (newValue, oldValue) => {
  console.log(\`count从\${oldValue}变为\${newValue}\`)
})

// watchEffect：立即执行并追踪依赖
watchEffect(() => {
  console.log(\`用户信息更新：\${user.value.name}，年龄\${user.value.age}\`)
})
\`\`\`

## 生命周期钩子

\`\`\`javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

onMounted(() => {
  console.log('组件已挂载')
  // 可以在这里发起API请求
})

onUpdated(() => {
  console.log('组件已更新')
})

onUnmounted(() => {
  console.log('组件即将销毁')
  // 清理定时器、事件监听等
})
\`\`\`

## 实战：Todo应用

\`\`\`vue
<template>
  <div class="todo-app">
    <h2>待办事项 ({{ remaining }})</h2>
    <input
      v-model="newTodo"
      @keyup.enter="addTodo"
      placeholder="添加新任务"
      class="todo-input"
    >
    <ul class="todo-list">
      <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
        <input
          type="checkbox"
          v-model="todo.completed"
          class="todo-checkbox"
        >
        <span :class="{ completed: todo.completed }">
          {{ todo.text }}
        </span>
        <button @click="removeTodo(todo.id)" class="delete-btn">
          删除
        </button>
      </li>
    </ul>
    <div class="filters">
      <button @click="filter = 'all'">全部</button>
      <button @click="filter = 'active'">未完成</button>
      <button @click="filter = 'completed'">已完成</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

let id = 0
const newTodo = ref('')
const todos = ref([])
const filter = ref('all')

const remaining = computed(() => {
  return todos.value.filter(t => !t.completed).length
})

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(t => !t.completed)
    case 'completed':
      return todos.value.filter(t => t.completed)
    default:
      return todos.value
  }
})

function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: id++,
      text: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}

function removeTodo(todoId) {
  todos.value = todos.value.filter(t => t.id !== todoId)
}
<\/script>\`\`\`

## 组合式函数示例

\`\`\`javascript
// useCounter.js - 计数器逻辑复用
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue
  const double = computed(() => count.value * 2)
  
  return {
    count,
    increment,
    decrement,
    reset,
    double
  }
}

// 在组件中使用
import { useCounter } from './useCounter'

const { count, increment } = useCounter(10)
\`\`\`

## 最佳实践

1. **合理拆分逻辑**：将相关逻辑放在一起
2. **使用组合式函数**：复用复杂逻辑
3. **合理使用ref和reactive**：简单类型用ref，复杂对象用reactive
4. **注意响应式丢失**：解构reactive对象时使用toRefs

## 总结

Composition API为Vue开发带来了革命性的变化，使得代码更加模块化、可维护。掌握Composition API是成为Vue 3开发高手的必经之路。`,
    date: '2025-12-24',
    author: 'Vue专家',
    category: 'Vue.js',
    categoryColor: '#42b883',
    views: 1560,
    likes: 320,
    comments: 45,
    tags: ['Vue 3', 'Composition API', '前端框架', 'JavaScript'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'TypeScript 高级技巧大全',
    content: `# TypeScript 高级技巧大全

TypeScript作为JavaScript的超集，为大型项目开发提供了强大的类型安全保障。本文将深入探讨TypeScript的高级技巧。

## 实用类型工具

### 1. 条件类型（Conditional Types）
\`\`\`typescript
// 判断是否为字符串类型
type IsString<T> = [T] extends [string] ? true : false

// 使用示例
type A = IsString<'hello'>    // true
type B = IsString<number>     // false
type C = IsString<string | number>  // false

// 提取数组元素类型
type ArrayElement<T> = T extends Array<infer U> ? U : never
type NumberArray = ArrayElement<number[]>  // number
\`\`\`

### 2. 映射类型（Mapped Types）
\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
  age?: number
}

// 将所有属性变为只读
type ReadonlyUser = {
  readonly [K in keyof User]: User[K]
}

// 将所有属性变为可选
type PartialUser = {
  [K in keyof User]?: User[K]
}

// 移除可选修饰符
type RequiredUser = {
  [K in keyof User]-?: User[K]
}

// 过滤特定类型的属性
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

type UserStringKeys = StringKeys<User>  // "name" | "email"
\`\`\`

### 3. 模板字面量类型
\`\`\`typescript
type EventName = 'click' | 'scroll' | 'mousemove'
type EventHandler = \`on\${Capitalize<EventName>}\`

// 结果：'onClick' | 'onScroll' | 'onMousemove'

// 路径类型生成
type ApiEndpoint = \`/api/\${'users' | 'posts' | 'comments'}/\${number}\`
// 结果：'/api/users/1' | '/api/posts/1' | '/api/comments/1'

// 配置键类型
type ConfigKey = \`\${'dark' | 'light'}_mode_\${'primary' | 'secondary'}_color\`
// 结果：'dark_mode_primary_color' | 'dark_mode_secondary_color' | ...
\`\`\`

## 泛型的高级应用

### 1. 泛型约束
\`\`\`typescript
// 基本泛型约束
function logLength<T extends { length: number }>(arg: T): void {
  console.log(arg.length)
}

// 多个约束
function mergeObjects<T extends object, U extends object>(
  obj1: T, 
  obj2: U
): T & U {
  return { ...obj1, ...obj2 }
}

// keyof约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// 条件泛型
type ExtractArrayType<T> = T extends Array<infer U> ? U : T

type NumberType = ExtractArrayType<number[]>  // number
type StringType = ExtractArrayType<string>    // string
\`\`\`

### 2. 泛型工具类型
\`\`\`typescript
// 提取函数参数类型
type Parameters<T extends (...args: any) => any> = 
  T extends (...args: infer P) => any ? P : never

// 提取函数返回类型
type ReturnType<T extends (...args: any) => any> = 
  T extends (...args: any) => infer R ? R : any

// 构造器类型
type ConstructorParameters<T extends new (...args: any) => any> = 
  T extends new (...args: infer P) => any ? P : never

// 实例类型
type InstanceType<T extends new (...args: any) => any> = 
  T extends new (...args: any) => infer R ? R : any

// 移除null和undefined
type NonNullable<T> = T extends null | undefined ? never : T

// 排除特定类型
type Exclude<T, U> = T extends U ? never : T

// 提取共同类型
type Extract<T, U> = T extends U ? T : never
\`\`\`

## 类型守卫与断言

### 1. 类型守卫
\`\`\`typescript
// 自定义类型守卫
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string'
}

// 使用类型守卫
function processValue(value: unknown) {
  if (isString(value)) {
    // value在这里被推断为string
    console.log(value.toUpperCase())
  } else if (isNumber(value)) {
    // value在这里被推断为number
    console.log(value.toFixed(2))
  }
}
\`\`\`

### 2. 类型断言
\`\`\`typescript
// 基本断言
const element = document.getElementById('myElement') as HTMLElement

// 非空断言
const value = document.getElementById('input')!.value

// 双重断言
const str = 'hello' as any as number // 谨慎使用

// const断言
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const

// config现在是只读的
\`\`\`

## 装饰器与元数据

### 1. 类装饰器
\`\`\`typescript
function LogClass(target: Function) {
  console.log(\`类 \${target.name} 被装饰\`)
}

function AddTimestamp(target: Function) {
  target.prototype.createdAt = new Date()
}

@LogClass
@AddTimestamp
class UserService {
  getUsers() {
    return []
  }
}
\`\`\`

### 2. 方法装饰器
\`\`\`typescript
function LogMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  
  descriptor.value = function(...args: any[]) {
    console.log(\`调用方法 \${propertyKey}，参数：\`, args)
    const result = originalMethod.apply(this, args)
    console.log(\`方法 \${propertyKey} 返回：\`, result)
    return result
  }
  
  return descriptor
}

class Calculator {
  @LogMethod
  add(a: number, b: number): number {
    return a + b
  }
}
\`\`\`

## 实用技巧

### 1. 索引签名
\`\`\`typescript
// 字符串索引
interface StringDictionary {
  [key: string]: string
}

// 数字索引
interface NumberDictionary {
  [key: number]: string
}

// 混合索引
interface MixedDictionary {
  [key: string]: string | number
  name: string
  age: number
}
\`\`\`

### 2. 条件分发
\`\`\`typescript
type Distributed<T> = T extends any ? T[] : never

type StringOrNumber = Distributed<string | number>
// 相当于 (string | number)[] 而不是 string[] | number[]

type NonDistributed<T> = [T] extends [any] ? T[] : never
\`\`\`

## 最佳实践

1. **开启严格模式**：在tsconfig.json中设置strict: true
2. **避免any类型**：使用unknown代替any
3. **利用类型推断**：让TypeScript自动推断类型
4. **编写声明文件**：为第三方库提供类型支持
5. **使用工具类型**：充分利用内置的工具类型
6. **合理使用泛型**：避免过度复杂的泛型设计

## 总结

TypeScript的高级特性能够显著提升代码质量和开发效率。掌握这些技巧，可以让您在大型项目中游刃有余，编写出更加健壮、可维护的代码。`,
    date: '2025-12-23',
    author: 'TS专家',
    category: 'TypeScript',
    categoryColor: '#3178c6',
    views: 2340,
    likes: 450,
    comments: 68,
    tags: ['TypeScript', '类型安全', '高级技巧', '编程'],
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop'
  },
  {
    id: 3,
    title: '现代CSS布局完全指南',
    content: `# 现代CSS布局完全指南

CSS布局技术在过去几年中发生了革命性的变化。从最初的表格布局，到浮动布局，再到现在的Flexbox和Grid，CSS布局变得越来越强大和灵活。

## 1. Flexbox布局系统

### 基础概念
\`\`\`css
.container {
  display: flex; /* 或 inline-flex */
  flex-direction: row; /* 主轴方向：row, row-reverse, column, column-reverse */
  justify-content: flex-start; /* 主轴对齐方式 */
  align-items: stretch; /* 交叉轴对齐方式 */
  flex-wrap: nowrap; /* 换行方式 */
  gap: 20px; /* 项目间距 */
}
\`\`\`

### 常用布局模式
\`\`\`css
/* 水平居中 */
.center-horizontally {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 垂直居中 */
.center-vertically {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* 圣杯布局 */
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.holy-grail .header,
.holy-grail .footer {
  flex-shrink: 0;
}

.holy-grail .content {
  flex: 1;
  display: flex;
}

.holy-grail .sidebar {
  width: 250px;
  flex-shrink: 0;
}

.holy-grail .main {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

/* 粘性页脚 */
.sticky-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sticky-footer .main {
  flex: 1;
}
\`\`\`

### Flex项目属性
\`\`\`css
.item {
  order: 0; /* 排序 */
  flex-grow: 0; /* 放大比例 */
  flex-shrink: 1; /* 缩小比例 */
  flex-basis: auto; /* 基础大小 */
  flex: 0 1 auto; /* 简写：grow shrink basis */
  align-self: auto; /* 单独对齐方式 */
}
\`\`\`

## 2. Grid布局系统

### 基础网格
\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* 12列网格 */
  grid-template-rows: auto; /* 自动行高 */
  gap: 20px; /* 网格间距 */
  padding: 20px;
}

/* 定义网格区域 */
.header {
  grid-column: 1 / -1; /* 占据所有列 */
  grid-row: 1;
}

.sidebar {
  grid-column: 1 / 4;
  grid-row: 2;
}

.main {
  grid-column: 4 / -1;
  grid-row: 2;
}

.footer {
  grid-column: 1 / -1;
  grid-row: 3;
}
\`\`\`

### 响应式网格
\`\`\`css
.grid-system {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 24px;
}

@media (max-width: 768px) {
  .grid-system {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
}
\`\`\`

### 网格布局示例
\`\`\`css
/* 仪表盘布局 */
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "sidebar header"
    "sidebar main"
    "sidebar footer";
  min-height: 100vh;
}

.sidebar { grid-area: sidebar; }
.header { grid-area: header; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* 主内容区域网格 */
.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.widget {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.widget-large {
  grid-column: span 2;
}

@media (max-width: 1024px) {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }
  
  .sidebar {
    display: none;
  }
  
  .widget-large {
    grid-column: span 1;
  }
}
\`\`\`

## 3. 现代CSS特性

### CSS自定义属性（CSS Variables）
\`\`\`css
:root {
  /* 颜色系统 */
  --primary-color: #42b883;
  --primary-dark: #2c3e50;
  --secondary-color: #f8f9fa;
  --text-color: #2c3e50;
  --text-secondary: #666;
  --border-color: #eaeaea;
  
  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 字体系统 */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* 阴影 */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);
}

/* 使用自定义属性 */
.button {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-sm);
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

/* 暗色主题 */
[data-theme="dark"] {
  --primary-color: #42d392;
  --primary-dark: #1a1a1a;
  --secondary-color: #2a2a2a;
  --text-color: #ffffff;
  --text-secondary: #a0a0a0;
  --border-color: #3a3a3a;
}
\`\`\`

### Container Queries（容器查询）
\`\`\`css
.card-component {
  container-type: inline-size;
  container-name: card;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@container card (min-width: 400px) {
  .card-content {
    flex-direction: row;
  }
  
  .card-image {
    width: 150px;
    height: auto;
  }
}

@container card (min-width: 600px) {
  .card-content {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 24px;
  }
  
  .card-footer {
    grid-column: 1 / -1;
  }
}
\`\`\`

### 子网格（Subgrid）
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.grid-item {
  display: grid;
  grid-template-columns: subgrid; /* 继承父网格列 */
  grid-column: span 2; /* 跨越2列 */
}

.grid-item .nested {
  grid-column: span 1;
}
\`\`\`

## 4. 实用布局模式

### 瀑布流布局
\`\`\`css
.masonry {
  columns: 300px;
  column-gap: 20px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
\`\`\`

### 粘性定位
\`\`\`css
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
}

.sticky-sidebar {
  position: sticky;
  top: 100px;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.sticky-footer {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid #eaeaea;
  padding: 20px 0;
}
\`\`\`

### 多列文本
\`\`\`css
.multicolumn {
  column-count: 3;
  column-gap: 40px;
  column-rule: 1px solid #eaeaea;
  text-align: justify;
}

.multicolumn h2 {
  column-span: all; /* 标题跨所有列 */
  margin-bottom: 20px;
}
\`\`\`

## 5. 性能优化

### 减少重绘重排
\`\`\`css
/* 优化前 */
.expensive {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

/* 优化后 */
.optimized {
  width: 100px;
  height: 100px;
  position: absolute;
  inset: 0;
  margin: auto;
  /* 使用transform进行动画 */
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

/* 动画优化 */
.smooth-animation {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 避免布局抖动 */
.stable-layout {
  contain: layout style;
  content-visibility: auto;
}
\`\`\`

### 图片优化
\`\`\`css
.optimized-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center;
  loading: lazy;
  decoding: async;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%) 0 0 / 40px 40px;
}
\`\`\`

## 总结

现代CSS布局技术提供了前所未有的灵活性和控制力。掌握Flexbox、Grid、CSS自定义属性和容器查询等现代特性，能够创建出既美观又高性能的网页界面。

### 学习建议：
1. **先从Flexbox开始**：掌握基础布局
2. **深入学习Grid**：处理复杂布局
3. **实践CSS自定义属性**：建立设计系统
4. **关注新特性**：如Container Queries
5. **注重性能优化**：减少重绘重排

通过不断实践和探索，您将成为CSS布局的大师！`,
    date: '2025-12-22',
    author: 'CSS大师',
    category: 'CSS',
    categoryColor: '#2965f1',
    views: 1890,
    likes: 380,
    comments: 52,
    tags: ['CSS', 'Grid', 'Flexbox', '布局', '响应式'],
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'Node.js 性能优化实战',
    content: `# Node.js 性能优化实战

Node.js作为高性能的JavaScript运行环境，在处理高并发请求方面表现出色。然而，要充分发挥其性能潜力，需要掌握一系列优化技巧。

## 1. 内存管理优化

### 监控内存使用
\`\`\`javascript
const v8 = require('v8')

function monitorMemory() {
  const memoryUsage = process.memoryUsage()
  const heapStatistics = v8.getHeapStatistics()
  
  console.log('内存使用情况:')
  console.log(\`RSS: \${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB\`)
  console.log(\`Heap Total: \${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB\`)
  console.log(\`Heap Used: \${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\`)
  console.log(\`External: \${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB\`)
  console.log(\`Heap Limit: \${(heapStatistics.heap_size_limit / 1024 / 1024).toFixed(2)} MB\`)
  console.log(\`Used Heap: \${(heapStatistics.used_heap_size / 1024 / 1024).toFixed(2)} MB\`)
  
  return memoryUsage
}

// 定时监控
setInterval(monitorMemory, 60000) // 每分钟监控一次
\`\`\`

### 避免内存泄漏
\`\`\`javascript
// 常见内存泄漏场景

// 1. 意外的全局变量
function createLeak() {
  leak = new Array(1000000).fill('*') // 忘记使用var/let/const
}

// 2. 未清理的定时器
const timers = new Map()

function createTimer(userId) {
  const timer = setInterval(() => {
    console.log(\`Processing user \${userId}\`)
  }, 1000)
  
  timers.set(userId, timer)
}

function removeTimer(userId) {
  const timer = timers.get(userId)
  if (timer) {
    clearInterval(timer)
    timers.delete(userId) // 重要：从Map中删除引用
  }
}

// 3. 闭包引用
function createClosureLeak() {
  const largeArray = new Array(1000000).fill('data')
  
  return function() {
    // 闭包引用了largeArray，即使函数执行完毕也不会被释放
    console.log('Array length:', largeArray.length)
  }
}

// 4. 未清理的事件监听器
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {
  constructor() {
    super()
    this.data = new Array(1000000).fill('*')
  }
}

function setupEmitter() {
  const emitter = new MyEmitter()
  
  const handler = () => {
    console.log('Event received')
  }
  
  emitter.on('data', handler)
  
  // 忘记移除监听器会导致内存泄漏
  // emitter.removeListener('data', handler)
}
\`\`\`

### 使用弱引用
\`\`\`javascript
const { WeakRef, FinalizationRegistry } = require('node:worker_threads')

// 创建最终化注册表
const registry = new FinalizationRegistry((heldValue) => {
  console.log(\`对象 \${heldValue} 被垃圾回收了\`)
})

// 创建大对象
function createLargeObject(id) {
  const largeObject = {
    id,
    data: new Array(1000000).fill('*'),
    timestamp: Date.now()
  }
  
  // 创建弱引用
  const weakRef = new WeakRef(largeObject)
  
  // 注册到最终化注册表
  registry.register(largeObject, \`LargeObject-\${id}\`)
  
  return {
    weakRef,
    getObject: () => weakRef.deref()
  }
}

// 使用示例
const objRef = createLargeObject(1)
const obj = objRef.getObject()

if (obj) {
  console.log('对象还存在:', obj.id)
} else {
  console.log('对象已被回收')
}
\`\`\`

## 2. 异步性能优化

### 控制并发数量
\`\`\`javascript
class ConcurrentQueue {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent
    this.running = 0
    this.queue = []
  }
  
  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject })
      this.next()
    })
  }
  
  next() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }
    
    this.running++
    const { task, resolve, reject } = this.queue.shift()
    
    Promise.resolve()
      .then(() => task())
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running--
        this.next()
      })
  }
}

// 使用示例
const queue = new ConcurrentQueue(3)

async function processItems(items) {
  const results = []
  
  for (const item of items) {
    const result = await queue.add(async () => {
      // 模拟耗时操作
      await new Promise(resolve => setTimeout(resolve, 1000))
      return \`Processed \${item}\`
    })
    
    results.push(result)
  }
  
  return results
}
\`\`\`

### Promise优化
\`\`\`javascript
// 避免Promise链过长
async function processBatch(items, batchSize = 100) {
  const results = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    
    // 使用Promise.allSettled避免单个失败影响整体
    const batchPromises = batch.map(item => processItem(item))
    const batchResults = await Promise.allSettled(batchPromises)
    
    // 处理结果
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        console.error('处理失败:', result.reason)
        results.push(null)
      }
    }
    
    // 强制垃圾回收（谨慎使用）
    if (global.gc) {
      global.gc()
    }
  }
  
  return results
}

// Promise缓存
function createCachedPromise(fn, ttl = 60000) {
  const cache = new Map()
  
  return async function(...args) {
    const key = JSON.stringify(args)
    const cached = cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value
    }
    
    const result = await fn(...args)
    cache.set(key, {
      value: result,
      timestamp: Date.now()
    })
    
    // 清理过期缓存
    setTimeout(() => {
      cache.delete(key)
    }, ttl)
    
    return result
  }
}

// 使用示例
const cachedFetch = createCachedPromise(async (url) => {
  const response = await fetch(url)
  return response.json()
}, 30000) // 30秒缓存
\`\`\`

## 3. 集群模式与负载均衡

### 基础集群实现
\`\`\`javascript
const cluster = require('cluster')
const os = require('os')
const http = require('http')

if (cluster.isMaster) {
  const numCPUs = os.cpus().length
  
  console.log(\`主进程 \${process.pid} 启动\`)
  console.log(\`启动 \${numCPUs} 个工作进程\`)
  
  // 创建工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }
  
  // 监听工作进程消息
  cluster.on('message', (worker, message) => {
    console.log(\`工作进程 \${worker.process.pid} 消息: \`, message)
  })
  
  // 工作进程退出时重启
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`工作进程 \${worker.process.pid} 退出，代码: \${code}，信号: \${signal}\`)
    console.log('启动新的工作进程...')
    cluster.fork()
  })
  
  // 优雅关闭
  process.on('SIGTERM', () => {
    console.log('收到SIGTERM信号，开始优雅关闭...')
    
    for (const id in cluster.workers) {
      cluster.workers[id].send('shutdown')
      cluster.workers[id].disconnect()
      
      setTimeout(() => {
        if (cluster.workers[id]) {
          cluster.workers[id].kill()
        }
      }, 5000)
    }
  })
  
} else {
  // 工作进程代码
  const server = http.createServer((req, res) => {
    // 模拟CPU密集型任务
    let sum = 0
    for (let i = 0; i < 1000000; i++) {
      sum += Math.random()
    }
    
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(\`Hello from worker \${process.pid}\\n\`)
  })
  
  server.listen(3000, () => {
    console.log(\`工作进程 \${process.pid} 监听端口 3000\`)
  })
  
  // 处理主进程消息
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      console.log(\`工作进程 \${process.pid} 收到关闭信号\`)
      server.close(() => {
        process.exit(0)
      })
    }
  })
  
  // 心跳检查
  setInterval(() => {
    process.send({ type: 'heartbeat', pid: process.pid, timestamp: Date.now() })
  }, 10000)
}
\`\`\`

### 负载均衡策略
\`\`\`javascript
class LoadBalancer {
  constructor(strategy = 'round-robin') {
    this.strategy = strategy
    this.workers = new Map()
    this.index = 0
  }
  
  addWorker(workerId, worker) {
    this.workers.set(workerId, {
      worker,
      load: 0,
      connections: 0,
      lastHeartbeat: Date.now()
    })
  }
  
  removeWorker(workerId) {
    this.workers.delete(workerId)
  }
  
  getWorker() {
    const workers = Array.from(this.workers.values())
    
    if (workers.length === 0) {
      throw new Error('没有可用工作进程')
    }
    
    switch (this.strategy) {
      case 'round-robin':
        return this.roundRobin(workers)
        
      case 'least-connections':
        return this.leastConnections(workers)
        
      case 'random':
        return this.random(workers)
        
      case 'weighted':
        return this.weighted(workers)
        
      default:
        return this.roundRobin(workers)
    }
  }
  
  roundRobin(workers) {
    const worker = workers[this.index % workers.length]
    this.index = (this.index + 1) % workers.length
    return worker
  }
  
  leastConnections(workers) {
    return workers.reduce((prev, curr) => 
      prev.connections < curr.connections ? prev : curr
    )
  }
  
  random(workers) {
    const randomIndex = Math.floor(Math.random() * workers.length)
    return workers[randomIndex]
  }
  
  weighted(workers) {
    const totalWeight = workers.reduce((sum, w) => sum + w.weight, 0)
    const random = Math.random() * totalWeight
    
    let currentWeight = 0
    for (const worker of workers) {
      currentWeight += worker.weight
      if (random <= currentWeight) {
        return worker
      }
    }
    
    return workers[0]
  }
  
  updateLoad(workerId, connections) {
    const worker = this.workers.get(workerId)
    if (worker) {
      worker.connections = connections
      worker.load = connections / 100 // 假设最大连接数100
    }
  }
}
\`\`\`

## 4. 数据库优化

### 连接池管理
\`\`\`javascript
const { Pool } = require('pg')

class DatabasePool {
  constructor(config) {
    this.pool = new Pool({
      host: config.host || 'localhost',
      port: config.port || 5432,
      database: config.database,
      user: config.user,
      password: config.password,
      max: config.max || 20,
      idleTimeoutMillis: config.idleTimeoutMillis || 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis || 2000,
      ssl: config.ssl || false
    })
    
    // 连接池事件监听
    this.pool.on('connect', (client) => {
      console.log('新的数据库连接建立')
    })
    
    this.pool.on('error', (err, client) => {
      console.error('连接池错误:', err)
    })
    
    // 健康检查
    setInterval(() => this.healthCheck(), 60000)
  }
  
  async healthCheck() {
    try {
      const client = await this.pool.connect()
      await client.query('SELECT 1')
      client.release()
      console.log('数据库连接池健康检查通过')
    } catch (error) {
      console.error('数据库连接池健康检查失败:', error)
    }
  }
  
  async query(sql, params = []) {
    const client = await this.pool.connect()
    
    try {
      const start = Date.now()
      const result = await client.query(sql, params)
      const duration = Date.now() - start
      
      // 慢查询日志
      if (duration > 1000) {
        console.warn(\`慢查询 (\${duration}ms): \${sql}\`)
      }
      
      return result
    } finally {
      client.release()
    }
  }
  
  async transaction(callback) {
    const client = await this.pool.connect()
    
    try {
      await client.query('BEGIN')
      const result = await callback(client)
      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }
  
  async close() {
    await this.pool.end()
    console.log('数据库连接池已关闭')
  }
}

// 使用示例
const db = new DatabasePool({
  database: 'mydb',
  user: 'user',
  password: 'password',
  max: 10
})

// 执行查询
const users = await db.query('SELECT * FROM users WHERE age > $1', [18])

// 执行事务
await db.transaction(async (client) => {
  await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, 1])
  await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, 2])
})
\`\`\`

### 查询优化
\`\`\`javascript
class QueryOptimizer {
  constructor() {
    this.queryCache = new Map()
    this.cacheHits = 0
    this.cacheMisses = 0
  }
  
  // 批量插入优化
  async bulkInsert(table, records, batchSize = 1000) {
    const results = []
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const result = await this.insertBatch(table, batch)
      results.push(...result)
    }
    
    return results
  }
  
  async insertBatch(table, records) {
    if (records.length === 0) return []
    
    const columns = Object.keys(records[0])
    const values = []
    const params = []
    let paramCount = 1
    
    records.forEach((record) => {
      const valuePlaceholders = columns.map(() => \`\${paramCount++}\`).join(', ')
      values.push(\`(\${valuePlaceholders})\`)
      params.push(...columns.map(col => record[col]))
    })
    
    const query = \`
      INSERT INTO \${table} (\${columns.join(', ')})
      VALUES \${values.join(', ')}
      RETURNING *
    \`
    
    return this.executeQuery(query, params)
  }
  
  // 查询缓存
  async cachedQuery(query, params, ttl = 60000) {
    const cacheKey = \`\${query}:\${JSON.stringify(params)}\`
    const cached = this.queryCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      this.cacheHits++
      return cached.data
    }
    
    this.cacheMisses++
    const data = await this.executeQuery(query, params)
    
    this.queryCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })
    
    // 清理过期缓存
    setTimeout(() => {
      this.queryCache.delete(cacheKey)
    }, ttl)
    
    return data
  }
  
  // 分页优化
  async paginatedQuery(query, params, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize
    
    // 获取总数
    const countQuery = \`SELECT COUNT(*) as total FROM (\${query}) as subquery\`
    const countResult = await this.executeQuery(countQuery, params)
    const total = parseInt(countResult.rows[0].total)
    
    // 获取分页数据（使用游标分页更高效）
    const paginatedQuery = \`
      \${query}
      LIMIT \${pageSize}
      OFFSET \${offset}
    \`
    
    const dataResult = await this.executeQuery(paginatedQuery, params)
    
    return {
      data: dataResult.rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1
      }
    }
  }
  
  async executeQuery(query, params) {
    // 这里调用实际的数据库查询
    console.log(\`执行查询: \${query.substring(0, 100)}...\`)
    // 返回模拟数据
    return { rows: [] }
  }
  
  getCacheStats() {
    const hitRate = this.cacheHits / (this.cacheHits + this.cacheMisses) * 100
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: \`\${hitRate.toFixed(2)}%\`,
      cacheSize: this.queryCache.size
    }
  }
}
\`\`\`

## 5. 缓存策略

### 多级缓存
\`\`\`javascript
const NodeCache = require('node-cache')

class MultiLevelCache {
  constructor() {
    // L1: 内存缓存（快速但容量小）
    this.l1Cache = new NodeCache({
      stdTTL: 60, // 60秒
      checkperiod: 30,
      useClones: false
    })
    
    // L2: Redis缓存（较慢但容量大）
    // this.l2Cache = 连接到Redis
    
    this.stats = {
      l1Hits: 0,
      l1Misses: 0,
      l2Hits: 0,
      l2Misses: 0
    }
  }
  
  async get(key) {
    // 首先尝试L1缓存
    const l1Value = this.l1Cache.get(key)
    if (l1Value !== undefined) {
      this.stats.l1Hits++
      return l1Value
    }
    
    this.stats.l1Misses++
    
    // 然后尝试L2缓存
    const l2Value = await this.getFromL2(key)
    if (l2Value !== null) {
      this.stats.l2Hits++
      // 回填到L1缓存
      this.l1Cache.set(key, l2Value)
      return l2Value
    }
    
    this.stats.l2Misses++
    return null
  }
  
  async set(key, value, ttl = 300) {
    // 设置到L1缓存
    this.l1Cache.set(key, value, ttl)
    
    // 异步设置到L2缓存
    setTimeout(async () => {
      await this.setToL2(key, value, ttl)
    }, 0)
  }
  
  async getOrSet(key, fetchFunction, ttl = 300) {
    // 尝试获取缓存
    const cached = await this.get(key)
    if (cached !== null) {
      return cached
    }
    
    // 缓存未命中，获取数据
    const data = await fetchFunction()
    
    // 设置缓存
    await this.set(key, data, ttl)
    
    return data
  }
  
  async getWithStaleWhileRevalidate(key, fetchFunction, ttl = 300, staleTtl = 60) {
    // 尝试获取缓存
    const cached = await this.get(key)
    
    if (cached !== null) {
      // 异步更新缓存（不阻塞当前请求）
      setTimeout(async () => {
        try {
          const freshData = await fetchFunction()
          await this.set(key, freshData, ttl)
        } catch (error) {
          console.error('缓存更新失败:', error)
        }
      }, 0)
      
      return cached
    }
    
    // 缓存未命中，获取新鲜数据
    const freshData = await fetchFunction()
    await this.set(key, freshData, ttl)
    
    return freshData
  }
  
  async getFromL2(key) {
    // 这里实现从Redis获取数据的逻辑
    // 返回 null 表示缓存未命中
    return null
  }
  
  async setToL2(key, value, ttl) {
    // 这里实现设置数据到Redis的逻辑
  }
  
  getStats() {
    const l1HitRate = this.stats.l1Hits / (this.stats.l1Hits + this.stats.l1Misses) * 100
    const l2HitRate = this.stats.l2Hits / (this.stats.l2Hits + this.stats.l2Misses) * 100
    
    return {
      l1: {
        hits: this.stats.l1Hits,
        misses: this.stats.l1Misses,
        hitRate: \`\${l1HitRate.toFixed(2)}%\`
      },
      l2: {
        hits: this.stats.l2Hits,
        misses: this.stats.l2Misses,
        hitRate: \`\${l2HitRate.toFixed(2)}%\`
      }
    }
  }
}
\`\`\`

### 缓存预热
\`\`\`javascript
class CacheWarmer {
  constructor(cache) {
    this.cache = cache
    this.warming = new Set()
  }
  
  async warmPopularItems(items, ttl = 3600) {
    console.log(\`开始预热 \${items.length} 个热门项目\`)
    
    const promises = items.map(async (item) => {
      const cacheKey = \`item:\${item.id}\`
      
      if (this.warming.has(cacheKey)) {
        return // 避免重复预热
      }
      
      this.warming.add(cacheKey)
      
      try {
        // 模拟获取数据
        const data = await this.fetchItemData(item.id)
        await this.cache.set(cacheKey, data, ttl)
        console.log(\`预热完成: \${cacheKey}\`)
      } catch (error) {
        console.error(\`预热失败 \${cacheKey}:\`, error)
      } finally {
        this.warming.delete(cacheKey)
      }
    })
    
    await Promise.allSettled(promises)
    console.log('预热完成')
  }
  
  async warmOnSchedule(schedule) {
    const schedules = {
      'daily': 24 * 60 * 60 * 1000,
      'hourly': 60 * 60 * 1000,
      'every-30-minutes': 30 * 60 * 1000
    }
    
    const interval = schedules[schedule] || schedules.hourly
    
    setInterval(async () => {
      console.log(\`定时预热开始 (\${schedule})\`)
      await this.warmPopularItems(this.getPopularItems())
    }, interval)
  }
  
  async fetchItemData(id) {
    // 模拟数据获取
    await new Promise(resolve => setTimeout(resolve, 100))
    return {
      id,
      name: \`Item \${id}\`,
      price: Math.random() * 100,
      timestamp: Date.now()
    }
  }
  
  getPopularItems() {
    // 这里应该从数据库或日志中获取热门项目
    return [
      { id: 1, name: '热门商品1' },
      { id: 2, name: '热门商品2' },
      { id: 3, name: '热门商品3' },
      { id: 4, name: '热门商品4' },
      { id: 5, name: '热门商品5' }
    ]
  }
}
\`\`\`

## 6. 监控与调试

### 性能监控
\`\`\`javascript
const perf_hooks = require('perf_hooks')

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = []
    
    // 监控事件循环延迟
    this.monitorEventLoop()
    
    // 监控内存使用
    this.monitorMemory()
    
    // 监控HTTP请求
    this.monitorHTTP()
  }
  
  monitorEventLoop() {
    let lastCheck = perf_hooks.performance.now()
    
    setInterval(() => {
      const now = perf_hooks.performance.now()
      const delay = now - lastCheck - 1000 // 应该正好是1000ms
      lastCheck = now
      
      if (delay > 100) {
        console.warn(\`事件循环延迟: \${delay.toFixed(2)}ms\`)
        this.emit('eventLoopDelay', delay)
      }
    }, 1000)
  }
  
  monitorMemory() {
    setInterval(() => {
      const memory = process.memoryUsage()
      const heapUsed = memory.heapUsed / 1024 / 1024
      
      if (heapUsed > 500) { // 超过500MB
        console.warn(\`内存使用过高: \${heapUsed.toFixed(2)}MB\`)
        this.emit('highMemoryUsage', heapUsed)
        
        // 尝试强制垃圾回收
        if (global.gc) {
          global.gc()
        }
      }
    }, 5000)
  }
  
  monitorHTTP() {
    const originalCreateServer = require('http').createServer
    const originalCreateServerHttps = require('https').createServer
    
    const wrapCreateServer = (original) => {
      return function(options, requestListener) {
        const server = original.call(this, options, (req, res) => {
          const start = Date.now()
          
          // 监听响应完成
          res.on('finish', () => {
            const duration = Date.now() - start
            const path = req.url
            const method = req.method
            const status = res.statusCode
            
            this.emit('httpRequest', {
              method,
              path,
              status,
              duration,
              timestamp: start
            })
            
            // 慢请求日志
            if (duration > 1000) {
              console.warn(\`慢请求: \${method} \${path} (\${duration}ms)\`)
            }
          })
          
          if (requestListener) {
            requestListener(req, res)
          }
        })
        
        return server
      }
    }
    
    require('http').createServer = wrapCreateServer(originalCreateServer)
    require('https').createServer = wrapCreateServer(originalCreateServerHttps)
  }
  
  measure(name, fn) {
    const start = perf_hooks.performance.now()
    const result = fn()
    
    if (result && typeof result.then === 'function') {
      return result.then(data => {
        const duration = perf_hooks.performance.now() - start
        this.recordMetric(name, duration)
        return data
      })
    } else {
      const duration = perf_hooks.performance.now() - start
      this.recordMetric(name, duration)
      return result
    }
  }
  
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        values: []
      })
    }
    
    const metric = this.metrics.get(name)
    metric.count++
    metric.sum += value
    metric.min = Math.min(metric.min, value)
    metric.max = Math.max(metric.max, value)
    metric.values.push(value)
    
    // 只保留最近1000个值
    if (metric.values.length > 1000) {
      metric.values.shift()
    }
  }
  
  getMetricStats(name) {
    const metric = this.metrics.get(name)
    if (!metric || metric.count === 0) {
      return null
    }
    
    const avg = metric.sum / metric.count
    
    // 计算百分位数
    const sorted = [...metric.values].sort((a, b) => a - b)
    const p95 = sorted[Math.floor(sorted.length * 0.95)]
    const p99 = sorted[Math.floor(sorted.length * 0.99)]
    
    return {
      count: metric.count,
      avg: avg.toFixed(2),
      min: metric.min.toFixed(2),
      max: metric.max.toFixed(2),
      p95: p95.toFixed(2),
      p99: p99.toFixed(2)
    }
  }
  
  emit(event, data) {
    this.observers.forEach(observer => {
      if (observer.event === event || observer.event === '*') {
        observer.callback(data)
      }
    })
  }
  
  on(event, callback) {
    this.observers.push({ event, callback })
  }
}

// 使用示例
const monitor = new PerformanceMonitor()

monitor.on('eventLoopDelay', (delay) => {
  console.log(\`事件循环延迟: \${delay}ms\`)
})

monitor.on('highMemoryUsage', (usage) => {
  console.log(\`高内存使用: \${usage}MB\`)
})

// 监控函数执行时间
const result = await monitor.measure('databaseQuery', async () => {
  return db.query('SELECT * FROM users')
})

// 获取统计信息
const stats = monitor.getMetricStats('databaseQuery')
console.log('数据库查询统计:', stats)
\`\`\`

## 总结

Node.js性能优化是一个持续的过程，需要从多个维度综合考虑：

### 关键优化点：
1. **内存管理**：避免内存泄漏，合理使用缓存
2. **异步优化**：控制并发，优化Promise使用
3. **集群模式**：充分利用多核CPU
4. **数据库优化**：连接池，查询优化，缓存策略
5. **监控调试**：实时监控，及时发现性能瓶颈

### 最佳实践：
1. **定期性能测试**：使用工具进行压力测试
2. **代码审查**：关注可能的内存泄漏和性能问题
3. **监控告警**：设置合理的监控阈值
4. **渐进式优化**：优先优化瓶颈明显的部分

通过实施这些优化策略，您可以显著提升Node.js应用的性能，为用户提供更好的体验。`,
    date: '2025-12-21',
    author: 'Node专家',
    category: 'Node.js',
    categoryColor: '#339933',
    views: 3120,
    likes: 520,
    comments: 89,
    tags: ['Node.js', '性能优化', '内存管理', '数据库', '缓存'],
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop'
  },
  {
    id: 5,
    title: 'Python自动化办公实战',
    content: `# Python自动化办公实战

Python在自动化办公领域有着广泛的应用，能够显著提高工作效率，减少重复性劳动。本文将介绍Python在自动化办公中的实战应用。

## 1. Excel数据处理

### 使用openpyxl操作Excel
\`\`\`python
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, Reference, LineChart
import datetime
import os

class ExcelProcessor:
    def __init__(self, filename=None):
        self.filename = filename
        self.wb = None
        self.ws = None
        
    def create_workbook(self, title="报表"):
        """创建新的工作簿"""
        self.wb = Workbook()
        self.ws = self.wb.active
        self.ws.title = title
        return self
        
    def load_workbook(self, filename):
        """加载现有工作簿"""
        if os.path.exists(filename):
            self.filename = filename
            self.wb = load_workbook(filename)
            self.ws = self.wb.active
        else:
            raise FileNotFoundError(f"文件不存在: {filename}")
        return self
        
    def set_headers(self, headers, style='header'):
        """设置表头"""
        if not self.ws:
            raise Exception("请先创建或加载工作簿")
            
        for col, header in enumerate(headers, 1):
            cell = self.ws.cell(row=1, column=col, value=header)
            self.apply_style(cell, style)
            
        return self
    
    def apply_style(self, cell, style_name):
        """应用样式"""
        styles = {
            'header': {
                'font': Font(bold=True, color="FFFFFF", size=12),
                'fill': PatternFill(start_color="366092", end_color="366092", fill_type="solid"),
                'alignment': Alignment(horizontal="center", vertical="center"),
                'border': Border(
                    left=Side(style="thin"),
                    right=Side(style="thin"),
                    top=Side(style="thin"),
                    bottom=Side(style="thin")
                )
            },
            'data': {
                'font': Font(size=11),
                'alignment': Alignment(horizontal="left", vertical="center"),
                'border': Border(
                    left=Side(style="thin"),
                    right=Side(style="thin"),
                    top=Side(style="thin"),
                    bottom=Side(style="thin")
                )
            },
            'total': {
                'font': Font(bold=True, color="FF0000", size=11),
                'fill': PatternFill(start_color="FFFFCC", end_color="FFFFCC", fill_type="solid"),
                'alignment': Alignment(horizontal="right", vertical="center")
            }
        }
        
        if style_name in styles:
            style = styles[style_name]
            if 'font' in style:
                cell.font = style['font']
            if 'fill' in style:
                cell.fill = style['fill']
            if 'alignment' in style:
                cell.alignment = style['alignment']
            if 'border' in style:
                cell.border = style['border']
                
    def add_data(self, data, start_row=2):
        """添加数据"""
        if not self.ws:
            raise Exception("请先创建或加载工作簿")
            
        for row_idx, row_data in enumerate(data, start_row):
            if isinstance(row_data, dict):
                # 处理字典数据
                for col_idx, (key, value) in enumerate(row_data.items(), 1):
                    cell = self.ws.cell(row=row_idx, column=col_idx, value=value)
                    self.apply_style(cell, 'data')
            elif isinstance(row_data, (list, tuple)):
                # 处理列表/元组数据
                for col_idx, value in enumerate(row_data, 1):
                    cell = self.ws.cell(row=row_idx, column=col_idx, value=value)
                    self.apply_style(cell, 'data')
                    
        return self
    
    def auto_adjust_columns(self):
        """自动调整列宽"""
        for column in self.ws.columns:
            max_length = 0
            column_letter = get_column_letter(column[0].column)
            
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
                    
            adjusted_width = min(max_length + 2, 50)  # 最大宽度50
            self.ws.column_dimensions[column_letter].width = adjusted_width
            
        return self
    
    def add_chart(self, chart_type='bar', data_range=None, title=None, position="M1"):
        """添加图表"""
        if not data_range:
            # 自动检测数据范围
            max_row = self.ws.max_row
            max_col = self.ws.max_column
            data_range = {
                'min_row': 1,
                'max_row': max_row,
                'min_col': 2,  # 假设第一列是标签
                'max_col': max_col
            }
        
        if chart_type == 'bar':
            chart = BarChart()
            chart.type = "col"
            chart.style = 10
        elif chart_type == 'line':
            chart = LineChart()
            chart.style = 10
        else:
            chart = BarChart()
            
        if title:
            chart.title = title
            chart.title.font.size = 14
            
        chart.x_axis.title = "项目"
        chart.y_axis.title = "数值"
        
        data = Reference(
            self.ws,
            min_col=data_range['min_col'],
            min_row=data_range['min_row'],
            max_row=data_range['max_row'],
            max_col=data_range['max_col']
        )
        
        categories = Reference(
            self.ws,
            min_col=1,  # 假设第一列是分类
            min_row=data_range['min_row'] + 1,
            max_row=data_range['max_row']
        )
        
        chart.add_data(data, titles_from_data=True)
        chart.set_categories(categories)
        
        self.ws.add_chart(chart, position)
        return self
    
    def add_formulas(self, formulas):
        """添加公式"""
        for cell_address, formula in formulas.items():
            self.ws[cell_address] = formula
            
        return self
    
    def add_conditional_formatting(self, range_string, rule_type, formula=None, stop_if_true=True):
        """添加条件格式"""
        from openpyxl.formatting.rule import FormulaRule, CellIsRule
        
        if rule_type == 'greater_than':
            rule = CellIsRule(operator='greaterThan', formula=[formula], 
                            fill=PatternFill(start_color="FFC7CE", end_color="FFC7CE", fill_type="solid"))
        elif rule_type == 'less_than':
            rule = CellIsRule(operator='lessThan', formula=[formula],
                            fill=PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid"))
        elif rule_type == 'formula':
            rule = FormulaRule(formula=[formula],
                             fill=PatternFill(start_color="FFEB9C", end_color="FFEB9C", fill_type="solid"))
        else:
            return self
            
        self.ws.conditional_formatting.add(range_string, rule)
        return self
    
    def save(self, filename=None):
        """保存文件"""
        if filename:
            self.filename = filename
            
        if not self.filename:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            self.filename = f"report_{timestamp}.xlsx"
            
        self.auto_adjust_columns()
        self.wb.save(self.filename)
        print(f"文件已保存: {self.filename}")
        return self.filename
    
    def merge_cells(self, range_string):
        """合并单元格"""
        self.ws.merge_cells(range_string)
        return self
    
    def freeze_panes(self, cell):
        """冻结窗格"""
        self.ws.freeze_panes = cell
        return self

# 使用示例
def create_sales_report():
    """创建销售报表示例"""
    # 模拟数据
    sales_data = [
        {
            'date': datetime.date(2025, 12, 1),
            'product': '笔记本电脑',
            'quantity': 5,
            'price': 5999,
            'region': '华东'
        },
        {
            'date': datetime.date(2025, 12, 2),
            'product': '智能手机',
            'quantity': 12,
            'price': 2999,
            'region': '华北'
        },
        {
            'date': datetime.date(2025, 12, 3),
            'product': '平板电脑',
            'quantity': 8,
            'price': 3999,
            'region': '华南'
        },
        {
            'date': datetime.date(2025, 12, 4),
            'product': '智能手表',
            'quantity': 15,
            'price': 1299,
            'region': '华东'
        },
        {
            'date': datetime.date(2025, 12, 5),
            'product': '耳机',
            'quantity': 20,
            'price': 599,
            'region': '华北'
        }
    ]
    
    # 创建处理器
    processor = ExcelProcessor()
    
    # 创建报表
    processor.create_workbook("销售报表") \\
        .set_headers(['日期', '产品', '数量', '单价', '销售额', '地区']) \\
        .add_data([
            {
                'date': item['date'],
                'product': item['product'],
                'quantity': item['quantity'],
                'price': item['price'],
                'sales': item['quantity'] * item['price'],
                'region': item['region']
            }
            for item in sales_data
        ]) \\
        .add_formulas({
            'F7': '=SUM(E2:E6)',  # 总销售额
            'G7': '=AVERAGE(C2:C6)'  # 平均数量
        }) \\
        .add_conditional_formatting('E2:E6', 'greater_than', '20000') \\
        .add_chart(
            chart_type='bar',
            title='产品销售对比',
            position='H2'
        ) \\
        .freeze_panes('A2') \\
        .save('sales_report.xlsx')
    
    return processor.filename

# 运行示例
if __name__ == '__main__':
    report_file = create_sales_report()
    print(f"销售报表已生成: {report_file}")
\`\`\`

## 2. Word文档处理

### 使用python-docx生成报告
\`\`\`python
from docx import Document
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import datetime

class WordReportGenerator:
    def __init__(self, title=None):
        self.doc = Document()
        self.styles = self.doc.styles
        
        # 设置默认字体
        self.set_default_font('微软雅黑', 'Arial')
        
        if title:
            self.add_title(title)
    
    def set_default_font(self, chinese_font, english_font):
        """设置中英文字体"""
        # 设置中文样式
        chinese_style = self.styles.add_style('Chinese', WD_STYLE_TYPE.PARAGRAPH)
        chinese_style.font.name = chinese_font
        chinese_style._element.rPr.rFonts.set(qn('w:eastAsia'), chinese_font)
        
        # 设置英文样式
        english_style = self.styles.add_style('English', WD_STYLE_TYPE.PARAGRAPH)
        english_style.font.name = english_font
        
        # 设置默认样式
        default_style = self.doc.styles['Normal']
        default_style.font.name = english_font
        default_style._element.rPr.rFonts.set(qn('w:eastAsia'), chinese_font)
        default_style.font.size = Pt(11)
        default_style.paragraph_format.line_spacing = 1.5
    
    def add_title(self, text, level=0):
        """添加标题"""
        if level == 0:
            # 主标题
            title = self.doc.add_heading(text, 0)
            title.alignment = WD_ALIGN_PARAGRAPH.CENTER
            title.style.font.size = Pt(22)
            title.style.font.bold = True
            title.style.font.color.rgb = RGBColor(0, 0, 0)
        else:
            # 子标题
            heading = self.doc.add_heading(text, level)
            heading.style.font.size = Pt(14 + (3 - level) * 2)
            heading.style.font.bold = True
            heading.style.font.color.rgb = RGBColor(54, 96, 146)
        
        return self
    
    def add_paragraph(self, text, style='Normal', bold=False, italic=False, 
                     color=None, alignment='left', spacing_before=None, 
                     spacing_after=None):
        """添加段落"""
        p = self.doc.add_paragraph(text, style=style)
        
        # 设置格式
        if bold:
            p.runs[0].bold = True
        if italic:
            p.runs[0].italic = True
        if color:
            p.runs[0].font.color.rgb = RGBColor(*color)
        
        # 对齐方式
        alignments = {
            'left': WD_ALIGN_PARAGRAPH.LEFT,
            'center': WD_ALIGN_PARAGRAPH.CENTER,
            'right': WD_ALIGN_PARAGRAPH.RIGHT,
            'justify': WD_ALIGN_PARAGRAPH.JUSTIFY
        }
        p.alignment = alignments.get(alignment, WD_ALIGN_PARAGRAPH.LEFT)
        
        # 段落间距
        if spacing_before:
            p.paragraph_format.space_before = Pt(spacing_before)
        if spacing_after:
            p.paragraph_format.space_after = Pt(spacing_after)
        
        return self
    
    def add_table(self, data, headers=None, style='Light Grid Accent 1', 
                 col_widths=None, autofit=True):
        """添加表格"""
        if headers:
            rows = len(data) + 1
        else:
            rows = len(data)
            headers = [''] * len(data[0]) if data else []
        
        cols = len(headers)
        
        # 创建表格
        table = self.doc.add_table(rows=rows, cols=cols)
        table.style = style
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        # 设置列宽
        if col_widths:
            for i, width in enumerate(col_widths):
                table.columns[i].width = Cm(width)
        
        # 添加表头
        if headers:
            header_cells = table.rows[0].cells
            for i, header in enumerate(headers):
                cell = header_cells[i]
                cell.text = str(header)
                cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
                cell.paragraphs[0].runs[0].font.bold = True
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        
        # 添加数据
        start_row = 1 if headers else 0
        for row_idx, row_data in enumerate(data, start_row):
            row_cells = table.rows[row_idx].cells
            for col_idx, cell_data in enumerate(row_data):
                cell = row_cells[col_idx]
                cell.text = str(cell_data)
                cell.paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.LEFT
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        
        # 自动调整
        if autofit:
            table.autofit = True
        
        return self
    
    def add_bullet_list(self, items, level=0):
        """添加项目符号列表"""
        for item in items:
            p = self.doc.add_paragraph(item, style='List Bullet' if level == 0 else f'List Bullet {level + 1}')
            p.style.font.size = Pt(11)
            p.paragraph_format.left_indent = Cm(level * 1.27)
        
        return self
    
    def add_numbered_list(self, items, level=0):
        """添加编号列表"""
        for item in items:
            p = self.doc.add_paragraph(item, style='List Number' if level == 0 else f'List Number {level + 1}')
            p.style.font.size = Pt(11)
            p.paragraph_format.left_indent = Cm(level * 1.27)
        
        return self
    
    def add_page_break(self):
        """添加分页符"""
        self.doc.add_page_break()
        return self
    
    def add_header(self, text):
        """添加页眉"""
        section = self.doc.sections[0]
        header = section.header
        header_para = header.paragraphs[0]
        header_para.text = text
        header_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        header_para.style.font.size = Pt(9)
        header_para.style.font.color.rgb = RGBColor(128, 128, 128)
        
        return self
    
    def add_footer(self, text, include_page_number=True):
        """添加页脚"""
        section = self.doc.sections[0]
        footer = section.footer
        
        if include_page_number:
            # 添加页码
            footer_para = footer.paragraphs[0]
            footer_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
            
            # 创建页码字段
            run = footer_para.add_run()
            fldChar1 = OxmlElement('w:fldChar')
            fldChar1.set(qn('w:fldCharType'), 'begin')
            
            instrText = OxmlElement('w:instrText')
            instrText.text = "PAGE"
            
            fldChar2 = OxmlElement('w:fldChar')
            fldChar2.set(qn('w:fldCharType'), 'end')
            
            run._r.append(fldChar1)
            run._r.append(instrText)
            run._r.append(fldChar2)
            
            # 添加分隔符和总页数
            footer_para.add_run(" / ")
            
            run2 = footer_para.add_run()
            fldChar3 = OxmlElement('w:fldChar')
            fldChar3.set(qn('w:fldCharType'), 'begin')
            
            instrText2 = OxmlElement('w:instrText')
            instrText2.text = "NUMPAGES"
            
            fldChar4 = OxmlElement('w:fldChar')
            fldChar4.set(qn('w:fldCharType'), 'end')
            
            run2._r.append(fldChar3)
            run2._r.append(instrText2)
            run2._r.append(fldChar4)
            
            # 添加自定义文本
            if text:
                footer_para.add_run(f" | {text}")
        else:
            # 只添加文本
            footer_para = footer.paragraphs[0]
            footer_para.text = text
            footer_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        footer_para.style.font.size = Pt(9)
        footer_para.style.font.color.rgb = RGBColor(128, 128, 128)
        
        return self
    
    def add_image(self, image_path, width=None, height=None, 
                 caption=None, alignment='center'):
        """添加图片"""
        if width and height:
            self.doc.add_picture(image_path, width=Cm(width), height=Cm(height))
        elif width:
            self.doc.add_picture(image_path, width=Cm(width))
        elif height:
            self.doc.add_picture(image_path, height=Cm(height))
        else:
            self.doc.add_picture(image_path, width=Cm(12))  # 默认宽度
        
        # 设置对齐
        last_paragraph = self.doc.paragraphs[-1]
        alignments = {
            'left': WD_ALIGN_PARAGRAPH.LEFT,
            'center': WD_ALIGN_PARAGRAPH.CENTER,
            'right': WD_ALIGN_PARAGRAPH.RIGHT
        }
        last_paragraph.alignment = alignments.get(alignment, WD_ALIGN_PARAGRAPH.CENTER)
        
        # 添加标题
        if caption:
            self.add_paragraph(caption, style='Caption', alignment=alignment)
        
        return self
    
    def add_hyperlink(self, text, url):
        """添加超链接"""
        paragraph = self.doc.add_paragraph()
        
        # 添加链接部分
        hyperlink = OxmlElement('w:hyperlink')
        hyperlink.set(qn('r:id'), self.doc.part.relate_to(
            url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink'
        ))
        
        # 创建链接文本
        new_run = OxmlElement('w:r')
        rPr = OxmlElement('w:rPr')
        
        # 设置链接样式
        color = OxmlElement('w:color')
        color.set(qn('w:val'), "0000FF")
        rPr.append(color)
        
        underline = OxmlElement('w:u')
        underline.set(qn('w:val'), "single")
        rPr.append(underline)
        
        new_run.append(rPr)
        
        text_element = OxmlElement('w:t')
        text_element.text = text
        new_run.append(text_element)
        
        hyperlink.append(new_run)
        paragraph._p.append(hyperlink)
        
        return self
    
    def save(self, filename):
        """保存文档"""
        self.doc.save(filename)
        print(f"Word文档已保存: {filename}")
        return filename

# 使用示例
def generate_project_report():
    """生成项目报告示例"""
    generator = WordReportGenerator("2025年第四季度项目总结报告")
    
    # 添加基本信息
    generator.add_paragraph(
        f"生成时间: {datetime.datetime.now().strftime('%Y年%m月%d日 %H:%M:%S')}",
        alignment='right',
        color=(128, 128, 128)
    )
    
    generator.add_page_break()
    
    # 添加目录
    generator.add_title("目录", 1)
    generator.add_paragraph("1. 项目概述 ............................ 3")
    generator.add_paragraph("2. 项目成果 ............................ 4")
    generator.add_paragraph("3. 数据分析 ............................ 5")
    generator.add_paragraph("4. 问题与挑战 .......................... 6")
    generator.add_paragraph("5. 下一步计划 .......................... 7")
    
    generator.add_page_break()
    
    # 项目概述
    generator.add_title("1. 项目概述", 1)
    generator.add_paragraph(
        "本项目旨在开发一套全新的自动化办公系统，提高团队工作效率，减少人工操作错误。"
    )
    
    generator.add_bullet_list([
        "项目周期: 2025年10月-2025年12月",
        "项目预算: ¥500,000",
        "团队成员: 15人",
        "技术栈: Python, Vue.js, PostgreSQL, Docker"
    ])
    
    # 项目成果
    generator.add_title("2. 项目成果", 1)
    
    # 添加表格
    table_data = [
        ["模块", "完成度", "负责人", "备注"],
        ["用户管理", "100%", "张三", "已上线"],
        ["权限管理", "100%", "李四", "已上线"],
        ["工作流引擎", "95%", "王五", "测试中"],
        ["报表系统", "90%", "赵六", "开发中"],
        ["移动端适配", "85%", "钱七", "设计阶段"]
    ]
    
    generator.add_table(
        table_data,
        col_widths=[4, 3, 3, 4]
    )
    
    # 数据分析
    generator.add_title("3. 数据分析", 1)
    generator.add_paragraph("以下是项目关键指标分析:")
    
    generator.add_numbered_list([
        "开发效率提升: 相比传统方式，开发效率提升40%",
        "错误率降低: 系统上线后，操作错误率降低85%",
        "响应时间: 系统平均响应时间小于500ms",
        "用户满意度: 用户满意度调查得分为4.8/5.0"
    ])
    
    # 添加页眉页脚
    generator.add_header("2025年第四季度项目总结报告 - 机密")
    generator.add_footer("自动化办公系统项目组", include_page_number=True)
    
    # 保存文档
    filename = generator.save("project_report.docx")
    return filename

# 运行示例
if __name__ == '__main__':
    report_file = generate_project_report()
    print(f"项目报告已生成: {report_file}")
\`\`\`

## 3. 邮件自动化

### 发送带附件的邮件
\`\`\`python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from email.mime.image import MIMEImage
from email.header import Header
import os
import mimetypes

class EmailSender:
    def __init__(self, smtp_server, smtp_port, username, password, use_tls=True):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
        self.use_tls = use_tls
        
    def create_message(self, to_emails, subject, body, 
                      cc_emails=None, bcc_emails=None, 
                      reply_to=None, sender_name=None):
        """创建邮件消息"""
        if not isinstance(to_emails, list):
            to_emails = [to_emails]
        
        # 创建邮件
        msg = MIMEMultipart('mixed')
        
        # 设置发件人
        if sender_name:
            msg['From'] = f"{Header(sender_name, 'utf-8').encode()} <{self.username}>"
        else:
            msg['From'] = self.username
        
        # 设置收件人
        msg['To'] = ', '.join(to_emails)
        
        # 设置抄送
        if cc_emails:
            if not isinstance(cc_emails, list):
                cc_emails = [cc_emails]
            msg['Cc'] = ', '.join(cc_emails)
        
        # 设置密送
        if bcc_emails:
            if not isinstance(bcc_emails, list):
                bcc_emails = [bcc_emails]
            msg['Bcc'] = ', '.join(bcc_emails)
        
        # 设置回复地址
        if reply_to:
            msg['Reply-To'] = reply_to
        
        # 设置主题
        msg['Subject'] = Header(subject, 'utf-8').encode()
        
        # 添加正文
        if '<html>' in body or '<HTML>' in body:
            # HTML内容
            msg.attach(MIMEText(body, 'html', 'utf-8'))
        else:
            # 纯文本内容
            msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        return msg, to_emails + (cc_emails or []) + (bcc_emails or [])
    
    def attach_file(self, msg, filepath, filename=None):
        """添加附件"""
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"文件不存在: {filepath}")
        
        if not filename:
            filename = os.path.basename(filepath)
        
        # 获取文件类型
        ctype, encoding = mimetypes.guess_type(filepath)
        if ctype is None or encoding is not None:
            ctype = 'application/octet-stream'
        
        maintype, subtype = ctype.split('/', 1)
        
        with open(filepath, 'rb') as f:
            if maintype == 'text':
                # 文本文件
                attachment = MIMEText(f.read().decode('utf-8'), _subtype=subtype, _charset='utf-8')
            elif maintype == 'image':
                # 图片文件
                attachment = MIMEImage(f.read(), _subtype=subtype)
            else:
                # 其他文件
                attachment = MIMEApplication(f.read(), _subtype=subtype)
        
        attachment.add_header('Content-Disposition', 'attachment', filename=filename)
        attachment.add_header('Content-ID', f'<{filename}>')
        
        msg.attach(attachment)
        return msg
    
    def attach_files(self, msg, filepaths):
        """添加多个附件"""
        for filepath in filepaths:
            if os.path.exists(filepath):
                msg = self.attach_file(msg, filepath)
            else:
                print(f"警告: 文件不存在，跳过: {filepath}")
        
        return msg
    
    def attach_inline_image(self, msg, image_path, cid):
        """添加内联图片"""
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"图片不存在: {image_path}")
        
        with open(image_path, 'rb') as f:
            img = MIMEImage(f.read())
        
        img.add_header('Content-ID', f'<{cid}>')
        img.add_header('Content-Disposition', 'inline')
        
        msg.attach(img)
        return msg
    
    def send(self, to_emails, subject, body, attachments=None, 
            cc_emails=None, bcc_emails=None, **kwargs):
        """发送邮件"""
        try:
            # 创建消息
            msg, all_recipients = self.create_message(
                to_emails, subject, body, cc_emails, bcc_emails,
                kwargs.get('reply_to'), kwargs.get('sender_name')
            )
            
            # 添加附件
            if attachments:
                if isinstance(attachments, str):
                    attachments = [attachments]
                msg = self.attach_files(msg, attachments)
            
            # 连接服务器
            if self.use_tls:
                server = smtplib.SMTP(self.smtp_server, self.smtp_port)
                server.starttls()
            else:
                server = smtplib.SMTP_SSL(self.smtp_server, self.smtp_port)
            
            # 登录
            server.login(self.username, self.password)
            
            # 发送邮件
            server.send_message(msg, from_addr=self.username, to_addrs=all_recipients)
            
            # 断开连接
            server.quit()
            
            print(f"邮件发送成功到: {', '.join(to_emails)}")
            return True
            
        except Exception as e:
            print(f"邮件发送失败: {str(e)}")
            return False

class EmailTemplate:
    """邮件模板"""
    
    @staticmethod
    def daily_report_template(data):
        """每日报告模板"""
        html = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>每日工作报告</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
                .content {{ background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }}
                .stats {{ display: flex; justify-content: space-between; margin: 20px 0; }}
                .stat-item {{ flex: 1; text-align: center; padding: 15px; background: white; margin: 0 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }}
                .stat-value {{ font-size: 24px; font-weight: bold; color: #4CAF50; }}
                .stat-label {{ font-size: 14px; color: #666; }}
                .section {{ margin-bottom: 30px; }}
                .section-title {{ color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }}
                table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
                th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }}
                th {{ background-color: #f2f2f2; }}
                .highlight {{ background-color: #ffffcc; padding: 10px; border-left: 4px solid #ffcc00; margin: 15px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>每日工作报告</h1>
                    <p>{data['date']}</p>
                </div>
                
                <div class="content">
                    <div class="stats">
                        <div class="stat-item">
                            <div class="stat-value">{data['total_tasks']}</div>
                            <div class="stat-label">总任务数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{data['completed_tasks']}</div>
                            <div class="stat-label">已完成</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{data['in_progress']}</div>
                            <div class="stat-label">进行中</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">{data['pending']}</div>
                            <div class="stat-label">待处理</div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">任务概览</h2>
                        <table>
                            <tr>
                                <th>任务名称</th>
                                <th>负责人</th>
                                <th>状态</th>
                                <th>截止时间</th>
                                <th>进度</th>
                            </tr>
        '''
        
        # 添加任务行
        for task in data['tasks']:
            html += f'''
                            <tr>
                                <td>{task['name']}</td>
                                <td>{task['assignee']}</td>
                                <td>{task['status']}</td>
                                <td>{task['deadline']}</td>
                                <td>{task['progress']}%</td>
                            </tr>
            '''
        
        html += f'''
                        </table>
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">今日完成</h2>
                        <ul>
        '''
        
        # 添加完成事项
        for item in data['completed_items']:
            html += f'<li>{item}</li>'
        
        html += f'''
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">明日计划</h2>
                        <ul>
        '''
        
        # 添加明日计划
        for plan in data['tomorrow_plans']:
            html += f'<li>{plan}</li>'
        
        html += f'''
                        </ul>
                    </div>
                    
                    <div class="highlight">
                        <strong>重要提醒：</strong> {data['reminder']}
                    </div>
                    
                    <div class="footer">
                        <p>此邮件由自动化系统生成，请勿直接回复</p>
                        <p>如有问题，请联系技术支持</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        '''
        
        return html
    
    @staticmethod
    def notification_template(data):
        """通知模板"""
        return f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>系统通知</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <div style="background-color: #4CAF50; color: white; padding: 15px; border-radius: 5px 5px 0 0; text-align: center;">
                    <h2>{data['title']}</h2>
                </div>
                
                <div style="padding: 20px;">
                    <p>亲爱的 {data['recipient']},</p>
                    
                    <p>{data['message']}</p>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>详细信息：</strong></p>
                        <p>{data['details']}</p>
                    </div>
                    
                    <p><strong>时间：</strong> {data['time']}</p>
                    <p><strong>地点：</strong> {data['location']}</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{data['action_url']}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            {data['action_text']}
                        </a>
                    </div>
                    
                    <p>此致<br>系统管理员</p>
                </div>
                
                <div style="text-align: center; color: #666; font-size: 12px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <p>此邮件由系统自动发送，请勿直接回复</p>
                </div>
            </div>
        </body>
        </html>
        '''

# 使用示例
def send_daily_report():
    """发送每日报告示例"""
    # 配置邮件服务器
    sender = EmailSender(
        smtp_server='smtp.gmail.com',
        smtp_port=587,
        username='your_email@gmail.com',
        password='your_app_password',
        use_tls=True
    )
    
    # 准备数据
    report_data = {
        'date': '2025年12月24日',
        'total_tasks': 15,
        'completed_tasks': 10,
        'in_progress': 3,
        'pending': 2,
        'tasks': [
            {'name': '用户认证模块', 'assignee': '张三', 'status': '已完成', 'deadline': '2025-12-24', 'progress': 100},
            {'name': '支付接口集成', 'assignee': '李四', 'status': '进行中', 'deadline': '2025-12-26', 'progress': 75},
            {'name': '移动端适配', 'assignee': '王五', 'status': '进行中', 'deadline': '2025-12-28', 'progress': 60},
            {'name': '性能测试', 'assignee': '赵六', 'status': '待处理', 'deadline': '2025-12-30', 'progress': 0}
        ],
        'completed_items': [
            '完成用户登录功能开发',
            '修复了支付接口的BUG',
            '优化了数据库查询性能',
            '完成了单元测试编写'
        ],
        'tomorrow_plans': [
            '进行系统集成测试',
            '编写用户使用手册',
            '部署到测试环境',
            '进行安全扫描'
        ],
        'reminder': '请各位成员在明天上午10点前提交进度报告'
    }
    
    # 生成邮件内容
    html_content = EmailTemplate.daily_report_template(report_data)
    
    # 发送邮件
    success = sender.send(
        to_emails=['manager@company.com', 'team@company.com'],
        cc_emails=['tech_lead@company.com'],
        subject='每日工作报告 - 2025年12月24日',
        body=html_content,
        attachments=['daily_report.xlsx', 'daily_summary.pdf'],
        sender_name='自动化报告系统'
    )
    
    return success

# 运行示例
if __name__ == '__main__':
    if send_daily_report():
        print("每日报告邮件发送成功")
    else:
        print("每日报告邮件发送失败")
\`\`\`

## 4. 自动化脚本调度

### 使用APScheduler定时任务
\`\`\`python
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger
from apscheduler.events import EVENT_JOB_EXECUTED, EVENT_JOB_ERROR
import datetime
import time
import logging

class TaskScheduler:
    def __init__(self):
        # 配置日志
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('scheduler.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # 创建调度器
        self.scheduler = BackgroundScheduler()
        
        # 添加事件监听
        self.scheduler.add_listener(self.job_executed, EVENT_JOB_EXECUTED)
        self.scheduler.add_listener(self.job_error, EVENT_JOB_ERROR)
        
        # 任务历史
        self.job_history = []
        
    def job_executed(self, event):
        """任务执行成功事件"""
        job = self.scheduler.get_job(event.job_id)
        if job:
            self.logger.info(f"任务执行成功: {job.name} (ID: {event.job_id})")
            self.job_history.append({
                'job_id': event.job_id,
                'job_name': job.name,
                'time': datetime.datetime.now(),
                'status': 'success',
                'retval': event.retval
            })
    
    def job_error(self, event):
        """任务执行失败事件"""
        job = self.scheduler.get_job(event.job_id)
        if job:
            self.logger.error(f"任务执行失败: {job.name} (ID: {event.job_id}) - {event.exception}")
            self.job_history.append({
                'job_id': event.job_id,
                'job_name': job.name,
                'time': datetime.datetime.now(),
                'status': 'error',
                'exception': str(event.exception),
                'traceback': event.traceback
            })
    
    def add_daily_job(self, func, hour=9, minute=0, name=None, args=None, kwargs=None):
        """添加每日任务"""
        if not name:
            name = func.__name__
        
        trigger = CronTrigger(hour=hour, minute=minute)
        job = self.scheduler.add_job(
            func, 
            trigger=trigger,
            name=name,
            args=args,
            kwargs=kwargs,
            id=f"{name}_{hour}{minute}"
        )
        
        self.logger.info(f"添加每日任务: {name} (每天 {hour:02d}:{minute:02d})")
        return job
    
    def add_interval_job(self, func, interval_minutes=30, name=None, args=None, kwargs=None):
        """添加间隔任务"""
        if not name:
            name = func.__name__
        
        trigger = IntervalTrigger(minutes=interval_minutes)
        job = self.scheduler.add_job(
            func,
            trigger=trigger,
            name=name,
            args=args,
            kwargs=kwargs,
            id=f"{name}_interval{interval_minutes}"
        )
        
        self.logger.info(f"添加间隔任务: {name} (每{interval_minutes}分钟)")
        return job
    
    def add_weekly_job(self, func, day_of_week='mon', hour=10, minute=0, name=None, args=None, kwargs=None):
        """添加每周任务"""
        if not name:
            name = func.__name__
        
        trigger = CronTrigger(day_of_week=day_of_week, hour=hour, minute=minute)
        job = self.scheduler.add_job(
            func,
            trigger=trigger,
            name=name,
            args=args,
            kwargs=kwargs,
            id=f"{name}_{day_of_week}{hour}{minute}"
        )
        
        days = {'mon': '周一', 'tue': '周二', 'wed': '周三', 
                'thu': '周四', 'fri': '周五', 'sat': '周六', 'sun': '周日'}
        day_name = days.get(day_of_week, day_of_week)
        self.logger.info(f"添加每周任务: {name} (每周{day_name} {hour:02d}:{minute:02d})")
        return job
    
    def add_monthly_job(self, func, day=1, hour=9, minute=0, name=None, args=None, kwargs=None):
        """添加每月任务"""
        if not name:
            name = func.__name__
        
        trigger = CronTrigger(day=day, hour=hour, minute=minute)
        job = self.scheduler.add_job(
            func,
            trigger=trigger,
            name=name,
            args=args,
            kwargs=kwargs,
            id=f"{name}_monthly{day}{hour}{minute}"
        )
        
        self.logger.info(f"添加每月任务: {name} (每月{day}号 {hour:02d}:{minute:02d})")
        return job
    
    def add_one_time_job(self, func, run_date, name=None, args=None, kwargs=None):
        """添加一次性任务"""
        if not name:
            name = func.__name__
        
        if isinstance(run_date, str):
            run_date = datetime.datetime.fromisoformat(run_date)
        
        trigger = DateTrigger(run_date=run_date)
        job = self.scheduler.add_job(
            func,
            trigger=trigger,
            name=name,
            args=args,
            kwargs=kwargs,
            id=f"{name}_once_{run_date.strftime('%Y%m%d%H%M')}"
        )
        
        self.logger.info(f"添加一次性任务: {name} ({run_date})")
        return job
    
    def remove_job(self, job_id):
        """移除任务"""
        try:
            self.scheduler.remove_job(job_id)
            self.logger.info(f"移除任务: {job_id}")
            return True
        except Exception as e:
            self.logger.error(f"移除任务失败 {job_id}: {e}")
            return False
    
    def pause_job(self, job_id):
        """暂停任务"""
        try:
            self.scheduler.pause_job(job_id)
            self.logger.info(f"暂停任务: {job_id}")
            return True
        except Exception as e:
            self.logger.error(f"暂停任务失败 {job_id}: {e}")
            return False
    
    def resume_job(self, job_id):
        """恢复任务"""
        try:
            self.scheduler.resume_job(job_id)
            self.logger.info(f"恢复任务: {job_id}")
            return True
        except Exception as e:
            self.logger.error(f"恢复任务失败 {job_id}: {e}")
            return False
    
    def get_job_status(self, job_id):
        """获取任务状态"""
        job = self.scheduler.get_job(job_id)
        if not job:
            return None
        
        return {
            'id': job.id,
            'name': job.name,
            'trigger': str(job.trigger),
            'next_run_time': job.next_run_time,
            'paused': job.pending
        }
    
    def list_jobs(self):
        """列出所有任务"""
        jobs = self.scheduler.get_jobs()
        job_list = []
        
        for job in jobs:
            job_list.append({
                'id': job.id,
                'name': job.name,
                'trigger': str(job.trigger),
                'next_run_time': job.next_run_time,
                'paused': job.pending
            })
        
        return job_list
    
    def get_job_history(self, limit=50):
        """获取任务历史"""
        return self.job_history[-limit:] if self.job_history else []
    
    def start(self):
        """启动调度器"""
        self.scheduler.start()
        self.logger.info("任务调度器已启动")
        
        # 保持主线程运行
        try:
            while True:
                time.sleep(1)
        except (KeyboardInterrupt, SystemExit):
            self.shutdown()
    
    def shutdown(self):
        """关闭调度器"""
        self.scheduler.shutdown()
        self.logger.info("任务调度器已关闭")

# 示例任务函数
def backup_database():
    """备份数据库任务"""
    print(f"[{datetime.datetime.now()}] 开始备份数据库...")
    # 模拟备份操作
    time.sleep(2)
    print(f"[{datetime.datetime.now()}] 数据库备份完成")
    return "backup_success"

def send_daily_report():
    """发送每日报告任务"""
    print(f"[{datetime.datetime.now()}] 开始生成并发送每日报告...")
    # 模拟报告生成和发送
    time.sleep(3)
    print(f"[{datetime.datetime.now()}] 每日报告发送完成")
    return "report_sent"

def cleanup_temp_files():
    """清理临时文件任务"""
    print(f"[{datetime.datetime.now()}] 开始清理临时文件...")
    # 模拟清理操作
    time.sleep(1)
    print(f"[{datetime.datetime.now()}] 临时文件清理完成")
    return "cleanup_done"

def check_system_health():
    """检查系统健康状态任务"""
    print(f"[{datetime.datetime.now()}] 开始检查系统健康状态...")
    # 模拟检查操作
    time.sleep(1)
    print(f"[{datetime.datetime.now()}] 系统健康检查完成")
    return {"status": "healthy", "timestamp": datetime.datetime.now()}

# 使用示例
def setup_scheduler():
    """设置调度器示例"""
    scheduler = TaskScheduler()
    
    # 添加每日任务：早上9点备份数据库
    scheduler.add_daily_job(
        backup_database,
        hour=9,
        minute=0,
        name="每日数据库备份"
    )
    
    # 添加每日任务：下午5点发送报告
    scheduler.add_daily_job(
        send_daily_report,
        hour=17,
        minute=0,
        name="发送每日报告"
    )
    
    # 添加间隔任务：每30分钟检查系统健康
    scheduler.add_interval_job(
        check_system_health,
        interval_minutes=30,
        name="系统健康检查"
    )
    
    # 添加每周任务：每周一早上10点清理临时文件
    scheduler.add_weekly_job(
        cleanup_temp_files,
        day_of_week='mon',
        hour=10,
        minute=0,
        name="每周临时文件清理"
    )
    
    # 添加一次性任务：明天中午12点执行特殊任务
    tomorrow = datetime.datetime.now() + datetime.timedelta(days=1)
    tomorrow_noon = tomorrow.replace(hour=12, minute=0, second=0, microsecond=0)
    
    scheduler.add_one_time_job(
        lambda: print("执行一次性特殊任务"),
        run_date=tomorrow_noon,
        name="一次性特殊任务"
    )
    
    return scheduler

# 运行调度器
if __name__ == '__main__':
    scheduler = setup_scheduler()
    
    # 打印任务列表
    print("当前任务列表:")
    for job in scheduler.list_jobs():
        print(f"  - {job['name']} (ID: {job['id']})")
        print(f"    下次运行: {job['next_run_time']}")
        print(f"    触发器: {job['trigger']}")
    
    # 启动调度器
    print("\\n启动任务调度器...")
    print("按 Ctrl+C 停止")
    scheduler.start()
\`\`\`

## 5. 自动化测试与验证

### 自动化测试框架
\`\`\`python
import unittest
from unittest.mock import Mock, patch, MagicMock
import pandas as pd
from openpyxl import load_workbook
from docx import Document
import os
import shutil
import tempfile

class TestExcelProcessor(unittest.TestCase):
    def setUp(self):
        """测试前准备"""
        self.test_dir = tempfile.mkdtemp()
        self.test_file = os.path.join(self.test_dir, 'test.xlsx')
        
    def tearDown(self):
        """测试后清理"""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)
    
    def test_create_workbook(self):
        """测试创建工作簿"""
        from ExcelProcessor import ExcelProcessor
        
        processor = ExcelProcessor()
        processor.create_workbook("测试工作簿")
        
        self.assertIsNotNone(processor.wb)
        self.assertIsNotNone(processor.ws)
        self.assertEqual(processor.ws.title, "测试工作簿")
    
    def test_set_headers(self):
        """测试设置表头"""
        from ExcelProcessor import ExcelProcessor
        
        processor = ExcelProcessor()
        processor.create_workbook()
        
        headers = ['姓名', '年龄', '邮箱']
        processor.set_headers(headers)
        
        # 验证表头
        for i, header in enumerate(headers, 1):
            cell_value = processor.ws.cell(row=1, column=i).value
            self.assertEqual(cell_value, header)
    
    def test_add_data(self):
        """测试添加数据"""
        from ExcelProcessor import ExcelProcessor
        
        processor = ExcelProcessor()
        processor.create_workbook()
        
        headers = ['姓名', '年龄']
        data = [
            {'姓名': '张三', '年龄': 25},
            {'姓名': '李四', '年龄': 30}
        ]
        
        processor.set_headers(headers)
        processor.add_data(data)
        
        # 验证数据
        for i, item in enumerate(data, 2):
            self.assertEqual(processor.ws.cell(row=i, column=1).value, item['姓名'])
            self.assertEqual(processor.ws.cell(row=i, column=2).value, item['年龄'])
    
    def test_save_file(self):
        """测试保存文件"""
        from ExcelProcessor import ExcelProcessor
        
        processor = ExcelProcessor()
        processor.create_workbook("测试")
        processor.save(self.test_file)
        
        self.assertTrue(os.path.exists(self.test_file))
        
        # 验证文件内容
        wb = load_workbook(self.test_file)
        ws = wb.active
        self.assertEqual(ws.title, "测试")

class TestWordReportGenerator(unittest.TestCase):
    def setUp(self):
        """测试前准备"""
        self.test_dir = tempfile.mkdtemp()
        self.test_file = os.path.join(self.test_dir, 'test.docx')
        
    def tearDown(self):
        """测试后清理"""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)
    
    def test_create_document(self):
        """测试创建文档"""
        from WordReportGenerator import WordReportGenerator
        
        generator = WordReportGenerator("测试文档")
        
        self.assertIsNotNone(generator.doc)
        self.assertEqual(len(generator.doc.paragraphs), 1)
        
        # 验证标题
        title_para = generator.doc.paragraphs[0]
        self.assertEqual(title_para.text, "测试文档")
    
    def test_add_paragraph(self):
        """测试添加段落"""
        from WordReportGenerator import WordReportGenerator
        
        generator = WordReportGenerator()
        generator.add_paragraph("测试段落", bold=True, color=(255, 0, 0))
        
        self.assertEqual(len(generator.doc.paragraphs), 1)
        
        para = generator.doc.paragraphs[0]
        self.assertEqual(para.text, "测试段落")
        self.assertTrue(para.runs[0].bold)
    
    def test_add_table(self):
        """测试添加表格"""
        from WordReportGenerator import WordReportGenerator
        
        generator = WordReportGenerator()
        
        data = [
            ['张三', 25, 'zhangsan@example.com'],
            ['李四', 30, 'lisi@example.com']
        ]
        headers = ['姓名', '年龄', '邮箱']
        
        generator.add_table(data, headers=headers)
        
        # 验证表格
        tables = generator.doc.tables
        self.assertEqual(len(tables), 1)
        
        table = tables[0]
        self.assertEqual(len(table.rows), 3)  # 表头 + 2行数据
        self.assertEqual(len(table.columns), 3)
    
    def test_save_document(self):
        """测试保存文档"""
        from WordReportGenerator import WordReportGenerator
        
        generator = WordReportGenerator("测试文档")
        generator.add_paragraph("这是一个测试文档")
        generator.save(self.test_file)
        
        self.assertTrue(os.path.exists(self.test_file))
        
        # 验证文件内容
        doc = Document(self.test_file)
        self.assertEqual(len(doc.paragraphs), 2)  # 标题 + 段落

class TestEmailSender(unittest.TestCase):
    def setUp(self):
        """测试前准备"""
        self.test_dir = tempfile.mkdtemp()
        
    def tearDown(self):
        """测试后清理"""
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)
    
    @patch('smtplib.SMTP')
    def test_send_email(self, mock_smtp):
        """测试发送邮件"""
        from EmailSender import EmailSender
        
        # 模拟SMTP
        mock_server = Mock()
        mock_smtp.return_value = mock_server
        
        # 创建发送器
        sender = EmailSender(
            smtp_server='smtp.test.com',
            smtp_port=587,
            username='test@test.com',
            password='password'
        )
        
        # 发送测试邮件
        success = sender.send(
            to_emails='recipient@test.com',
            subject='测试邮件',
            body='测试内容'
        )
        
        # 验证
        self.assertTrue(success)
        mock_smtp.assert_called_once_with('smtp.test.com', 587)
        mock_server.starttls.assert_called_once()
        mock_server.login.assert_called_once_with('test@test.com', 'password')
        mock_server.send_message.assert_called_once()
        mock_server.quit.assert_called_once()
    
    def test_create_message(self):
        """测试创建消息"""
        from EmailSender import EmailSender
        
        sender = EmailSender(
            smtp_server='smtp.test.com',
            smtp_port=587,
            username='sender@test.com',
            password='password'
        )
        
        msg, recipients = sender.create_message(
            to_emails=['to1@test.com', 'to2@test.com'],
            subject='测试主题',
            body='测试内容',
            cc_emails='cc@test.com',
            sender_name='测试发件人'
        )
        
        # 验证消息头
        self.assertEqual(msg['From'], '测试发件人 <sender@test.com>')
        self.assertEqual(msg['To'], 'to1@test.com, to2@test.com')
        self.assertEqual(msg['Cc'], 'cc@test.com')
        self.assertEqual(msg['Subject'], '测试主题')
        
        # 验证收件人列表
        self.assertEqual(len(recipients), 3)
        self.assertIn('to1@test.com', recipients)
        self.assertIn('to2@test.com', recipients)
        self.assertIn('cc@test.com', recipients)

class IntegrationTests(unittest.TestCase):
    """集成测试"""
    
    def test_complete_workflow(self):
        """测试完整工作流程"""
        import sys
        import io
        
        # 重定向输出
        captured_output = io.StringIO()
        sys.stdout = captured_output
        
        try:
            # 创建测试数据
            test_data = [
                {'name': '产品A', 'sales': 100, 'profit': 20},
                {'name': '产品B', 'sales': 150, 'profit': 30},
                {'name': '产品C', 'sales': 200, 'profit': 40}
            ]
            
            # 1. 创建Excel报告
            from ExcelProcessor import ExcelProcessor
            
            excel_processor = ExcelProcessor()
            excel_processor.create_workbook("销售报告") \\
                .set_headers(['产品', '销售额', '利润']) \\
                .add_data([
                    [item['name'], item['sales'], item['profit']]
                    for item in test_data
                ]) \\
                .add_formulas({
                    'D2': '=SUM(B2:B4)',
                    'D3': '=SUM(C2:C4)'
                }) \\
                .save('test_report.xlsx')
            
            # 验证Excel文件
            self.assertTrue(os.path.exists('test_report.xlsx'))
            
            # 2. 创建Word报告
            from WordReportGenerator import WordReportGenerator
            
            word_generator = WordReportGenerator("销售分析报告")
            word_generator.add_paragraph("以下是产品销售情况分析:")
            
            # 添加表格
            table_data = [
                ['产品', '销售额', '利润', '利润率'],
                ['产品A', '100', '20', '20%'],
                ['产品B', '150', '30', '20%'],
                ['产品C', '200', '40', '20%']
            ]
            
            word_generator.add_table(table_data) \\
                .add_paragraph("总结：所有产品利润率均为20%", bold=True) \\
                .save('test_report.docx')
            
            # 验证Word文件
            self.assertTrue(os.path.exists('test_report.docx'))
            
            # 3. 清理
            if os.path.exists('test_report.xlsx'):
                os.remove('test_report.xlsx')
            if os.path.exists('test_report.docx'):
                os.remove('test_report.docx')
            
            print_output = captured_output.getvalue()
            self.assertIn('文件已保存', print_output)
            self.assertIn('Word文档已保存', print_output)
            
        finally:
            # 恢复标准输出
            sys.stdout = sys.__stdout__
            
            # 清理可能存在的文件
            for filename in ['test_report.xlsx', 'test_report.docx']:
                if os.path.exists(filename):
                    os.remove(filename)

# 运行测试
if __name__ == '__main__':
    # 创建测试套件
    suite = unittest.TestSuite()
    
    # 添加测试类
    suite.addTest(unittest.makeSuite(TestExcelProcessor))
    suite.addTest(unittest.makeSuite(TestWordReportGenerator))
    suite.addTest(unittest.makeSuite(TestEmailSender))
    suite.addTest(unittest.makeSuite(IntegrationTests))
    
    # 运行测试
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # 输出结果
    print(f"\\n测试结果: {result.testsRun} 个测试执行")
    print(f"失败: {len(result.failures)}")
    print(f"错误: {len(result.errors)}")
    
    if result.wasSuccessful():
        print("所有测试通过！")
    else:
        print("部分测试失败")
\`\`\`

## 总结

Python自动化办公具有以下核心优势：

### 主要应用场景：
1. **数据处理与分析**：Excel、CSV、数据库等数据处理
2. **文档生成**：自动生成Word、PDF报告
3. **邮件自动化**：定时发送报告、通知
4. **任务调度**：自动化执行重复性任务
5. **系统集成**：连接不同系统，实现数据同步

### 关键技术：
1. **openpyxl/pandas**：Excel数据处理
2. **python-docx**：Word文档处理
3. **smtplib/email**：邮件发送
4. **APScheduler**：任务调度
5. **unittest**：自动化测试

### 最佳实践：
1. **模块化设计**：每个功能独立为模块
2. **错误处理**：完善的异常处理和日志记录
3. **配置化管理**：将配置抽离为配置文件
4. **自动化测试**：确保代码质量
5. **文档化**：编写清晰的文档和使用说明

通过掌握这些技术，您可以大大提高办公效率，将时间投入到更有价值的工作中。`,
    date: '2025-12-20',
    author: 'Python自动化专家',
    category: 'Python',
    categoryColor: '#3776ab',
    views: 2780,
    likes: 410,
    comments: 63,
    tags: ['Python', '自动化', '办公', 'Excel', 'Word', 'PDF'],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop'
  },
  {
    id: 6,
    title: 'Vue 3 企业级项目架构指南',
    content: `# Vue 3 企业级项目架构指南

构建一个可维护、可扩展、高性能的Vue 3企业级应用需要良好的架构设计。本文将详细介绍Vue 3企业级项目的最佳实践。

## 1. 项目结构设计

### 标准企业级项目结构
\`\`\`
src/
├── assets/              # 静态资源
│   ├── images/         # 图片资源
│   ├── fonts/          # 字体文件
│   ├── styles/         # 全局样式
│   │   ├── variables.scss    # SCSS变量
│   │   ├── mixins.scss       # SCSS混入
│   │   ├── base.scss         # 基础样式
│   │   ├── components.scss   # 组件样式
│   │   └── index.scss        # 样式入口
│   └── icons/          # 图标文件
├── components/         # 通用组件库
│   ├── common/        # 基础组件（Button, Input, Modal等）
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseTable.vue
│   │   ├── BaseModal.vue
│   │   ├── BaseForm.vue
│   │   └── index.ts   # 统一导出
│   ├── layout/        # 布局组件
│   │   ├── BasicLayout.vue
│   │   ├── PageHeader.vue
│   │   ├── Sidebar.vue
│   │   └── Footer.vue
│   ├── business/      # 业务组件
│   └── index.ts       # 组件库入口
├── composables/        # 组合式函数
│   ├── useApi/        # API相关组合式函数
│   │   ├── useFetch.ts
│   │   ├── usePagination.ts
│   │   └── index.ts
│   ├── useAuth/       # 认证相关
│   ├── useTable/      # 表格相关
│   ├── useForm/       # 表单相关
│   ├── useDialog/     # 对话框相关
│   ├── useLoading/    # 加载状态
│   └── index.ts       # 统一导出
├── stores/            # 状态管理（Pinia）
│   ├── modules/       # 模块化store
│   │   ├── user.ts    # 用户模块
│   │   ├── app.ts     # 应用模块
│   │   ├── permission.ts # 权限模块
│   │   └── tab.ts     # 标签页模块
│   └── index.ts       # store入口
├── router/            # 路由配置
│   ├── modules/       # 路由模块
│   │   ├── dashboard.ts
│   │   ├── system.ts
│   │   └── user.ts
│   ├── guards/        # 路由守卫
│   │   ├── auth.ts    # 认证守卫
│   │   └── permission.ts # 权限守卫
│   ├── types/         # 路由类型定义
│   └── index.ts       # 路由入口
├── views/             # 页面组件
│   ├── dashboard/     # 仪表盘
│   │   ├── components/ # 页面级组件
│   │   └── index.vue
│   ├── system/        # 系统管理
│   │   ├── user/      # 用户管理
│   │   ├── role/      # 角色管理
│   │   └── menu/      # 菜单管理
│   ├── error/         # 错误页面
│   │   ├── 404.vue
│   │   └── 500.vue
│   └── login/         # 登录页面
│       └── index.vue
├── services/          # API服务层
│   ├── api/          # API接口定义
│   │   ├── user.ts
│   │   ├── auth.ts
│   │   └── system.ts
│   ├── types/        # 服务类型定义
│   ├── interceptors/ # 请求拦截器
│   │   ├── request.ts
│   │   └── response.ts
│   └── index.ts      # 服务入口
├── utils/             # 工具函数
│   ├── validators/   # 验证器
│   │   ├── form.ts
│   │   └── regex.ts
│   ├── helpers/      # 辅助函数
│   │   ├── date.ts
│   │   ├── string.ts
│   │   └── object.ts
│   ├── constants/    # 常量定义
│   │   ├── api.ts
│   │   ├── regex.ts
│   │   └── storage.ts
│   ├── storage/      # 存储相关
│   │   ├── local.ts
│   │   └── session.ts
│   └── index.ts      # 工具入口
├── types/             # 全局类型定义
│   ├── global.d.ts   # 全局类型
│   ├── api.d.ts      # API类型
│   ├── component.d.ts # 组件类型
│   └── store.d.ts    # Store类型
├── plugins/           # 插件
│   ├── element-plus.ts # Element Plus插件
│   └── directives.ts # 自定义指令
├── hooks/             # 自定义Hook（Vue 2兼容）
├── locales/           # 国际化
│   ├── zh-CN.ts
│   └── en-US.ts
├── App.vue            # 根组件
└── main.ts            # 应用入口
\`\`\`

## 2. 状态管理设计（Pinia）

### Store模块化设计
\`\`\`typescript
// stores/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import type { User, UserProfile, LoginParams, RegisterParams } from '@/types/user'
import { userService } from '@/services/api/user'
import { usePermissionStore } from './permission'
import { useAppStore } from './app'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>(storage.get('token') || '')
  const currentUser = ref<User | null>(null)
  const userList = ref<User[]>([])
  const userProfile = ref<UserProfile | null>(null)
  
  // UI状态
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 表单状态
  const loginForm = reactive({
    username: '',
    password: '',
    rememberMe: false
  })
  
  const registerForm = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  })
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin')
  const userCount = computed(() => userList.value.length)
  const activeUsers = computed(() => userList.value.filter(user => user.status === 'active'))
  const inactiveUsers = computed(() => userList.value.filter(user => user.status === 'inactive'))
  
  // 用户完整信息（组合多个数据源）
  const fullUserInfo = computed(() => {
    if (!currentUser.value || !userProfile.value) {
      return null
    }
    
    return {
      ...currentUser.value,
      profile: userProfile.value,
      isOnline: userProfile.value.lastActiveAt > Date.now() - 5 * 60 * 1000,
      roles: currentUser.value.roles || [],
      permissions: currentUser.value.permissions || []
    }
  })
  
  // Actions
  async function login(params: LoginParams) {
    try {
      loading.value = true
      error.value = null
      
      const response = await userService.login(params)
      
      // 保存token
      token.value = response.token
      if (params.rememberMe) {
        storage.set('token', response.token, 7 * 24 * 60 * 60 * 1000) // 7天
      } else {
        storage.set('token', response.token)
      }
      
      // 获取用户信息
      await fetchCurrentUser()
      
      // 获取用户权限
      const permissionStore = usePermissionStore()
      await permissionStore.fetchPermissions()
      
      // 记录登录日志
      const appStore = useAppStore()
      appStore.logUserAction('login', { userId: currentUser.value?.id })
      
      return response
    } catch (err: any) {
      error.value = err.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function logout() {
    try {
      loading.value = true
      
      // 调用退出接口
      await userService.logout()
      
      // 清除本地数据
      clearUserData()
      
      // 清除权限信息
      const permissionStore = usePermissionStore()
      permissionStore.clearPermissions()
      
      // 记录退出日志
      const appStore = useAppStore()
      appStore.logUserAction('logout', { userId: currentUser.value?.id })
      
    } catch (err: any) {
      console.error('退出失败:', err)
    } finally {
      loading.value = false
    }
  }
  
  async function fetchCurrentUser() {
    try {
      const response = await userService.getCurrentUser()
      currentUser.value = response.user
      return response.user
    } catch (err: any) {
      // 清除无效token
      if (err.code === 401) {
        clearUserData()
      }
      throw err
    }
  }
  
  async function fetchUserProfile(userId: number) {
    try {
      loading.value = true
      const response = await userService.getUserProfile(userId)
      userProfile.value = response.profile
      return response.profile
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchUserList(params?: Record<string, any>) {
    try {
      loading.value = true
      const response = await userService.getUsers(params)
      userList.value = response.users
      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createUser(userData: RegisterParams) {
    try {
      loading.value = true
      const response = await userService.createUser(userData)
      
      // 添加到用户列表
      userList.value.unshift(response.user)
      
      return response.user
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateUser(userId: number, userData: Partial<User>) {
    try {
      loading.value = true
      const response = await userService.updateUser(userId, userData)
      
      // 更新本地状态
      const index = userList.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        userList.value[index] = { ...userList.value[index], ...response.user }
      }
      
      // 如果是当前用户，也更新
      if (currentUser.value?.id === userId) {
        currentUser.value = { ...currentUser.value, ...response.user }
      }
      
      return response.user
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteUser(userId: number) {
    try {
      loading.value = true
      await userService.deleteUser(userId)
      
      // 从本地状态移除
      userList.value = userList.value.filter(u => u.id !== userId)
      
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      loading.value = true
      await userService.changePassword(oldPassword, newPassword)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function uploadAvatar(file: File) {
    try {
      loading.value = true
      const response = await userService.uploadAvatar(currentUser.value!.id, file)
      
      // 更新用户头像
      if (currentUser.value) {
        currentUser.value.avatar = response.avatarUrl
      }
      
      return response.avatarUrl
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  function clearUserData() {
    token.value = ''
    currentUser.value = null
    userProfile.value = null
    storage.remove('token')
  }
  
  function resetLoginForm() {
    loginForm.username = ''
    loginForm.password = ''
    loginForm.rememberMe = false
  }
  
  function resetRegisterForm() {
    registerForm.username = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    registerForm.phone = ''
  }
  
  return {
    // State
    token,
    currentUser,
    userList,
    userProfile,
    loading,
    error,
    loginForm,
    registerForm,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userCount,
    activeUsers,
    inactiveUsers,
    fullUserInfo,
    
    // Actions
    login,
    logout,
    fetchCurrentUser,
    fetchUserProfile,
    fetchUserList,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    uploadAvatar,
    clearUserData,
    resetLoginForm,
    resetRegisterForm
  }
})
\`\`\`

### Store统一管理
\`\`\`typescript
// stores/index.ts
import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'
import { useUserStore } from './modules/user'
import { useAppStore } from './modules/app'
import { usePermissionStore } from './modules/permission'
import { useTabStore } from './modules/tab'

// 创建Pinia实例
const pinia = createPinia()

// 导出所有store
export { useUserStore, useAppStore, usePermissionStore, useTabStore }

// 导出pinia实例
export default pinia

// 安装Router到Store（可选）
export function setupStoreWithRouter(router: Router) {
  pinia.use(({ store }) => {
    store.router = markRaw(router)
  })
}

// 类型定义
declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router
  }
}
\`\`\`

## 3. 路由与权限控制

### 动态路由配置
\`\`\`typescript
// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 静态路由（不需要权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
    meta: {
      title: '注册',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error/500.vue'),
    meta: {
      title: '500',
      hidden: true,
      noAuth: true
    }
  },
  {
    path: '/',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: '/dashboard',
    meta: {
      title: '首页',
      icon: 'home'
    },
    children: []
  }
]

// 异步路由（需要动态加载）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'dashboard',
      affix: true,
      permissions: ['dashboard:view']
    }
  },
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/PageLayout.vue'),
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'system',
      permissions: ['system:manage']
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user',
          permissions: ['user:view', 'user:manage']
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'role',
          permissions: ['role:view', 'role:manage']
        }
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'menu',
          permissions: ['menu:view', 'menu:manage']
        }
      }
    ]
  },
  {
    path: '/business',
    name: 'Business',
    component: () => import('@/layouts/PageLayout.vue'),
    redirect: '/business/order',
    meta: {
      title: '业务管理',
      icon: 'business',
      permissions: ['business:manage']
    },
    children: [
      {
        path: 'order',
        name: 'BusinessOrder',
        component: () => import('@/views/business/order/index.vue'),
        meta: {
          title: '订单管理',
          icon: 'order',
          permissions: ['order:view', 'order:manage']
        }
      },
      {
        path: 'product',
        name: 'BusinessProduct',
        component: () => import('@/views/business/product/index.vue'),
        meta: {
          title: '产品管理',
          icon: 'product',
          permissions: ['product:view', 'product:manage']
        }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// 进度条配置
NProgress.configure({ 
  showSpinner: false,
  speed: 400,
  minimum: 0.3
})

// 白名单（不需要登录的路径）
const whiteList = ['/login', '/register', '/404', '/500']

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  
  // 获取store
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  
  // 判断是否在免登录白名单
  if (whiteList.includes(to.path)) {
    next()
    NProgress.done()
    return
  }
  
  // 判断是否有token
  if (!userStore.isAuthenticated) {
    // 没有token，跳转到登录页
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    NProgress.done()
    return
  }
  
  // 如果已经登录，访问登录页则重定向到首页
  if (to.path === '/login') {
    next({ path: '/' })
    NProgress.done()
    return
  }
  
  // 判断是否已经获取用户信息
  if (!userStore.currentUser) {
    try {
      // 获取用户信息
      await userStore.fetchCurrentUser()
      
      // 获取用户权限
      await permissionStore.fetchPermissions()
      
      // 生成动态路由
      if (!permissionStore.isRoutesInitialized) {
        const dynamicRoutes = permissionStore.generateRoutes()
        
        // 添加动态路由
        dynamicRoutes.forEach(route => {
          router.addRoute(route)
        })
        
        permissionStore.setRoutesInitialized(true)
        
        // 重新导航到目标路由
        next({ ...to, replace: true })
      } else {
        next()
      }
    } catch (error) {
      // 获取用户信息失败，清除token并跳转到登录页
      userStore.clearUserData()
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      NProgress.done()
    }
  } else {
    // 检查权限
    if (to.meta.permissions) {
      const hasPermission = permissionStore.hasPermission(to.meta.permissions as string[])
      if (!hasPermission) {
        next({ path: '/403' })
        NProgress.done()
        return
      }
    }
    
    next()
  }
})

router.afterEach((to) => {
  // 设置页面标题
  const title = to.meta.title as string || 'Vue Admin'
  document.title = \`\${title} - 管理系统\`
  
  // 关闭进度条
  NProgress.done()
  
  // 记录路由访问（用于标签页）
  const tabStore = useTabStore()
  if (!to.meta.hidden) {
    tabStore.addTab({
      fullPath: to.fullPath,
      path: to.path,
      name: to.name as string,
      meta: to.meta,
      title: to.meta.title as string
    })
  }
})

router.onError((error) => {
  console.error('路由错误:', error)
  NProgress.done()
})

export default router
\`\`\`

### 权限验证指令
\`\`\`typescript
// directives/permission.ts
import type { App, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/modules/permission'

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding
  const permissionStore = usePermissionStore()
  
  if (Array.isArray(value)) {
    if (value.length > 0) {
      const hasPermission = permissionStore.hasPermission(value)
      
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('v-permission指令需要权限数组参数，例如 v-permission="[\'user:add\']"')
    }
  } else if (typeof value === 'string') {
    const hasPermission = permissionStore.hasPermission([value])
    
    if (!hasPermission) {
      el.parentNode?.removeChild(el)
    }
  } else {
    throw new Error('v-permission指令参数格式错误')
  }
}

export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  }
}

export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
}
\`\`\`

## 4. 性能优化策略

### 组件懒加载与代码分割
\`\`\`typescript
// 组件懒加载工具函数
import { defineAsyncComponent } from 'vue'
import { Spin } from 'ant-design-vue'

/**
 * 异步组件加载
 * @param loader 组件加载函数
 * @param options 配置选项
 */
export function lazyLoadComponent(
  loader: () => Promise<any>,
  options: {
    loadingComponent?: any
    delay?: number
    timeout?: number
    errorComponent?: any
    retry?: boolean
    retryCount?: number
  } = {}
) {
  const {
    loadingComponent = Spin,
    delay = 200,
    timeout = 30000,
    errorComponent = null,
    retry = true,
    retryCount = 3
  } = options

  return defineAsyncComponent({
    loader,
    loadingComponent,
    delay,
    timeout,
    errorComponent,
    onError(error, retryFn, fail, attempts) {
      if (retry && attempts <= retryCount) {
        // 重试逻辑
        console.log(\`组件加载失败，第\${attempts}次重试...\`)
        setTimeout(() => {
          retryFn()
        }, 1000 * attempts)
      } else {
        fail()
      }
    }
  })
}

// 页面组件懒加载示例
export const Dashboard = lazyLoadComponent(() => import('@/views/dashboard/index.vue'))
export const UserList = lazyLoadComponent(() => import('@/views/system/user/index.vue'))
export const RoleList = lazyLoadComponent(() => import('@/views/system/role/index.vue'))

// 组件库懒加载
export const ComponentA = lazyLoadComponent(() => import('@/components/common/ComponentA.vue'))
export const ComponentB = lazyLoadComponent(() => import('@/components/common/ComponentB.vue'))
\`\`\`

### 路由懒加载配置
\`\`\`typescript
// 路由懒加载工具
export const lazyImport = {
  // 布局组件
  BasicLayout: () => import('@/layouts/BasicLayout.vue'),
  PageLayout: () => import('@/layouts/PageLayout.vue'),
  
  // 页面组件
  Login: () => import('@/views/login/index.vue'),
  Dashboard: () => import('@/views/dashboard/index.vue'),
  
  // 错误页面
  NotFound: () => import('@/views/error/404.vue'),
  ServerError: () => import('@/views/error/500.vue'),
  
  // 业务页面
  UserManagement: () => import('@/views/system/user/index.vue'),
  RoleManagement: () => import('@/views/system/role/index.vue'),
  
  // 添加预加载提示
  preload(component: any) {
    return {
      component,
      loading: {
        template: '<div style="padding: 20px; text-align: center;">加载中...</div>'
      },
      delay: 200,
      timeout: 10000
    }
  }
}

// 路由配置中使用
export const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: lazyImport.preload(lazyImport.Dashboard),
    meta: { title: '仪表盘' }
  }
]
\`\`\`

### 图片懒加载指令
\`\`\`typescript
// directives/lazyLoad.ts
import type { App, DirectiveBinding } from 'vue'

export const lazyLoadDirective = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    const { src, placeholder = '/images/placeholder.svg' } = binding.value || {}
    
    if (!src) {
      console.warn('v-lazy指令需要src参数')
      return
    }
    
    // 设置占位图
    el.src = placeholder
    el.classList.add('lazy-load')
    
    // 创建IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 图片进入视口，开始加载
            const img = new Image()
            img.src = src
            
            img.onload = () => {
              el.src = src
              el.classList.remove('lazy-load')
              el.classList.add('lazy-loaded')
              observer.unobserve(el)
            }
            
            img.onerror = () => {
              console.error(\`图片加载失败: \${src}\`)
              el.src = '/images/error.svg'
              observer.unobserve(el)
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    )
    
    // 开始观察
    observer.observe(el)
    
    // 保存observer引用
    el._lazyObserver = observer
  },
  
  beforeUnmount(el: HTMLImageElement) {
    // 清理observer
    if (el._lazyObserver) {
      el._lazyObserver.unobserve(el)
      delete el._lazyObserver
    }
  }
}

export function setupLazyLoadDirective(app: App) {
  app.directive('lazy', lazyLoadDirective)
}

// 扩展HTMLImageElement类型
declare global {
  interface HTMLImageElement {
    _lazyObserver?: IntersectionObserver
  }
}
\`\`\`

## 5. 构建优化配置

### Vite配置优化
\`\`\`typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import { createStyleImportPlugin, ElementPlusResolve } from 'vite-plugin-style-import'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    base: env.VITE_APP_BASE_URL || '/',
    
    plugins: [
      vue({
        reactivityTransform: true // 启用响应式语法糖
      }),
      vueJsx(),
      
      // 自动导入API
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            'axios': [
              ['default', 'axios']
            ]
          }
        ],
        dts: 'src/types/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true
        }
      }),
      
      // 自动导入组件
      Components({
        dirs: ['src/components'],
        extensions: ['vue'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts'
      }),
      
      // 按需导入样式
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          {
            libraryName: 'element-plus',
            esModule: true,
            resolveStyle: (name) => {
              return \`element-plus/theme-chalk/\${name}.css\`
            }
          }
        ]
      }),
      
      // 打包分析
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true
      })
    ],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@views': resolve(__dirname, 'src/views'),
        '@stores': resolve(__dirname, 'src/stores'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@services': resolve(__dirname, 'src/services')
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json']
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: \`
            @import "@/styles/variables.scss";
            @import "@/styles/mixins.scss";
          \`
        }
      },
      modules: {
        localsConvention: 'camelCaseOnly'
      }
    },
    
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug']
        }
      },
      
      // 代码分割策略
      rollupOptions: {
        output: {
          manualChunks: {
            // 第三方库
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-ui': ['element-plus'],
            'chart-vendor': ['echarts', 'vue-echarts'],
            'utils-vendor': ['axios', 'dayjs', 'lodash-es', 'qs'],
            
            // 业务模块
            'dashboard': ['src/views/dashboard/**/*'],
            'system': ['src/views/system/**/*'],
            'business': ['src/views/business/**/*']
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      
      // 拆分包大小限制
      chunkSizeWarningLimit: 2000,
      
      // 资源内联限制
      assetsInlineLimit: 4096,
      
      // 构建报告
      reportCompressedSize: false
    },
    
    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(\`代理请求: \${req.method} \${req.url}\`)
            })
          }
        }
      },
      hmr: {
        overlay: false
      },
      fs: {
        strict: false
      }
    },
    
    // 预构建配置
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        'axios',
        'dayjs',
        'lodash-es'
      ],
      exclude: []
    },
    
    // 环境变量
    define: {
      'process.env': env
    },
    
    // 构建模式配置
    mode: mode,
    envPrefix: 'VITE_'
  }
})
\`\`\`

## 6. 监控与错误处理

### 全局错误处理
\`\`\`typescript
// utils/errorHandler.ts
import type { App } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import { logError } from './logger'

interface ErrorInfo {
  type: 'vue' | 'promise' | 'js' | 'resource'
  message: string
  stack?: string
  component?: string
  url?: string
  line?: number
  column?: number
  error?: Error
  timestamp: number
}

class ErrorHandler {
  private appStore: any = null
  
  install(app: App) {
    this.appStore = useAppStore()
    
    // Vue错误处理
    app.config.errorHandler = this.handleVueError.bind(this)
    
    // Promise错误处理
    window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this))
    
    // JavaScript运行时错误
    window.addEventListener('error', this.handleJsError.bind(this), true)
    
    // 资源加载错误
    window.addEventListener('error', this.handleResourceError.bind(this), false)
    
    // 控制台错误重写（开发环境）
    if (import.meta.env.DEV) {
      this.overrideConsoleError()
    }
  }
  
  private handleVueError(err: Error, vm: any, info: string) {
    const errorInfo: ErrorInfo = {
      type: 'vue',
      message: err.message,
      stack: err.stack,
      component: vm?.$options?.name || 'Unknown',
      timestamp: Date.now()
    }
    
    this.recordError(errorInfo)
    this.showErrorToast(err.message)
    
    // 开发环境打印详细错误
    if (import.meta.env.DEV) {
      console.error('[Vue错误]:', err)
      console.error('[组件]:', vm)
      console.error('[信息]:', info)
    }
  }
  
  private handlePromiseError(event: PromiseRejectionEvent) {
    const error = event.reason
    const errorInfo: ErrorInfo = {
      type: 'promise',
      message: error?.message || 'Promise rejection',
      stack: error?.stack,
      timestamp: Date.now(),
      error
    }
    
    this.recordError(errorInfo)
    this.showErrorToast('异步操作失败，请稍后重试')
    
    event.preventDefault()
  }
  
  private handleJsError(event: ErrorEvent) {
    // 跳过Vue错误处理（由Vue的errorHandler处理）
    if (event.target && (event.target as any).__vue__) {
      return
    }
    
    const errorInfo: ErrorInfo = {
      type: 'js',
      message: event.message,
      url: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error?.stack,
      timestamp: Date.now(),
      error: event.error
    }
    
    this.recordError(errorInfo)
    
    // 防止错误冒泡到控制台
    event.preventDefault()
  }
  
  private handleResourceError(event: ErrorEvent) {
    const target = event.target as any
    
    // 只处理资源加载错误
    if (!target || !['IMG', 'SCRIPT', 'LINK', 'VIDEO', 'AUDIO'].includes(target.tagName)) {
      return
    }
    
    const errorInfo: ErrorInfo = {
      type: 'resource',
      message: \`资源加载失败: \${target.tagName.toLowerCase()}\`,
      url: target.src || target.href,
      timestamp: Date.now()
    }
    
    this.recordError(errorInfo)
    
    // 图片加载失败时显示默认图片
    if (target.tagName === 'IMG') {
      target.src = '/images/error.svg'
      target.onerror = null // 防止循环
    }
  }
  
  private recordError(errorInfo: ErrorInfo) {
    // 保存到Store
    if (this.appStore) {
      this.appStore.addError(errorInfo)
    }
    
    // 发送到日志服务
    logError({
      level: 'error',
      message: errorInfo.message,
      stack: errorInfo.stack,
      meta: {
        type: errorInfo.type,
        component: errorInfo.component,
        url: errorInfo.url,
        line: errorInfo.line,
        column: errorInfo.column
      },
      timestamp: errorInfo.timestamp
    })
    
    // 开发环境打印
    if (import.meta.env.DEV) {
      console.group('错误记录')
      console.log('类型:', errorInfo.type)
      console.log('消息:', errorInfo.message)
      console.log('组件:', errorInfo.component)
      console.log('堆栈:', errorInfo.stack)
      console.groupEnd()
    }
  }
  
  private showErrorToast(message: string) {
    // 使用UI框架的提示组件
    if (this.appStore) {
      this.appStore.showMessage({
        type: 'error',
        message: message,
        duration: 3000
      })
    }
  }
  
  private overrideConsoleError() {
    const originalConsoleError = console.error
    
    console.error = (...args) => {
      // 记录到错误日志
      const message = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ')
      
      this.recordError({
        type: 'js',
        message,
        timestamp: Date.now()
      })
      
      // 调用原始console.error
      originalConsoleError.apply(console, args)
    }
  }
  
  // 手动上报错误
  reportError(error: Error, context?: Record<string, any>) {
    const errorInfo: ErrorInfo = {
      type: 'js',
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      error
    }
    
    if (context) {
      Object.assign(errorInfo, context)
    }
    
    this.recordError(errorInfo)
  }
}

export const errorHandler = new ErrorHandler()
\`\`\`

## 总结

Vue 3企业级项目架构需要关注以下核心要点：

### 架构设计原则：
1. **模块化**：合理拆分功能模块
2. **可维护性**：清晰的代码组织和命名规范
3. **可扩展性**：预留扩展接口，支持功能迭代
4. **性能优化**：从开发到构建的全程性能考虑
5. **安全性**：完善的权限控制和错误处理

### 关键技术栈：
1. **Vue 3 + Composition API**：现代化开发体验
2. **TypeScript**：类型安全的开发环境
3. **Pinia**：现代化的状态管理
4. **Vite**：极速的开发构建工具
5. **Element Plus**：企业级UI组件库

### 最佳实践：
1. **组件设计**：遵循单一职责原则
2. **代码规范**：统一编码风格
3. **自动化测试**：确保代码质量
4. **CI/CD**：自动化部署流程
5. **监控告警**：实时监控应用状态

通过合理的架构设计和最佳实践，可以构建出高性能、可维护、可扩展的Vue 3企业级应用。`,
    date: '2025-12-19',
    author: 'Vue架构师',
    category: 'Vue.js',
    categoryColor: '#4fc08d',
    views: 3450,
    likes: 580,
    comments: 92,
    tags: ['Vue 3', '企业级', '架构设计', '性能优化', 'TypeScript'],
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
  }
]

const renderedContent = computed(() => {
  if (!blog.value?.content) return ''
  return marked(blog.value.content)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

const prevBlog = computed(() => {
  const currentId = parseInt(route.params.id as string)
  return mockBlogs.find(blog => blog.id === currentId - 1)
})

const nextBlog = computed(() => {
  const currentId = parseInt(route.params.id as string)
  return mockBlogs.find(blog => blog.id === currentId + 1)
})

const relatedBlogs = computed(() => {
  if (!blog.value) return []
  
  const currentTags = blog.value.tags || []
  const currentId = blog.value.id
  
  return mockBlogs
    .filter(b => 
      b.id !== currentId && 
      b.tags.some(tag => currentTags.includes(tag))
    )
    .slice(0, 3)
})

function likeArticle() {
  if (!liked.value) {
    blog.value.likes++
    liked.value = true
  }
}

function shareArticle() {
  if (navigator.share) {
    navigator.share({
      title: blog.value.title,
      text: blog.value.content.substring(0, 100),
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板！')
  }
}

function bookmarkArticle() {
  bookmarked.value = !bookmarked.value
}

onMounted(() => {
  const blogId = parseInt(route.params.id as string)
  const foundBlog = mockBlogs.find(b => b.id === blogId)
  
  if (foundBlog) {
    blog.value = foundBlog
    blog.value.views++
    
    document.title = `${blog.value.title} - 技术博客`
  }
})
</script>

<style scoped>
.blog-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #2c3e50;
  transform: translateX(-5px);
}

.article-header {
  margin-bottom: 40px;
}

.title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.3;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.meta-left,
.meta-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-left span,
.meta-right span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.95rem;
}

.category {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.cover-image {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 20px;
}

.cover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.cover-image img:hover {
  transform: scale(1.05);
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 40px;
}

:deep(.article-content) h1 {
  font-size: 2.2rem;
  color: #2c3e50;
  margin: 2em 0 1em;
  padding-bottom: 0.5em;
  border-bottom: 3px solid #42b883;
}

:deep(.article-content) h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 1.8em 0 0.8em;
  padding-left: 20px;
  border-left: 4px solid #42b883;
}

:deep(.article-content) h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 1.5em 0 0.6em;
}

:deep(.article-content) p {
  margin-bottom: 1.5em;
}

:deep(.article-content) a {
  color: #42b883;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.3s;
}

:deep(.article-content) a:hover {
  border-bottom-color: #42b883;
  color: #2c3e50;
}

:deep(.article-content) code {
  background: #f6f8fa;
  color: #e96900;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

:deep(.article-content) pre {
  background: #1a1a1a;
  color: #f8f8f2;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 2em 0;
  position: relative;
  border-left: 4px solid #42b883;
}

:deep(.article-content) pre code {
  background: none;
  color: inherit;
  padding: 0;
}

:deep(.article-content) blockquote {
  border-left: 4px solid #42b883;
  margin: 2em 0;
  padding: 1em 2em;
  background: #f8f9fa;
  color: #666;
  font-style: italic;
  border-radius: 0 8px 8px 0;
}

:deep(.article-content) ul,
:deep(.article-content) ol {
  margin: 1.5em 0;
  padding-left: 2em;
}

:deep(.article-content) li {
  margin-bottom: 0.5em;
}

:deep(.article-content) table {
  width: 100%;
  border-collapse: collapse;
  margin: 2em 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

:deep(.article-content) th {
  background: #42b883;
  color: white;
  font-weight: 600;
}

:deep(.article-content) th,
:deep(.article-content) td {
  border: 1px solid #ddd;
  padding: 12px 16px;
  text-align: left;
}

:deep(.article-content) tr:nth-child(even) {
  background: #fafafa;
}

:deep(.article-content) img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 2em auto;
  display: block;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.article-footer {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eaeaea;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.tag {
  background: #f0f7ff;
  color: #42b883;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
}

.tag:hover {
  background: #42b883;
  color: white;
  transform: translateY(-2px);
}

.actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #42b883;
  color: #42b883;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #42b883;
  color: white;
  transform: translateY(-2px);
}

.navigation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 40px 0;
}

.nav-link {
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #2c3e50;
  border: 2px solid #eaeaea;
  transition: all 0.3s;
}

.nav-link:hover {
  border-color: #42b883;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(66, 184, 131, 0.1);
}

.nav-link.prev {
  text-align: left;
}

.nav-link.next {
  text-align: right;
}

.nav-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.nav-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.related-articles {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid #eaeaea;
}

.related-articles h3 {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.related-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.related-item {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 2px solid #eaeaea;
  cursor: pointer;
  transition: all 0.3s;
}

.related-item:hover {
  border-color: #42b883;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(66, 184, 131, 0.1);
}

.related-item h4 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.related-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .blog-detail {
    padding: 15px;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .meta-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .cover-image {
    height: 250px;
  }
  
  .navigation {
    grid-template-columns: 1fr;
  }
  
  .nav-title {
    font-size: 1rem;
  }
  
  .related-list {
    grid-template-columns: 1fr;
  }
  
  :deep(.article-content) h1 {
    font-size: 1.8rem;
  }
  
  :deep(.article-content) h2 {
    font-size: 1.5rem;
  }
  
  .actions {
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    min-width: 150px;
    justify-content: center;
  }
}
</style>