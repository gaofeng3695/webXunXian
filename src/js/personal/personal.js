$(function() {
    initUser(); //进行个人资料的查找
});
var personalImg_fileId = null; //进行存储头像的文件ID
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
    $.ajax({
        type: "GET",
        url: "/cloudlink-core-file/attachment/getFileIdListByBizIdAndBizAttr?token=" + lsObj.getLocalStorage('token') + "&businessId=" + user.objectId + "&bizType=pic",
        contentType: "application/json",
        dataType: "json",
        success: function(data) {
            if (data.success == 1) {
                if (data.rows.length > 0) {
                    if (data.rows[0].fileId != null && data.rows[0].fileId != "") {
                        personalImg_fileId = data.rows[0].fileId;
                        var path = "/cloudlink-core-file/file/getImageBySize?fileId=" + personalImg_fileId + "&viewModel=fill&width=500&hight=500";
                        var imagesL =
                            '<img src="' + path + '" alt=""/>' +
                            '<input type="file" style="display:none" id="view_hid" name="file"  onchange="handleFiles(this);"/>';
                        $(".view_persoanl").append(imagesL);
                        $(".persoanl_add").css('display', 'none');
                    }
                }

            }
        }
    });
}
/*上传图片*/
$(".uploadpicture").click(function() {
    $("#upload").trigger("click");
});
/*先进行个人头像的上传 */
function upload_Img() {
    user = JSON.parse(lsObj.getLocalStorage("userBo"));
    var files = $(".view_persoanl").find("input[name=file]");
    var picId = files.attr("id");
    $.ajaxFileUpload({
        type: "POST",
        url: "/cloudlink-core-file/attachment/save?businessId=" + user.objectId + "&bizType=pic&token=" + lsObj.getLocalStorage('token'),
        secureuri: false,
        fileElementId: picId, //上传input的id
        dataType: "JSON",
        type: "POST",
        async: false,
        success: function(data, status) {
            var reg = /<pre.+?>/g;
            var result = data.match(reg);
            data = data.replace(result, '');
            var result = JSON.parse(data).success;
            if (result == 1) {
                base_personal();
            } else {
                alert("个人基本资料修改未成功");
            }
        }
    });
}
$('.btn').click(function() {
    /*进行头像重新上传之前，先进行图片的删除*/
    var files = $(".photo").find("input[name=file]").attr("id");; //图像
    if (files == "view_hid" || files == "" || files == null) {
        base_personal();
    } else if (personalImg_fileId == null || personalImg_fileId == "") {
        upload_Img();
    } else {
        deleteAnduploadImg();
    }
});
/*个人基本信息的上传 */
function base_personal() {
    nameVal = $("#name").val().trim(); //姓名
    ageVal = $("#age").val().trim(); //年龄
    sexVal = $(".selectsex").val(); //性别
    qqVal = $("#qq").val().trim(); //qq号
    weixinVal = $("#weixin").val().trim(); //微信
    emailVal = $("#email").val().trim(); //邮箱
    /*点击进行个人资料信息的验证 */
    var falg = vialidForm();
    if (falg) {
        var _data = {
            "objectId": user.objectId,
            "userName": nameVal,
            "age": ageVal,
            "sex": sexVal,
            "qq": qqVal,
            "wechat": weixinVal,
            "email": emailVal
        };
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/user/update?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(_data),
            dataType: "json",
            success: function(data) {
                if (data.success == 1) {
                    /*此处针对BO进行重新存储*/
                    var _updateUserBo = JSON.parse(lsObj.getLocalStorage("userBo"));
                    _updateUserBo.userName = nameVal;
                    _updateUserBo.age = ageVal;
                    _updateUserBo.sex = sexVal;
                    _updateUserBo.qq = qqVal;
                    _updateUserBo.wechat = weixinVal;
                    _updateUserBo.email = emailVal;
                    lsObj.setLocalStorage("userBo", JSON.stringify(_updateUserBo));
                    parent.initPersonal(); //调用父级方法，进行主页内容的修改
                    alert("修改成功");
                } else {
                    alert("个人基本信息修改未成功");
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
                alert("个人基本信息修改未成功");
            }
        }
    });
}

function vialidForm() {
    var files = $(".photo").find("input[name=file]").attr("id");; //图像
    if (!checkName()) {
        return false;
    } else if (!checkage()) {
        return false;
    } else if (files != "hid" && files != "view_hid") {
        $("#Imgnote").text("请上传个人头像");
        return false;
    } else if (!checkQQ()) {
        return false;
    } else if (!checkemail()) {
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
        $("#agenote").text("请输入年龄");
        return false;
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
        $("#qqnote").text("请输入QQ");
        return false;
    } else if (!reg.test(qqVal)) {
        $("#qqnote").text('您输入的 QQ号码有误');
        return false;
    } else {
        $("#qqnote").text('');
        return true;
    }
}
/*微信验证 */
$('#weixin').blur(function() {
    checkweiixn();
});

function checkweiixn() {
    weixinVal = $("#weixin").val().trim(); //微信
    if (weixinVal == null || weixinVal == "") {
        $("#weixinnote").text("请输入微信");
        return false;
    } else {
        $("#weixinnote").text("");
        return true;
    }
}
/*邮箱验证 */
$('#email').blur(function() {
    checkemail();
});

function checkemail() {
    var emailVal = $("#email").val().trim(); //邮箱
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    if (emailVal == null || emailVal == "") {
        $("#emailnote").text("请输入邮箱");
        return false;
    } else if (!reg.test(emailVal)) {
        $("#emailnote").text('您输入的邮箱地址有误');
        return false;
    } else {
        $("#emailnote").text('');
        return true;
    }
}