// ip => 请求地址，统一修改
// previewIp => 预览地址，统一修改
// trackerIp => 下载地址，统一修改
const state = () => ({
    ip: 'http://192.100.3.50:12580',
    previewIp: 'http://192.100.2.39:8012',
    trackerIp: 'http://192.100.3.45:80',
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
