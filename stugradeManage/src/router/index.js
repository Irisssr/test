import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/login'
import Register from '@/components/register'
import stuIndex from '@/components/stuIndex'
import My from '@/components/my'
// import Editdata from '@/components/editdata'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path:'/teaindex',
      name:'teaindex',
      component:Index
    },
    {
      path:'/register',
      name:'register',
      component:Register
    },
    {
      path:'/stuindex',
      name:'stuindex',
      component:stuIndex
    },
    {
      path:'/my',
      name:'my',
      component:My
    }
    // {
    //   path:'/user',
    //   name:'user',
    //   component:User
    // }
  ]
})
