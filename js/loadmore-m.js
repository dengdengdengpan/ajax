// loadmore.js 第二个版本：通过函数封装

let newsList = document.querySelector('.news-list'),
    loadMoreBtn = document.querySelector('.loadmore-btn'),
    curIndex = 1,
    isRespDataArrived = true;

// 加载更多 按钮点击事件
loadMoreBtn.addEventListener('click', () => {
    if (!isRespDataArrived) {
        return;
    }
    loadData(function (respData) {
        renderPage(respData);
        curIndex += 5;
        isRespDataArrived = true;
    });
    isRespDataArrived = false;
});

// 加载数据，其实就是发送一个 ajax 请求
function loadData(callback) {
    ajax({
        method: 'GET',
        url: '/loadMore',
        data: {
            index: curIndex,
            length: 5
        },
        respDataType: 'text',
        onSuccess: callback
    });
}

// 得到数据后处理并渲染在页面上
function renderPage(respData) {
    let docFragment = document.createDocumentFragment();
    respData.forEach((item, index) => {
        let elLi = document.createElement('li');
        elLi.classList.add('item');
        elLi.innerText = item;
        docFragment.appendChild(elLi);
    });
    newsList.appendChild(docFragment);
}

// 封装的一个 ajax 函数
function ajax(obj) {
    let method = obj.method.toUpperCase() || 'GET',
        url = obj.url,
        data = obj.data || {},
        timeout = obj.timeout || 0,
        respDataType = obj.respDataType || 'json',
        onSuccess = obj.onSuccess || function () {
            console.log('请自己写一个处理服务器的响应成功的函数');
        },
        onError = obj.onError || function () {
            console.log('Network error');
        };

    let xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    xhr.responseType = respDataType;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 304)) {
                let respData = judgeRespType(xhr);
                onSuccess(respData);
            } else {
                console.log(xhr.status + ' ' + xhr.statusText);
            }
        }
    };
    xhr.ontimeout = function () {
        console.log('HTTP 请求时间超过限制');
    };
    xhr.onerror = onError;
    
    let reqParams = getReqParams(data),
        realUrl = reqParams ? url += '?' + reqParams : url;
    if (method === 'GET') {
        xhr.open(method, realUrl);
        xhr.send(null);
    } else if (method === 'POST') {
        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(reqParams);
    }
}

function getReqParams(data) {
    let dataStr = [];
    for (let key in data) {
        dataStr.push(key + '=' + data[key]);
    }
    return dataStr.join('&');
}

function judgeRespType(xhr) {
    if (xhr.responseType === 'json') {
        return xhr.response;
    } else if (xhr.responseType === 'text') {
        return JSON.parse(xhr.responseText);
    } else {
        console.log('暂时还不支持这种数据类型');
    }
}