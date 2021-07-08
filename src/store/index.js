import { createStore } from 'vuex'
import axios from 'axios'
const backendHost = process.env.VUE_APP_BACKEND_HOST || 'localhost'

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
    },
    SET_USER (state, data) {
      state.user = data
      localStorage.setItem('user', JSON.stringify(data))
      axios.defaults.headers.common.Authorization = `Bearer ${data.token}`
    },
    CLR_USER () {
      localStorage.removeItem('user')
      location.reload()
    }
  },
  actions: {
    ssoAuth ({ commit }, credentials) {
      return axios
        .post('//' + backendHost + ':3000/sso-auth', credentials)
        .then(({ data }) => {
          commit('SET_USER', data)
        })
    },
    logout ({ commit }) {
      commit('CLR_USER')
    }
  },
  modules: {
  }
})
