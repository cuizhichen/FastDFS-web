const state = () => ({
    title: {
        name: "全部文件",
        enName: "All File"
    },
    deleteList: []
})


const mutations = {
    changeTitle(state, data) {
        state.title = data
    },

    changeDeleteList(state, data) {
        state.deleteList = data
    },
}

export default {
    namespaced: true,
    state,
    mutations,
}
