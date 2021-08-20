import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../view/Login.vue'
import Home from '../view/Home.vue'
import Welcome from '../components/welcome.vue'
import User from '../components/user.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: User
    }
    ]
  }
  ]
})
// ����·�ɵ�������
router.beforeEach((to, from, next) => {
  // to ��Ҫ���ʵ�·��
  // from �����Ǹ�·������
  // next ��һ����������ʾ����
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
