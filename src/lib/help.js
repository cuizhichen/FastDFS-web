// 返回当前时间
// xxxx-xx-xx  xx:xx
export function date(param) {
    let p = new Date(param)

    let year = p.getFullYear()
    let month = p.getMonth() + 1
    let date = p.getDate()
    let hours = p.getHours()
    let minutes = p.getMinutes()

    // 如果小时和时间的没有十位数，则在前面加个'0'
    hours.toString().length == 1 && (hours = '0' + hours)
    minutes.toString().length == 1 && (minutes = '0' + minutes)

    // \xa0 => &nbsp;的转义符
    return year + '-' + month + '-' + date + "\xa0" + hours + ':' + minutes
}

// 获取文件的类型
// 传入文件的名称
export function fileType(params) {
    let type
    const reg = /(?<=\.)\w+$/;
    type = params.match(reg)[0];

    return type
}