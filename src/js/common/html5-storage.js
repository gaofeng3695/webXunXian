var lsObj = (function() {　　　　
    var _lsObj = window.localStorage;　　　　
    var setLocalStorage = function(key, value) {　　　　　　
        _lsObj.removeItem(key);
        _lsObj.setItem(key, value);　　　　
    };　　　　
    var getLocalStorage = function(key) {
        // if (_lsObj.getItem('timeOut') <= new Date().getTime()) {
        // alert("用户登陆超时，请重新登录");
        // location.href = 'login.html';
        // } else {
        var _value = _lsObj.getItem(key);
        return _value;　　　　
        // }　　　　　　
    };　
    var clearAll = function() {
        _lsObj.clear();　
    };　　　　
    return {
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage,
        clearAll: clearAll　　　　
    };
})();