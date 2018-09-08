// loamore.js 第三个版本：通过 面向对象 的方式来 code

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
    this.onSuccess = this.obj.onSuccess || function () {
        console.log('请自己写一个处理响应成功的函数');
    };
    // 请求过程中，当发生网络层级别异常的处理函数
    this.onError = this.obj.onError || function () {
        console.log('自己写一个处理 Network error 的函数');
    };
};
Ajax.prototype.createXhr = function () {
    // 创建 XMLHttpRequest 实例对象 xhr
    let xhr = new XMLHttpRequest();
    // 初始化一个 HTTP 请求并发送
    this.judgeReqMethod(xhr);
    // 设置请求的超时时间
    xhr.timeout = this.timeout;
    // 设置服务器响应的数据类型
    xhr.responseType = this.respDataType;
    // 处理服务器的响应
    this.handleResponse(xhr);
    // 请求超时的处理
    this.handleTimeout(xhr);
    // Network error
    xhr.error = this.onError;
};
Ajax.prototype.judgeReqMethod = function (xhr) {
    let param = this.getReqParams(this.data),
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
Ajax.prototype.handleResponse = function (xhr) {
    let _this = this;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 304)) {
                // 服务器响应成功了
                let respData = _this.judgeRespType(xhr);
                _this.onSuccess(respData);
            } else {
                // 服务器响应失败的状态码及对应的文本信息
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        }
    };
};
Ajax.prototype.handleTimeout = function (xhr) {
    xhr.ontimeout = function() {
        console.log('HTTP 请求的时间超过设置的限制时间');
    };
};
Ajax.prototype.getReqParams = function (data) {
    let dataStr = [];
    for (let key in data) {
        dataStr.push(key + '=' + data[key]);
    }
    return dataStr.join('&');
};
Ajax.prototype.judgeRespType = function (xhr) {
    if (xhr.responseType === 'json') {
        return xhr.response;
    } else if (xhr.responseType === 'text') {
        return JSON.parse(xhr.responseText);
    } else {
        console.log('暂时还不支持这种数据类型');
    }
};





// loadmore part
function LoadMore(domElement) {
    this.target = domElement;
    this.init();
    this.bindEvent();
}
LoadMore.prototype.init = function () {
    this.list = this.target.querySelector('.news-list');
    this.loadMoreBtn = this.target.querySelector('.loadmore-btn');
    this.isRespDataArrived = true;
    this.curIndex = 1;
    this.increasedLength = 5;
};
LoadMore.prototype.bindEvent = function () {
    this.loadMoreBtn.addEventListener('click', () => {
        // 防止用户多次点击时发送多个请求
        if (!this.isRespDataArrived) {
            return;
        }
        this.loadRespData( (respData) => {
            this.renderPage(respData);
            this.curIndex += this.increasedLength;
            this.isRespDataArrived = true;
        });
        this.isRespDataArrived = false;
    });
};
LoadMore.prototype.loadRespData = function (callback) {
    let ajax = new Ajax({
        method: 'get',
        url: '/loadMore',
        data: {
            index: this.curIndex,
            length: this.increasedLength
        },
        onSuccess: callback
    });
};
LoadMore.prototype.renderPage = function (respData) {
    let docFragment = document.createDocumentFragment();
    respData.forEach((item, index) => {
        let elLi = document.createElement('li');
        elLi.classList.add('item');
        elLi.innerText = item;
        docFragment.appendChild(elLi);
    });
    this.list.appendChild(docFragment);
};

let loadmore = new LoadMore(document.querySelector('#loadmore-wrap'));