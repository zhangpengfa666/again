import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/rights/rights.vue'
import Role from '@/components/role/role.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {name: 'users',
          path: '/users',
          component: Users},
        {name: 'rights',
          path: '/rights',
          component: Rights},
        {name: 'roles',
          path: '/roles',
          component: Role}
      ]
    }
  ]
})

// 路由 导航 守卫
//在路由配置生效之前 会先来到线面的回调函数
router.beforeEach((to, from, next) => {
  console.log(to)
  //如果去的是login next()
  if(to.path==='/login'){
    next()
  }else{
    //如果去的不是login 判断有无token
    const token=localStorage.getItem('token')
    if(!token){
      router.push({
        name:'login'
      })
      return
    }
    next()
  }
})
export default router
