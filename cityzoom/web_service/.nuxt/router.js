import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

<<<<<<< HEAD
const _4e797e97 = () => interopDefault(import('../pages/dispositivos/index.vue' /* webpackChunkName: "pages/dispositivos/index" */))
const _55d2fafa = () => interopDefault(import('../pages/homepage/index.vue' /* webpackChunkName: "pages/homepage/index" */))
const _6a29954c = () => interopDefault(import('../pages/mapa/index.vue' /* webpackChunkName: "pages/mapa/index" */))
const _11754392 = () => interopDefault(import('../pages/user/login.vue' /* webpackChunkName: "pages/user/login" */))
const _25bf6430 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
=======
const _9fa5562a = () => interopDefault(import('../pages/homepage/index.vue' /* webpackChunkName: "pages/homepage/index" */))
const _8449087c = () => interopDefault(import('../pages/mapa/index.vue' /* webpackChunkName: "pages/mapa/index" */))
const _2b94b6c2 = () => interopDefault(import('../pages/user/login.vue' /* webpackChunkName: "pages/user/login" */))
const _55f28670 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
>>>>>>> 0dde2c9a773404566d76a7c7e4f86ba56f30e405

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: decodeURI('/'),
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/dispositivos",
      component: _4e797e97,
      name: "dispositivos"
    }, {
      path: "/homepage",
      component: _9fa5562a,
      name: "homepage"
    }, {
      path: "/mapa",
      component: _8449087c,
      name: "mapa"
    }, {
      path: "/user/login",
      component: _2b94b6c2,
      name: "user-login"
    }, {
      path: "/",
      component: _55f28670,
      name: "index"
    }],

    fallback: false
  })
}
