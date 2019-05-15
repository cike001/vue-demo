
const app = {
  state: {
    sidebar: {
      opened: sessionStorage.getItem('sidebarStatus') ? !!+sessionStorage.getItem('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    language: sessionStorage.getItem('language') || 'zh',
    size: sessionStorage.getItem('size') || 'medium'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        sessionStorage.setItem('sidebarStatus', 1)
      } else {
        sessionStorage.setItem('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      sessionStorage.setItem('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      sessionStorage.setItem('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      sessionStorage.setItem('size', size)
    }
  },
  actions: {
    ToggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app
