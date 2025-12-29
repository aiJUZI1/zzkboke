// src/stores/blog.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 博客数据类型
interface Blog {
    id: number
    title: string
    content: string
    date: string
    author: string
    category: string
    categoryColor: string
    views: number
    likes: number
    comments: number
    tags: string[]
    coverImage?: string
}

export const useBlogStore = defineStore('blog', () => {
    // 博客数据
    const blogs = ref<Blog[]>([
        {
            id: 1,
            title: '2025年最值得学习的前端框架',
            content: '...',
            date: '2025-12-24',
            author: '前端达人',
            category: '前端框架',
            categoryColor: '#42b883',
            views: 1560,
            likes: 320,
            comments: 45,
            tags: ['Vue', 'React', 'Svelte', '前端框架', '2025趋势'],
            coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'
        },
        {
            id: 2,
            title: 'TypeScript 高级技巧大全',
            content: '...',
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
        // ... 其他4篇文章
    ])

    // 计算属性
    const totalBlogs = computed(() => blogs.value.length)
    const totalViews = computed(() => blogs.value.reduce((sum, blog) => sum + blog.views, 0))
    const totalLikes = computed(() => blogs.value.reduce((sum, blog) => sum + blog.likes, 0))
    const totalComments = computed(() => blogs.value.reduce((sum, blog) => sum + blog.comments, 0))

    // 方法
    const getBlogById = (id: number) => {
        return blogs.value.find(blog => blog.id === id)
    }

    const incrementViews = (id: number) => {
        const blog = blogs.value.find(b => b.id === id)
        if (blog) {
            blog.views++
        }
    }

    const toggleLike = (id: number) => {
        const blog = blogs.value.find(b => b.id === id)
        if (blog) {
            blog.likes += blog.likes === 0 ? 1 : -1
        }
    }

    return {
        blogs,
        totalBlogs,
        totalViews,
        totalLikes,
        totalComments,
        getBlogById,
        incrementViews,
        toggleLike
    }
})