var lsObj = (function () {　　　　
    var _lsObj = window.localStorage;　　　　
    var setLocalStorage = function (key, value) {　　　　　　
        _lsObj.removeItem(key);
        _lsObj.setItem(key, value);　　　　
    };　　　　
    var getLocalStorage = function (key) {　　　　　　
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