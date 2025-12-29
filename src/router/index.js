import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/Home.vue')
const BlogList = () => import('@/views/BlogList.vue')
const BlogDetail = () => import('@/views/BlogDetail.vue')
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/NotFound.vue')
const Games = () => import('@/views/Games.vue')  // 新增

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { title: '首页 - 我的博客' }
    },
    {
        path: '/blog',
        name: 'BlogList',
        component: BlogList,
        meta: { title: '文章列表 - 我的博客' }
    },
    {
        path: '/blog/:id',
        name: 'BlogDetail',
        component: BlogDetail,
        meta: { title: '文章详情 - 我的博客' },
        props: true
    },
    {
        path: '/category/:category',
        name: 'Category',
        component: BlogList,
        meta: { title: '分类文章 - 我的博客' },
        props: true
    },
    {
        path: '/tag/:tag',
        name: 'Tag',
        component: BlogList,
        meta: { title: '标签文章 - 我的博客' },
        props: true
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: { title: '关于我 - 我的博客' }
    },
    {
        path: '/games',  // 新增游戏路由
        name: 'Games',
        component: Games,
        meta: { title: '小游戏 - 我的博客' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { title: '页面未找到 - 我的博客' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

export default router