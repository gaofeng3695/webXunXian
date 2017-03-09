$(function() {
    initUser(); //进行个人资料的查找
});
var personalImg_fileId = null; //进行存储头像的文件ID
var upload_fileId = null;
/*初始化个人资料基本信息 */
function initUser() {
    token = lsObj.getLocalStorage('token');
    user = JSON.parse(lsObj.getLocalStorage("userBo"));
    if (user.userName != "" && user.userName != null) {
        $("#name").val(user.userName);
    }
    if (user.age != "" && user.age != null) {
        $("#age").val(user.age);
    }
    if (user.sex != "" && user.sex != null) {
        $(".selectsex").val(user.sex);
    }
    if (user.orgName != "" && user.orgName != null) {
        $("#dept").text(user.orgName);
    }
    if (user.position != "" && user.position != null) {
        $("#position").text(user.position);
    }
    if (user.mobileNum != "" && user.mobileNum != null) {
        $("#tel").text(user.mobileNum);
    }
    if (user.qq != "" && user.qq != null) {
        $("#qq").val(user.qq);
    }
    if (user.wechat != "" && user.wechat != null) {
        $("#weixin").val(user.wechat);
    }
    if (user.email != "" && user.email != null) {
        $("#email").val(user.email);
    }
    // /*初始化图像 */
    if (user.profile_photo != "" && user.profile_photo != null) {
        personalImg_fileId = user.profile_photo;
        var path = "/cloudlink-core-file/file/getImageBySize?fileId=" + personalImg_fileId + "&viewModel=fill&width=500&hight=500";
        $('#userImg').attr('src', path);
        $('#userImg').attr('alt', '预览');
    }
    $('#uploadfile').change(function() {
        var index = this.value.lastIndexOf('.');
        var file = this.files[0];
        var path;
        if (window.URL) {
            path = window.URL.createObjectURL(file); //创建一个object URL，并不是你的本地路径
        }
        var img = new Image();
        img.src = path;
        img.onload = function(e) {
            $('#userImg').attr('src', path);
            $('#userImg').removeAttr('alt');
            window.URL.revokeObjectURL(this.src); //图片加载后，释放object URL
        };
    });
}
/*上传图片*/
$(".uploadpicture").click(function() {
    $("#uploadfile").trigger("click");
});
$('.btn').click(function() {
    var view_alt = $("#userImg").attr("alt"); //图像
    var filesrc = $("#userImg").attr("src");
    if (view_alt == 'undefined' || filesrc.indexOf("upload.png") > 1 || view_alt == '预览') {
        //初始化的时候，只是预览没有进行图片的更改
        base_personal();
    } else if (personalImg_fileId == null || personalImg_fileId == "") {
        upload_Img();
    } else {
        deleteAnduploadImg();
    }
});
/*先进行个人头像的上传 */
function upload_Img() {
    var user = JSON.parse(lsObj.getLocalStorage("userBo"));
    var token = lsObj.getLocalStorage('token');
    var fileId = $('input[type="file"]').attr('id');
    $.ajaxFileUpload({
        url: "/cloudlink-core-file/attachment/web/v1/save?businessId=" + user.objectId + "&bizType=pic&token=" + lsObj.getLocalStorage('token'),
        secureuri: false,
        fileElementId: fileId, //上传input的id
        dataType: "json",
        type: "POST",
        async: false,
        success: function(data, status) {
            var result = data.success;
            if (result == 1) {
                updateUserBoImg();

            } else {
                xxwsWindowObj.xxwsAlert("当前网络不稳定，请稍候重试");
            }
        }
    });
}
/*个人基本信息的上传 */
function base_personal() {
    var _updateUserBo = JSON.parse(lsObj.getLocalStorage("userBo"));
    nameVal = $("#name").val().trim(); //姓名
    _updateUserBo.userName = nameVal;
    sexVal = $(".selectsex").val(); //性别
    _updateUserBo.sex = sexVal;
    var _data = {
        "objectId": _updateUserBo.objectId,
        "userName": nameVal,
        "sex": sexVal
    };
    ageVal = $("#age").val().trim(); //年龄
    _updateUserBo.age = ageVal;
    if (ageVal != "" && ageVal != null) {
        _data.age = ageVal;
        if (!checkage()) {
            return;
        }
    } else {
        _data.age = null;
    }
    qqVal = $("#qq").val().trim(); //qq号
    _data.qq = qqVal;
    _updateUserBo.qq = qqVal;
    if (qqVal != "" && qqVal != null) {
        if (!checkQQ()) {
            return;
        }
    }
    weixinVal = $("#weixin").val().trim(); //微信
    _updateUserBo.wechat = weixinVal;
    _data.wechat = weixinVal;
    emailVal = $("#email").val().trim(); //邮箱
    _data.email = emailVal;
    _updateUserBo.email = emailVal;
    if (emailVal != "" && emailVal != null) {
        if (!checkemail()) {
            return;
        }
    }
    if (upload_fileId != null && upload_fileId != "") {
        _updateUserBo.profile_photo = upload_fileId;
        _data.profile_photo = upload_fileId;
    }
    /*点击进行个人资料信息的验证 */
    var falg = vialidForm();
    var that = this;
    if (falg) {
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/user/update?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(_data),
            dataType: "json",
            success: function(data) {
                if (data.success == 1) {
                    /*此处针对BO进行重新存储*/
                    lsObj.setLocalStorage("userBo", JSON.stringify(_updateUserBo));
                    parent.initPersonal(); //调用父级方法，进行主页内容的修改
                    xxwsWindowObj.xxwsAlert("修改成功", function() {
                        location.reload();
                    });
                } else {
                    xxwsWindowObj.xxwsAlert("个人基本信息修改未成功");
                }
            }
        });
    }
}

function deleteAnduploadImg() {
    var _data = {
            "businessId": JSON.parse(lsObj.getLocalStorage("userBo")).objectId,
            "bizType": 'pic',
            "fileId": personalImg_fileId
        }
        /*进行文件的删除*/
    $.ajax({
        type: "POST",
        url: "/cloudlink-core-file/attachment/deleteByBizIdAndBizAttrAndFileId?token=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: JSON.stringify(_data),
        dataType: "json",
        success: function(data) {
            if (data.success == 1) {
                upload_Img();
            } else {
                xxwsWindowObj.xxwsAlert("个人基本信息修改未成功");
            }
        }
    });
}
/*上传成功之后，调用方法进行userbo的修改 */
function updateUserBoImg() {
    var _data = {
        "businessId": JSON.parse(lsObj.getLocalStorage('userBo')).objectId,
        "bizType": "pic"
    }
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?&toke=" + lsObj.getLocalStorage('token'),
        contentType: "application/json",
        data: _data,
        dataType: "json",
        success: function(data) {
            if (data.success == 1) {
                if (data.rows.length > 0) {
                    upload_fileId = data.rows[0].fileId; //返回来的fileid
                }
                base_personal();
            } else {
                xxwsWindowObj.xxwsAlert("个人基本信息修改未成功");
            }
        }
    });
    // var partURL = "cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?businessId=" + userBo.objectId + "&bizType=pic";
    // jasHttpRequest.jasHttpGet(partURL, function(id, state, dbSource) {
    //     if (dbSource == "") {
    //         baseOperation.alertToast("网关异常，请稍候尝试。。。");
    //         return;
    //     }
    //     var dataobj = JSON.parse(dbSource);
    //     if (dataobj.rows.length > 0) {
    //         fileid = dataobj.rows[0].fileId; //返回来的fileid
    //         var partURL = "cloudlink-core-framework/user/update";
    //         jasHttpRequest.jasHttpPost(partURL, function(id, state, data) {
    //             if (data == "") {
    //                 baseOperation.alertToast("网关异常，请稍候尝试。。。");
    //                 return;
    //             }
    //             var obj = JSON.parse(data);
    //             if (obj.success == 1) {
    //                 userBo.profilePhoto = fileid;
    //                 appcan.locStorage.remove("userBo");
    //                 appcan.locStorage.setVal("userBo", userBo);
    //                 appcan.window.evaluatePopoverScript("updateadmininformation", "content", 'relaodUserInfo()');
    //                 baseOperation.closeToast();
    //             }
    //         }, JSON.stringify({
    //             "objectId": userBo.objectId,
    //             "profile_photo": fileid
    //         }));
    //     }
    // });
}

function vialidForm() {
    var filesrc = $("#userImg").attr("src"); //图像
    if (!checkName()) {
        return false;
    } else if (filesrc.indexOf("upload.png") > 1) {
        $("#Imgnote").text("请上传个人头像");
        return false;
    } else {
        return true;
    }
}

$('#name').blur(function() {
    checkName();
});
/*姓名验证 */
function checkName() {
    var name = $("#name").val().trim(); //姓名
    var reg = /^[a-zA-Z\u4e00-\u9fa5]/g;
    if (name == null || name == "") {
        $("#namenote").text("请输入姓名");
        return false;
    } else if (name.length >= 16) {
        $("#namenote").text('姓名不能超过15个字');
        return false;
    } else if (1 < name.length < 16) {
        if (!reg.test(name)) {
            $("#namenote").text('您输入格式不对');
            return false;
        } else {
            $("#namenote").text('');
            return true;
        }
    } else {
        return false;
    }
}
/*年龄验证 */
$('#age').blur(function() {
    checkage();
});

function checkage() {
    var ageVal = $("#age").val().trim(); //年龄
    var reg = /^[0-9]*$/;
    if (ageVal == null || ageVal == "") {
        $("#agenote").text("");
        return true;
    } else if (!reg.test(ageVal)) {
        $("#agenote").text('您输入格式不对');
        return false;
    } else if (parseInt(ageVal) > 100) {
        $("#agenote").text('您输入年龄不对');
        return false;
    } else {
        $("#agenote").text('');
        return true;
    }
}
/* 手机号码验证*/
$('#tel').blur(function() {
    checktel();
});

function checktel() {
    var telVal = $("#tel").val().trim(); //手机号码
    var reg = /^(((17[0-9]{1})|(13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (telVal == null || telVal == "") {
        $("#telnote").text("请输入手机号");
        return false;
    } else if (!reg.test(telVal)) {
        $("#telnote").text('您输入的电话号码有错误');
        return false;
    } else {
        $("#telnote").text('');
        return true;
    }
}
/*qq验证 */
$('#qq').blur(function() {
    checkQQ();
});

function checkQQ() {
    var qqVal = $('#qq').val().trim();
    var reg = /^[1-9][0-9]{4,9}$/;
    if (qqVal == null || qqVal == "") {
        $("#qqnote").text('');
        return true;
    } else if (!reg.test(qqVal)) {
        $("#qqnote").text('您输入的 QQ号码有误');
        return false;
    } else {
        $("#qqnote").text('');
        return true;
    }
}
/*微信验证 */
// $('#weixin').blur(function() {
//     checkweiixn();
// });

// function checkweiixn() {
//     weixinVal = $("#weixin").val().trim(); //微信
//     if (weixinVal == null || weixinVal == "") {
//         $("#weixinnote").text("请输入微信");
//         return false;
//     } else {
//         $("#weixinnote").text("");
//         return true;
//     }
// }
/*邮箱验证 */
$('#email').blur(function() {
    checkemail();
});

function checkemail() {
    var emailVal = $("#email").val().trim(); //邮箱
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (emailVal == null || emailVal == "") {
        $("#emailnote").text('');
        return true;
    } else if (!reg.test(emailVal)) {
        $("#emailnote").text('您输入的邮箱地址有误');
        return false;
    } else {
        $("#emailnote").text('');
        return true;
    }
}