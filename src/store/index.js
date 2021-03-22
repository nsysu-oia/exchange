import { createStore } from 'vuex'

const breakpointsMax = {
  xs: 600,
  sm: 900,
  md: 1200,
  lg: 1700
}

function getWindowSize (windowWidth) {
  if (windowWidth < breakpointsMax.xs) {
    return 'xs'
  } else if (windowWidth < breakpointsMax.sm) {
    return 'sm'
  } else if (windowWidth < breakpointsMax.md) {
    return 'md'
  } else if (windowWidth < breakpointsMax.lg) {
    return 'lg'
  } else {
    return 'xl'
  }
}

export default createStore({
  state: {
    windowWidth: window.innerWidth,
    windowSize: getWindowSize(window.innerWidth),
    user: null
  },
  mutations: {
    UPDATE_WINDOW_WIDTH (state) {
      state.windowWidth = window.innerWidth
      state.windowSize = getWindowSize(window.innerWidth)
    }
  },
  actions: {
    login ({ commit }, credentials) {
    }
  },
  modules: {
  }
})
