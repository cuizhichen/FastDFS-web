const state = () => ({
    keyWord: '',
    title: {
        name: "全部文件",
        enName: "All File"
    }
})

const actions = {
    setKeyWordAction({ commit }, data) {
        commit('setKeyWord', data)
    },
}

const mutations = {
    setKeyWord(state, data) {
        state.cat = data
    },

    changeTitle(state, data) {
        state.title = data
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
