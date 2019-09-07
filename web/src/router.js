import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login'
import Main from './components/Main'

import OrderList from './components/Order/OrderList';
import OrderEdit from './components/Order/OrderEdit';

import PaymentList from './components/Payment/PaymentList';
import PaymentEdit from './components/Payment/PaymentEdit';

import UserList from './components/User/UserList';
import UserEdit from './components/User/UserEdit';

import Dashboard from './components/Dashboard';

import DeliveryList from './components/Delivery/DeliveryList';

import RateEdit from './components/System/RateEdit';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: '/dashboard',
      children: [
        { path: '/dashboard', component: Dashboard },
        { path: '/order/create', component: OrderEdit },
        { path: '/order/edit/:id', component: OrderEdit, props: true },
        { path: '/order/list', component: OrderList },
        { path: '/payment/create', component: PaymentEdit },
        { path: '/payment/edit/:id', component: PaymentEdit, props: true },
        { path: '/payment/list', component: PaymentList },
        { path: '/user/create', component: UserEdit },
        { path: '/user/edit/:id', component: UserEdit, props: true },
        { path: '/user/list', component: UserList },
        { path: '/delivery/list', component: DeliveryList },
        { path: '/system/rate', component: RateEdit }
      ]
    },
    {
      path: '/login', name: 'login', component: Login, meta: { isPublic: true }
    }

  ]
})
router.beforeEach((to, from, next) => {
  if (!to.meta.isPublic && !localStorage.token) {
    return next('/login')
  }
  next()
})
export default router