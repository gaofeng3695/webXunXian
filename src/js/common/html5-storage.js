var lsObj = (function () {　　　　
    var _lsObj = window.localStorage;
    var isflag = 0;　　　
    var setLocalStorage = function (key, value) {　　　　　　
        _lsObj.removeItem(key);
        _lsObj.setItem(key, value);　　　　
    };　　　　
    var getLocalStorage = function (key) {
        // if (self.frameElement && self.frameElement.tagName == "IFRAME") {
        //     //此页面父级为iframe
        //     if (_lsObj.getItem('timeOut') <= new Date().getTime()) {
        //         alert("用户登陆超时，请重新登录");
        //         parent.location.href = '/login.html';
        //         return;
        //     }
        // } else {
        //     //此页面父级非iframe
        //     if (_lsObj.getItem('timeOut') <= new Date().getTime()) {
        //         alert("用户登陆超时，请重新登录");
        //         location.href = 'login.html';
        //         return;
        //     }
        // }
        if (_lsObj.getItem('timeOut') <= new Date().getTime()) {
            alert("用户登陆超时，请重新登录");
            parent.location.href = '/login.html';
            return;
        }
        var _value = _lsObj.getItem(key);
        return _value;　　　　　　
    };　
    var clearAll = function () {
        _lsObj.clear();　
    };　　　　
    return {
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage,
        clearAll: clearAll　　　　
    };
})();