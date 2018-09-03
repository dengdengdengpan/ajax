// loadmore.js 第一个版本：面条式地又丑又长的代码

let newsList = document.querySelector('.news-list'),
    loadMoreBtn = document.querySelector('.loadmore-btn'),
    curIndex = 1,
    isRespDataArrived = true;

loadMoreBtn.addEventListener('click', () => {
    // 防止用户重复点击时发送多个请求
    if (!isRespDataArrived) {
        return;
    }
    let xhr = new XMLHttpRequest();
    /**
     * 1.我需要后台返回什么样的数据？
     * 返回JSON格式的数据['新闻 1', '新闻 2', '新闻 3', '新闻 4', '新闻 5']
     * 2.我需要给后台什么样的数据？
     * 最主要的两个，一个是当前新闻的下标是多少，另一个是每次加载新闻的条数是多好
     * curIndex=1&length=5
     */
    xhr.open('GET', '/loadMore?index=' + curIndex + '&length=5');
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || (xhr.status === 304)) {
                let respData = xhr.response,
                    docFragment = document.createDocumentFragment();
                // console.log(respData);
                // console.log(typeof respData);
                // console.log(respData instanceof Array);
                respData.forEach((item, index) => {
                    // console.log(item);
                    let elLi = document.createElement('li');
                    elLi.classList.add('item');
                    elLi.innerText = item;
                    docFragment.appendChild(elLi);
                });
                newsList.appendChild(docFragment);
                curIndex += 5;
                isRespDataArrived = true;
            } else {
                console.log('There was a problem with the request: ' + xhr.status + ' ' + xhr.statusText);
            }
        }
    };
    xhr.send(null);
    isRespDataArrived = false;
});  