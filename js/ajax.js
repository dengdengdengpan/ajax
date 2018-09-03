function Ajax(obj) {
    this.obj = obj;
    this.init();
    this.createXhr();
}
Ajax.prototype.init = function () {
    // 设置请求的方法，默认为GET请求
    this.method = (this.obj.method || 'GET').toUpperCase();
    // 请求发送的目标url
    this.url = this.obj.url;
    // 请求发送的数据，默认是对象
    this.data = this.obj.data || {};
    // 设置请求的超时时间，默认为0，表示没有时间限制
    this.timeout = this.obj.timeout || 0;
    // 返回数据类型，默认是json
    this.respDataType = this.obj.respDataType || 'json';
    // 响应成功处理得到数据的函数
    this.onsuccess = this.obj.onsuccess || function () {
        console.log('请自己写一个处理响应成功的函数');
    };
    // 请求过程中，当发生网络层级别异常的处理函数
    this.onerror = this.obj.onerror || function () {
        console.log('自己写一个处理 Network error 的函数');
    };
};
Ajax.prototype.createXhr = function () {
    // 创建 XMLHttpRequest 实例对象 xhr
    let xhr = this.xhr = new XMLHttpRequest();
    // 初始化一个 HTTP 请求
    this.judgeReqMethod();
    // 设置请求的超时时间
    xhr.timeout = this.timeout;
    // 设置服务器响应的数据类型
    xhr.responseType = this.respDataType;
    // 处理服务器的响应
    this.handleResponse();
    // 请求超时的处理
    xhr.ontimeout = this.handleTimeout();
    // Network error
    xhr.error = this.onerror;
};
Ajax.prototype.judgeReqMethod = function () {
    let xhr = this.xhr,
        param = this.getParams(this.data),
        realUrl = param ? this.url += '?' + param : this.url;
    if (this.method === 'GET') {
        xhr.open(this.method, realUrl);
        xhr.send(null);
    } else if (this.method === 'POST') {
        xhr.open(this.method, this.url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(param);
    } else {
        console.log(this.method + ' is not currently supported');
    }
};
Ajax.prototype.handleResponse = function () {
    let xhr = this.xhr,
        _this = this;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 304)) {
                // 服务器响应成功了
                _this.onsuccess(xhr.response);
            } else {
                // 服务器响应失败的状态码及对应的文本信息
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        }
    };
};
Ajax.prototype.handleTimeout = function () {
    console.log('timeout');
};
Ajax.prototype.getParams = function (data) {
    let dataStr = [];
    for (let key in data) {
        dataStr.push(key + '=' + data[key]);
    }
    return dataStr.join('&');
};

// let ajax = new Ajax({
//     url: '/login.json',
//     timeout: 5000,
//     data: {
//         username: 'xxx',
//         password: 123
//     },
//     onsuccess: function (respData) {
//         console.log(respData);
//     },
//     onerror: function () {
//         console.log('Network error');
//     }
// });