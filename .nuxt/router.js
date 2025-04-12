import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _9cf1f494 = () => interopDefault(import('../client/pages/dashboard.vue' /* webpackChunkName: "pages/dashboard" */))
const _11194a1e = () => interopDefault(import('../client/pages/dashboard/bai-viet/index.vue' /* webpackChunkName: "pages/dashboard/bai-viet/index" */))
const _3d0b2e32 = () => interopDefault(import('../client/pages/dashboard/spam.vue' /* webpackChunkName: "pages/dashboard/spam" */))
const _0261f782 = () => interopDefault(import('../client/pages/dashboard/spam/comment.vue' /* webpackChunkName: "pages/dashboard/spam/comment" */))
const _d8acbb44 = () => interopDefault(import('../client/pages/dashboard/spam/follow.vue' /* webpackChunkName: "pages/dashboard/spam/follow" */))
const _20a4d484 = () => interopDefault(import('../client/pages/dashboard/spam/like.vue' /* webpackChunkName: "pages/dashboard/spam/like" */))
const _7de18a55 = () => interopDefault(import('../client/pages/dashboard/tai-khoan.vue' /* webpackChunkName: "pages/dashboard/tai-khoan" */))
const _01282360 = () => interopDefault(import('../client/pages/dashboard/thong-tin-ca-nhan.vue' /* webpackChunkName: "pages/dashboard/thong-tin-ca-nhan" */))
const _d457142c = () => interopDefault(import('../client/pages/dashboard/admin/delay.vue' /* webpackChunkName: "pages/dashboard/admin/delay" */))
const _f6324bde = () => interopDefault(import('../client/pages/dashboard/admin/quan-ly-tai-khoan.vue' /* webpackChunkName: "pages/dashboard/admin/quan-ly-tai-khoan" */))
const _4eb34455 = () => interopDefault(import('../client/pages/dashboard/admin/tai-khoan.vue' /* webpackChunkName: "pages/dashboard/admin/tai-khoan" */))
const _6b431821 = () => interopDefault(import('../client/pages/dashboard/bai-viet/binh-luan.vue' /* webpackChunkName: "pages/dashboard/bai-viet/binh-luan" */))
const _201d409e = () => interopDefault(import('../client/pages/dashboard/hide/binh-luan.vue' /* webpackChunkName: "pages/dashboard/hide/binh-luan" */))
const _77d6dfe5 = () => interopDefault(import('../client/pages/dashboard/hide/danh-sach.vue' /* webpackChunkName: "pages/dashboard/hide/danh-sach" */))
const _35a4c9f4 = () => interopDefault(import('../client/pages/index.vue' /* webpackChunkName: "pages/index" */))
const _a331ed12 = () => interopDefault(import('../client/pages/index/index.vue' /* webpackChunkName: "pages/index/index" */))
const _3a57d90c = () => interopDefault(import('../client/pages/index/dang-ki.vue' /* webpackChunkName: "pages/index/dang-ki" */))
const _122d204c = () => interopDefault(import('../client/pages/index/khoi-phuc-mat-khau.vue' /* webpackChunkName: "pages/index/khoi-phuc-mat-khau" */))
const _b5d6377a = () => interopDefault(import('../client/pages/index/quen-mat-khau.vue' /* webpackChunkName: "pages/index/quen-mat-khau" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/dashboard",
    component: _9cf1f494,
    name: "dashboard",
    children: [{
      path: "bai-viet",
      component: _11194a1e,
      name: "dashboard-bai-viet"
    }, {
      path: "spam",
      component: _3d0b2e32,
      name: "dashboard-spam",
      children: [{
        path: "comment",
        component: _0261f782,
        name: "dashboard-spam-comment"
      }, {
        path: "follow",
        component: _d8acbb44,
        name: "dashboard-spam-follow"
      }, {
        path: "like",
        component: _20a4d484,
        name: "dashboard-spam-like"
      }]
    }, {
      path: "tai-khoan",
      component: _7de18a55,
      name: "dashboard-tai-khoan"
    }, {
      path: "thong-tin-ca-nhan",
      component: _01282360,
      name: "dashboard-thong-tin-ca-nhan"
    }, {
      path: "admin/delay",
      component: _d457142c,
      name: "dashboard-admin-delay"
    }, {
      path: "admin/quan-ly-tai-khoan",
      component: _f6324bde,
      name: "dashboard-admin-quan-ly-tai-khoan"
    }, {
      path: "admin/tai-khoan",
      component: _4eb34455,
      name: "dashboard-admin-tai-khoan"
    }, {
      path: "bai-viet/binh-luan",
      component: _6b431821,
      name: "dashboard-bai-viet-binh-luan"
    }, {
      path: "hide/binh-luan",
      component: _201d409e,
      name: "dashboard-hide-binh-luan"
    }, {
      path: "hide/danh-sach",
      component: _77d6dfe5,
      name: "dashboard-hide-danh-sach"
    }]
  }, {
    path: "/",
    component: _35a4c9f4,
    children: [{
      path: "",
      component: _a331ed12,
      name: "index"
    }, {
      path: "dang-ki",
      component: _3a57d90c,
      name: "index-dang-ki"
    }, {
      path: "khoi-phuc-mat-khau",
      component: _122d204c,
      name: "index-khoi-phuc-mat-khau"
    }, {
      path: "quen-mat-khau",
      component: _b5d6377a,
      name: "index-quen-mat-khau"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
