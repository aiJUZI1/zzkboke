<template>
  <div class="about-page">
    <!-- 头部区域 -->
    <div class="about-header">
      <div class="header-content">
        <h1 class="title">关于我</h1>
        <p class="subtitle">记录技术成长，分享编程心得</p>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ totalArticles }}</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalViews }}</span>
            <span class="stat-label">次阅读</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalLikes }}</span>
            <span class="stat-label">次点赞</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ totalComments }}</span>
            <span class="stat-label">条评论</span>
          </div>
        </div>
      </div>
      <div class="header-illustration">
        <div class="code-animation">
          <pre><code>{{ sampleCode }}</code></pre>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="about-content">
      <!-- 网站简介 -->
      <section class="section">
        <h2 class="section-title">
          <span class="icon">🚀</span>
          网站简介
        </h2>
        <div class="section-content">
          <p>欢迎来到我的技术博客！这里是一个专注于前端开发、后端技术和软件工程的分享平台。</p>
          <p>我们致力于提供高质量的技术文章、实用的编程技巧和前沿的技术资讯，帮助开发者不断提升技能，解决实际问题。</p>
          <div class="features">
            <div class="feature">
              <div class="feature-icon">💡</div>
              <div class="feature-content">
                <h3>技术深度</h3>
                <p>深入剖析技术原理，不止于表面使用</p>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">🔧</div>
              <div class="feature-content">
                <h3>实战经验</h3>
                <p>基于真实项目经验，解决实际问题</p>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">📚</div>
              <div class="feature-content">
                <h3>系统学习</h3>
                <p>从基础到进阶，构建完整知识体系</p>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">🔄</div>
              <div class="feature-content">
                <h3>持续更新</h3>
                <p>紧跟技术发展，持续输出优质内容</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 作者信息 -->
      <section class="section">
        <h2 class="section-title">
          <span class="icon">👨‍💻</span>
          关于作者
        </h2>
        <div class="author-info">
          <div class="author-avatar">
            <img :src="author.avatar" :alt="author.name" />
          </div>
          <div class="author-details">
            <h3>{{ author.name }}</h3>
            <p class="author-title">{{ author.title }}</p>
            <p class="author-bio">{{ author.bio }}</p>
            <div class="author-skills">
              <span v-for="skill in author.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
            <div class="author-social">
              <a v-for="social in author.socials" :key="social.name" 
                 :href="social.url" 
                 :title="social.name"
                 target="_blank"
                 class="social-link">
                {{ social.icon }} {{ social.name }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术栈 -->
      <section class="section">
        <h2 class="section-title">
          <span class="icon">🛠️</span>
          技术栈
        </h2>
        <div class="tech-stack">
          <div class="tech-category">
            <h3>前端技术</h3>
            <div class="tech-items">
              <div v-for="tech in techStack.frontend" :key="tech.name" class="tech-item">
                <div class="tech-icon">{{ tech.icon }}</div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="tech-category">
            <h3>后端技术</h3>
            <div class="tech-items">
              <div v-for="tech in techStack.backend" :key="tech.name" class="tech-item">
                <div class="tech-icon">{{ tech.icon }}</div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="tech-category">
            <h3>工具与部署</h3>
            <div class="tech-items">
              <div v-for="tech in techStack.tools" :key="tech.name" class="tech-item">
                <div class="tech-icon">{{ tech.icon }}</div>
                <div class="tech-info">
                  <h4>{{ tech.name }}</h4>
                  <p>{{ tech.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 网站历程 -->
      <section class="section">
        <h2 class="section-title">
          <span class="icon">📅</span>
          网站历程
        </h2>
        <div class="timeline">
          <div v-for="milestone in milestones" :key="milestone.date" class="timeline-item">
            <div class="timeline-date">{{ milestone.date }}</div>
            <div class="timeline-content">
              <h4>{{ milestone.title }}</h4>
              <p>{{ milestone.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="section">
        <h2 class="section-title">
          <span class="icon">📧</span>
          联系我们
        </h2>
        <div class="contact-section">
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <div class="contact-details">
                <h4>邮箱</h4>
                <p>contact@example.com</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">💬</span>
              <div class="contact-details">
                <h4>GitHub</h4>
                <p>github.com/username</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">🐦</span>
              <div class="contact-details">
                <h4>Twitter</h4>
                <p>@username</p>
              </div>
            </div>
          </div>
          <div class="contact-form">
            <h3>发送消息</h3>
            <form @submit.prevent="sendMessage">
              <div class="form-group">
                <input v-model="form.name" type="text" placeholder="您的姓名" required />
              </div>
              <div class="form-group">
                <input v-model="form.email" type="email" placeholder="邮箱地址" required />
              </div>
              <div class="form-group">
                <textarea v-model="form.message" placeholder="请输入您的消息..." rows="4" required></textarea>
              </div>
              <button type="submit" class="submit-btn">发送消息</button>
            </form>
          </div>
        </div>
      </section>
    </div>

    <!-- 页脚 -->
    <div class="about-footer">
      <p>© 2025 技术博客. 保留所有权利. 由 Vue 3 驱动</p>
      <p>让我们共同学习，共同成长！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBlogStore } from '@/stores/blog'

// 直接使用静态数据或从其他地方获

// ... 其余代码保持不变
const blogStore = useBlogStore()

// 统计信息
const totalArticles = computed(() => blogStore.totalBlogs)
const totalViews = computed(() => blogStore.totalViews)
const totalLikes = computed(() => blogStore.totalLikes)
const totalComments = computed(() => 0) // 可以根据实际情况修改

// 作者信息
const author = ref({
  name: '橘子',
  title: '全栈工程师 / 技术博主',
  bio: '热爱编程，热衷于分享技术知识。在前端开发、后端架构和 DevOps 方面有丰富经验。',
  avatar: '/public/1.png',
  skills: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS'],
  socials: [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { name: '博客', icon: '📝', url: '/' }
  ]
})

// 技术栈
const techStack = ref({
  frontend: [
    { name: 'Vue 3', icon: '⚡', description: '主要前端框架' },
    { name: 'TypeScript', icon: '📘', description: '类型安全的JavaScript' },
    { name: 'Vite', icon: '🚀', description: '下一代前端工具' },
    { name: 'Pinia', icon: '🗃️', description: '状态管理' }
  ],
  backend: [
    { name: 'Node.js', icon: '🟢', description: '服务端运行环境' },
    { name: 'Express', icon: '🚂', description: 'Web应用框架' },
    { name: 'MongoDB', icon: '🍃', description: '数据库' },
    { name: 'Redis', icon: '🔴', description: '缓存服务' }
  ],
  tools: [
    { name: 'Docker', icon: '🐳', description: '容器化部署' },
    { name: 'Git', icon: '📚', description: '版本控制' },
    { name: 'VS Code', icon: '💻', description: '代码编辑器' },
    { name: 'Figma', icon: '🎨', description: '设计工具' }
  ]
})

// 网站历程
const milestones = ref([
  { date: '2025年11月', title: '博客启动', description: '开始编写第一篇文章' },
  { date: '2025年11月', title: 'Vue 3迁移', description: '全面升级到Vue 3和Composition API' },
  { date: '2025年12月', title: '响应式设计', description: '全面优化移动端体验' },
  { date: '2025年12月', title: '性能优化', description: '实施代码分割和懒加载' },
  { date: '2025年12月', title: '新版发布', description: '推出全新的界面设计' }
])

// 联系表单
const form = ref({
  name: '',
  email: '',
  message: ''
})

// 示例代码
const sampleCode = `// 关于这个博客
const blog = {
  name: "技术博客",
  purpose: "分享与学习",
  technologies: ["Vue 3", "TypeScript", "Vite"],
  features: ["响应式设计", "暗色模式", "PWA支持"],
  getMotivation() {
    return "让技术学习变得更有趣！"
  }
}`

function sendMessage() {
  console.log('发送消息:', form.value)
  // 这里可以添加API调用
  alert('消息已发送！')
  form.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 头部样式 */
.about-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  margin-bottom: 60px;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
}

.header-content {
  max-width: 500px;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.stats {
  display: flex;
  gap: 30px;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.header-illustration {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.code-animation pre {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #e9e9e9;
}

/* 内容区域 */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.section:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid #42b883;
}

.section-title .icon {
  font-size: 1.5rem;
}

/* 特性网格 */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.feature {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.feature:hover {
  background: #e9f7ef;
  transform: translateY(-3px);
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-content h3 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 8px;
}

.feature-content p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* 作者信息 */
.author-info {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  align-items: center;
}

.author-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 5px solid #42b883;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details h3 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.author-title {
  color: #42b883;
  font-weight: 600;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.author-bio {
  color: #666;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 1.05rem;
}

.author-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
}

.skill-tag {
  background: #e9f7ef;
  color: #42b883;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
}

.skill-tag:hover {
  background: #42b883;
  color: white;
  transform: translateY(-2px);
}

.author-social {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f8f9fa;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
}

.social-link:hover {
  background: #42b883;
  color: white;
  transform: translateY(-2px);
}

/* 技术栈 */
.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.tech-category h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.tech-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s;
}

.tech-item:hover {
  background: #e9f7ef;
  transform: translateX(5px);
}

.tech-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.tech-info h4 {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 5px;
}

.tech-info p {
  color: #666;
  font-size: 0.9rem;
}

/* 时间线 */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #42b883;
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  padding-left: 20px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -33px;
  top: 5px;
  width: 12px;
  height: 12px;
  background: #42b883;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 3px #42b883;
}

.timeline-date {
  font-size: 0.9rem;
  color: #42b883;
  font-weight: 600;
  margin-bottom: 8px;
}

.timeline-content h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 10px;
}

.timeline-content p {
  color: #666;
  line-height: 1.6;
}

/* 联系表单 */
.contact-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.contact-icon {
  font-size: 2rem;
}

.contact-details h4 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 5px;
}

.contact-details p {
  color: #666;
}

.contact-form {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
}

.contact-form h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: #2c3e50;
  transform: translateY(-2px);
}

/* 页脚 */
.about-footer {
  text-align: center;
  margin-top: 60px;
  padding: 30px;
  color: #666;
  border-top: 1px solid #eee;
}

.about-footer p {
  margin: 10px 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .about-header {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .stats {
    justify-content: center;
  }
  
  .author-info {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .author-avatar {
    margin: 0 auto;
  }
  
  .author-skills,
  .author-social {
    justify-content: center;
  }
  
  .contact-section {
    grid-template-columns: 1fr;
  }
  
  .tech-stack {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }
  
  .section {
    padding: 25px;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .stat-item {
    flex: 0 0 calc(50% - 15px);
  }
}
</style>