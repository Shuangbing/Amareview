import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login'
import Main from './components/Main'

import OrderList from './components/Order/OrderList';
import OrderEdit from './components/Order/OrderEdit';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        { path: '/order/create', component: OrderEdit },
        { path: '/order/edit/:id', component: OrderEdit, props: true },
        { path: '/order/list', component: OrderList },
      ]
    },
    {
      path: '/login', name: 'login', component: Login, meta: {isPublic : true}
    }
    
  ]
})
router.beforeEach((to, from, next) => {
  if(!to.meta.isPublic && !localStorage.token) {
    return next('/login')
  }
  next()
})
export default router