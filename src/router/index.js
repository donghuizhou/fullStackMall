import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/goodsList'
import Title from '@/views/title'
import Image from '@/views/image'
import Cart from '@/views/cart'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/goods', name: 'goodsList', component: GoodsList, children: [
      { path: 'title', name: 'title', component: Title },
      { path: 'image', name: 'image', component: Image }
    ]},
    { path: '/cart', name: 'cart', component: Cart }
  ]
})
