
// ip => 请求地址，再次统一修改
const state = () => ({
    // ip: 'http://192.100.2.39:12580',
    ip: 'http://39.96.3.64:12580',
    pending: false
});

const mutations = {
    changePending(state, data) {
        state.pending = data
    },
};

export default {
    namespaced: true,
    state,
    mutations
}
