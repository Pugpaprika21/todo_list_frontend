import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/todohome',
            name: 'todoHomeView',
            component: () =>
                import ('../views/TodoHomeView.vue')
        },

    ]
})

export default router