var numIndex = null;
var uuid = "";
var nImgHasBeenSendSuccess = 0;
// tab切换
$('.center').click(function() {
        var index = $(this).parent().index();
        $('.center').css({ borderBottom: 'none', color: '#000' })
        $('.center .i').css({ display: 'none' })
        $(this).css({ borderBottom: '1px solid #67BDF6', color: '#67BDF6' })
        $(this).find('.i').css({ display: 'block' })
        $('.kuai>div').css({
            display: 'none'
        })
        $('.kuai>div').eq(index).css({
            display: 'block'
        })
    })
    // 意见反馈输入字数限制
function lookNum(e) {
    var len = $(e).val().trim().length;
    if (len > 200) {
        $(e).val($(e).val().substring(0, 199));
        $(e).next("span").show().text("*最多200字")
    } else {
        $(e).next("span").hide();
    }
}
/*获取参数*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/*初始化页面*/
$(function() {
    uuid;
    numIndex = GetQueryString("num");
    if (numIndex != null) {
        selectIndex(numIndex);
    };
    /*上传图片*/
    $(".addImg").click(function() {
        var imgNum = $(".feedback_img_list").find(".feedback_images").length;
        if (imgNum <= 2) {
            $("#upload").trigger("click");
        } else {
            alert("最多上传三张图片");
        }
    })
});
/*删除图片*/
function closeImg(e) {

    $(e).closest(".feedback_images").remove();
}
/*判断建议图片提交*/
function onSubmit() {
    uuid = creatuuid();
    //alert(uuid)
    var textArea = $(".feedback_area").find("textarea").val().trim();
    var contactWay = $(".feedback_way").find("input").val().trim();
    if (textArea.length < 10) {
        $(".feedback_area").find("span").show().text("*不到10个字哦，再写点吧");
        return false;
    } else {
        var imgNum = $(".feedback_img_list").find(".feedback_images").length;
        //如果有图片就上传图片
        if (imgNum > 0) {
            //图片数据
            //var srcImg = [];
            for (var i = 0; i < $('.feedback_img_list .feedback_images').length; i++) {
                var picid = $('.feedback_img_list .feedback_images').eq(i).find('input').attr('id');
                //console.log(id)
                // console.log(document.getElementById(picid));
                //上传图片

                $.ajaxFileUpload({ /*http://192.168.50.235:9901*/
                    url: "/cloudlink-core-file/attachment/save?businessId=" + uuid + "&bizType=pic_suggestions&token=123456",
                    /*这是处理文件上传的servlet*/
                    secureuri: false,
                    fileElementId: picid, //上传input的id
                    dataType: "JSON",
                    type: "POST",
                    async: false,
                    success: function(data, status) {
                        var statu = JSON.parse(data.split('>')[1]).success;
                        if (statu == 1) {
                            nImgHasBeenSendSuccess++;
                            // console.log(nImgHasBeenSendSuccess);
                            // console.log($('.feedback_img_list .feedback_images').length);
                            if (nImgHasBeenSendSuccess == $('.feedback_img_list .feedback_images').length) {
                                postAdvise(textArea, contactWay, uuid);
                            }
                        } else {
                            alert("当前网络不稳定")
                        }
                    }
                });

            }
        } else {
            postAdvise(textArea, contactWay, uuid);
        }
        //建议的提交
        console.log({
            'description': textArea, //填写的建议
            'feedbackType': "pic", //建议类型
            'contact': contactWay, //联系方式
            'objectId': uuid //插入的主键id
        });

    }
}

function postAdvise(textArea, contactWay, uuid) {
    $.ajax({ /*http://192.168.50.235:9901*/
        url: "/cloudlink-core-framework/feedback/addAdvice",
        type: "POST",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            'description': textArea, //填写的建议
            'feedbackType': "pic", //建议类型
            'contact': contactWay, //联系方式
            'objectId': uuid //插入的主键id
        }),
        success: function(data) {
            console.log(data);
            if (data.success == 1) {
                $(".feedback_main").hide();
                $(".feedback_success").show();
            } else {
                alert("当前网络不稳定");
            }
        }
    });
}
//uuid
function creatuuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {

        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}