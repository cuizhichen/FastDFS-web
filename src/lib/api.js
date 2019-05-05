import axios from "axios";
import store from '@/store'


/**
 * @param { 请求方法 } method
 * @param { 请求地址 } action
 * @param { 请求传参 } data
 * @returns
 */
function api(method, action, data) {
    // 设置请求地址，固定存放在vuex中
    let ip = store.state.common.ip
    return axios[method](`${ip}/${action}`, data)
        .then(r => {
            return r.data
        })
}

export default api