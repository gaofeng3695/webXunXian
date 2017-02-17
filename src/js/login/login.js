var Obj = {
    nameImg: "url(src/images/loginImg/nameImg.png)",
    nameImg1: "url(src/images/loginImg/nameImg1.png)",
    passwordImg: "url(src/images/loginImg/password1.png)",
    passwordImg1: "url(src/images/loginImg/password.png)",
    focus: function(obj, imgSrc) {
        obj.css({
            background: "#ECF7FF",
            border: "1px solid #5EB6F9"
        });
        obj.find('input').css("background", "#ECF7FF");
        obj.find('.common').css("border-left", "1px solid #5EB6F9");
        obj.find('.bg').css("background-image", imgSrc);
    },
    blur: function(obj, imgSrc) {
        obj.css({
            background: "#fff",
            border: "1px solid #bbb"
        });
        obj.find('input').css("background", "#fff");
        obj.find('.common').css("border-left", "1px solid #bbb");
        obj.find('.bg').css("background-image", imgSrc);
    }
}

$(".name input").focus(function() {
    Obj.focus($(".name"), Obj.nameImg);
}).blur(function() {
    Obj.blur($(".name"), Obj.nameImg1);
    var val = $(this).val();
    var _data = { "registNum": val };
    // 手机号是否注册过接口调用开始
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/isExist",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "text",
        success: function(data, status) {
            var res = JSON.parse(data).rows.isExist;
            if (res == 0) {
                $('.hidkuai1 span').text('账号未注册');
            } else {
                $('.hidkuai1 span').text('');
            }
        }
    });
    // 手机号是否注册过接口调用结束
})
$(".password input").focus(function() {
    Obj.focus($(".password"), Obj.passwordImg);
}).blur(function() {
    Obj.blur($(".password"), Obj.passwordImg1);
})

//确认登录
$('.btn').click(function() {
    var nameVal = $(".name input").val().trim();
    var passwordVal = $(".password input").val().trim();
    var phoneReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (nameVal == "" || nameVal == null) {
        $('.hidkuai1 span').text('手机号码不能为空');
        return;
    } else if (!phoneReg.test(nameVal)) {
        $('.hidkuai1 span').text('您输入的手机号码不正确');
        return;
    } else if (passwordVal == '' || passwordVal == null) {
        $('.hidkuai1 span').text('');
        $('.hidkuai2 span').text('密码不能为空');
        return;
    } else {
        $('.hidkuai1 span').text('');
        $('.hidkuai2 span').text('');
        requestData(nameVal, passwordVal);
    }
});

function requestData(name, password) {
    var _data = { "loginNum": name, "password": password };
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-framework/login/loginByPassword",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "text",
        success: function(data) {
            alert(data)
            $('.hidkuai2 span').text('');
            var success = JSON.parse(data).success;
            if (success == 1) {
                var row = JSON.parse(data).rows;
                var token = JSON.parse(data).token;
                localStorage.loginRow = row;
                localStorage.loginToken = token;
                location.href = 'main.html';
            } else {
                $('.hidkuai2 span').text('账号或密码错误');
            }

        }
    });
}