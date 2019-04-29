
import axios from "axios";

function api(method, action, data) {

    return axios[method](`http://192.100.2.39:12580/${action}`, data)
        .then(r => {
            return r.data
        })
}

export default api