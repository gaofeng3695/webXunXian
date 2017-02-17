var d = false,
    e = false,
    g = false,
    f = false;
$(".btn1").click(function() {
    $('.phone').blur();
    if (!e) {
        return;
    }
    $('.imgCode').blur();
    if (!f) {
        return;
    }

    $('.SMScode').blur();
    if (!d) {
        return;
    }
    if (!g) {
        $('.SMScodeMsg span').text('请先获取验证码');
        $('.SMScodeMsg').css({
            display: 'block'
        });
        return;
    } else {
        $('.SMScodeMsg').css({
            display: 'none'
        })
    }
    // 短信验证码校验接口调用开始
    var number = $('.phone').val();
    var verifyCode = $('.SMScode').val();
    var _data = { "sendNum": number, "sendMode": 1, "verifyCode": verifyCode };
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/cloudlink-core-framework/login/checkVerifyCode",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "text",
        success: function(data, status) {
            var success = JSON.parse(data).success;
            if (success == 1) {
                $('.top img').attr('src', 'src/images/enrollImg/2.png')
                $('.bottom1,.bottom3,.bottom4,.Notes').css({
                    display: "none"
                })
                $('.bottom2').css({
                    display: "block"
                })
            } else {
                alert('验证码填写错误');
            }
        }
    });
    // 短信验证码校验接口调用结束
    $('.top img').attr('src', 'src/images/forgetImg/2.png')
    $('.bottom1').css({
        display: "none"
    })
    $('.bottom2').css({
        display: "block"
    })
})
$(".btn2").click(function() {
    $('.pw1').blur();
    if (!e) {
        return;
    }
    $('.pw2').blur();
    if (!f) {
        return;
    }

    //重置密码
    var mobileNum = $('.phone').val();
    var password = $('.password1').val();
    var verifyCode = $('.SMScode').val();

    var _data = { "mobileNum": mobileNum, "password": password, "verifyCode": verifyCode }
    $.ajax({
        url: "http://localhost:3000/cloudlink-core-framework/login/resetPassword",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "text",
        success: function(data, status) {}
    });

    $('.top img').attr('src', 'src/images/forgetImg/3.png')
    $('.bottom2').css({
        display: "none"
    })
    $('.bottom3').css({
        display: "block"
    })
})
$(".btnhid").click(function() {
        location.href = "login.html"
    })
    //图片验证码
var imgStr = '';
code();

function code() {
    var az = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
    var dom2 = parseInt(Math.random() * 10000 % 62);
    var dom3 = parseInt(Math.random() * 10000 % 62);
    var dom4 = parseInt(Math.random() * 10000 % 62);
    var dom1 = parseInt(Math.random() * 10000 % 62);
    imgStr = az[dom1] + az[dom2] + az[dom3] + az[dom4];
    $('.code i').text(imgStr)
}
//刷新验证码
$('.code').click(function() {
        code();
    })
    //手机号验证
$('.phone').blur(function() {
        var val = $(this).val().trim();
        var phoneReg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (val == '' || val == null) {
            $('.phoneMeg').css({
                display: 'block'
            });
            $('.phoneMeg span').text('手机号码不能为空');
            e = false;
            return;
        } else if (!phoneReg.test(val)) {
            $('.phoneMeg').css({
                display: 'block'
            });
            $('.phoneMeg span').text('手机号码填写错误');
            e = false;
            return false;
        } else {
            e = true;
            $('.phoneMeg').css({
                display: 'none'
            });
            // 手机号是否注册过接口调用开始
            var _data = { "registNum": val };
            $.ajax({
                url: "http://localhost:3000/cloudlink-core-framework/isExist",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(_data),
                dataType: "text",
                success: function(data, status) {
                    var res = JSON.parse(data).rows.isExist;
                    if (res == 1) {
                        $('.phoneMeg').css({
                            display: 'none'
                        });
                    } else {
                        $('.phoneMeg').css({
                            display: 'block'
                        });
                        $('.phoneMeg span').text('手机号码未注册');
                        e = false;
                    }
                }
            });
            // 手机号是否注册过接口调用结束
        }
    })
    //图片验证
$('.imgCode').blur(function() {
        var val = $(this).val();
        var imgReg = new RegExp(imgStr, "i");
        if (val == '' || val == null) {
            $('.imgMeg').css({
                display: 'block'
            });
            $('.imgMeg span').text('图片验证码不能为空');
            f = false;
            return;
        } else if (!imgReg.test(val)) {
            $('.imgMeg').css({
                display: 'block'
            });
            $('.imgMeg span').text('图片验证码填写错误');
            f = false;
            return;
        } else {
            $('.imgMeg').css({
                display: 'none'
            });
            if (!g) {
                $('.styles').css({
                    background: '#49CB86'
                })
            }

            f = true;
        }
    })
    //短信验证码验证
$('.SMScode').blur(function() {
        var val = $(this).val();
        if (val == "" || val == null) {
            $('.SMScodeMsg').css({
                display: 'block'
            });
            $('.SMScodeMsg span').text('短信验证码不能为空');
            d = false;
            return;
        } else {
            d = true;
            $('.SMScodeMsg').css({
                display: 'none'
            });
        }
    })
    //点击获取短信验证码事件
$('.styles').click(function() {
        $('.phone').blur();
        $('.imgCode').blur();
        console.log(e, g, f)
        if (!f || g || !e) {
            return;
        }
        $('.phone').blur();
        times();
        $('.styles').text('60秒后再次获取');
        $('.styles').css({
            background: '#ccc'
        })
        f = false;
        //ajax发送手机号，接受验证码
        var number = $('.phone').val();
        var _data = { "sendNum": number, "sendMode": 1, "useMode": 3 }
        $.ajax({
            url: "http://localhost:3000/cloudlink-core-framework/login/getVerifyCode",
            type: "GET",
            contentType: "application/json",
            dataType: "text",
            data: JSON.stringify(_data),
            success: function(data) {
                // var verifyCode = JSON.parse(data).rows.verifyCode;
            }
        })

    })
    //点击获取短信验证码倒计时事件
function times() {
    var a = 60;
    g = true;
    var t = setInterval(function() {
        a--;
        $('.styles').text(a + '秒后再次获取');
        if (a < 1) {
            $('.styles').text('重新获取');
            $('.styles').css({
                background: '#49CB86'
            })
            clearInterval(t);
            f = true;
            g = false;
        }
    }, 1000)
}
//重置密码验证
$('.pw1').blur(function() {
        var val = $(this).val();
        var pwReg = /^[\dA-z]{6,12}$/;
        if (val == '' || val == null) {
            $('.pswMsg1').css({
                display: 'block'
            });
            $('.pswMsg1 span').text('密码不能为空');
            e = false;
            return
        } else if (!pwReg.test(val)) {
            $('.pswMsg1').css({
                display: 'block'
            });
            $('.pswMsg1 span').text('密码格式错误');
            e = false;
            return;
        } else {
            e = true;
            $('.pswMsg1').css({
                display: 'none'
            });
        }
    })
    //再次确认密码验证
$('.pw2').blur(function() {
    var val1 = $('.pw1').val();
    var val2 = $('.pw2').val();
    if (val2 == "" || val2 == null) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text('请再次输入密码');
        f = false;
        return
    } else if (val1 != val2) {
        $('.pswMsg2').css({
            display: 'block'
        });
        $('.pswMsg2 span').text('两次输入密码不一致');
        f = false;
        return
    } else {
        f = true;
        $('.pswMsg2').css({
            display: 'none'
        });
    }
})