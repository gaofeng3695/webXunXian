// 组织机构管理
var organizationObj = {
    $addDepart: $(".department_add span"),
    $frameAdd: $("#departmentAdd"),
    $frameModify: $("#departmentModify"),
    $addBtn: $("#addDepart"),
    $modifyBtn: $("#modifyDepart"),
    $selectedBtn: $("#selectedDepart"),
    $childList: $(".child_list"),
    _selectedId: null, //所选部门的id
    _selectedName: null, //所选部门的名称
    _flag: true,
    init: function() {
        var _this = this;

        this.getAllData();

        //打开添加子部门模态框
        this.$addDepart.click(function() {
            if (_this._selectedId == '' || _this._selectedId == null) {
                xxwsWindowObj.xxwsAlert('请选择您要添加所在的部门！');
            } else {
                _this.$frameAdd.modal();
                $("input[name=selectParentDepart]").attr("data-id", _this._selectedId).val(_this._selectedName);
            }
        });

        //子部门添加的选择父级部门
        $("input[name=selectParentDepart]").click(function() {
            var parentId = $(this).attr("data-id");
            departmentObj.getAllData("addParent", parentId);
        });
        //提交子部门事件
        this.$addBtn.click(function() {
            var addOrgName = $("input[name=addDepart]").val().trim();
            var addOrgParentId = $("input[name=selectParentDepart]").attr("data-id");
            if (_this._flag == true) {
                _this._flag = false;
                if (addOrgName == null) {
                    xxwsWindowObj.xxwsAlert('请填写您要添加部门的名称！');
                    _this.again();
                } else {
                    _this.addDepartment(addOrgName, addOrgParentId);
                }
            }
        });

        //删除部门
        $(".child_list").on('click', '.delete_btn', function() {
            var orgId = $(this).closest("li").attr("data-id");
            var defaultOptions = {
                tip: '您是否确定删除此部门？',
                name_title: '提示',
                name_cancel: '取消',
                name_confirm: '确定',
                isCancelBtnShow: true,
                callBack: function() {
                    _this.deleteDepartment(orgId);
                }
            };
            xxwsWindowObj.xxwsAlert(defaultOptions);
        });

        //修改部门
        $(".child_list").on('click', '.modify_btn', function() {
            var orgId = $(this).closest("li").attr("data-id");
            var orgName = $(this).closest("li").find("span").text();
            _this.$frameModify.modal();
            _this.modifyData(orgId, orgName);
        });

        //修改部门的选择父级部门
        $("input[name=parentDepart]").click(function() {
            var parentId = $(this).attr("data-id");
            var childId = $("input[name=childDepart]").attr("data-id");
            departmentObj.getAllData("selectParent", parentId, childId);
        });

        //获取父级部门选择值
        this.$selectedBtn.click(function() {
            var departObj = departmentObj.getSelectDepart();
            var depart = departObj.value;
            if (departObj.key == "addParent") {
                $("input[name=selectParentDepart]").attr("data-id", depart[0].id).val(depart[0].name);
            } else {
                $("input[name=parentDepart]").attr("data-id", depart[0].id).val(depart[0].name);
            }
        });
        //修改部门提交
        this.$modifyBtn.click(function() {
            var orgChildName = $("input[name=childDepart]").val().trim();
            var orgChildId = $("input[name=childDepart]").attr("data-id");
            var orgParentId = $("input[name=parentDepart]").attr("data-id");
            if (_this._flag == true) {
                _this._flag = false;
                if (orgChildName == null) {
                    xxwsWindowObj.xxwsAlert('请填写您要修改部门的名称！');
                    _this.again();
                } else {
                    _this.updataDepartment(orgChildId, orgChildName, orgParentId);
                }
            }
        });
    },
    getAllData: function() { //获取所有的数据
        var _this = this;
        var userBo = lsObj.getLocalStorage('userBo');
        $.ajax({
            type: "GET",
            url: "/cloudlink-core-framework/organization/getTree",
            contentType: "application/json",
            data: {
                token: lsObj.getLocalStorage('token'),
                enterpriseId: JSON.parse(userBo).enterpriseId
            },
            dataType: "json",
            success: function(data) {
                _this.renderDepartment(data.rows);
            }
        });
    },
    renderDepartment: function(e) { //遍历部门tree，渲染页面
        var _this = this;
        var setting = {
            view: {
                showLine: false,
                showIcon: false,
                addDiyDom: function(treeId, treeNode) {
                    var spaceWidth = 0;
                    var switchObj = $("#" + treeNode.tId + "_switch"),
                        icoObj = $("#" + treeNode.tId + "_ico");
                    switchObj.remove();
                    icoObj.before(switchObj);
                    if (treeNode.level > 1) {
                        var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * (treeNode.level - 1)) + "px'></span>";
                        switchObj.before(spaceStr);
                    }
                }
            },
            data: {
                key: {
                    name: 'name'
                },
                simpleData: {
                    enable: true,
                    pIdKey: 'pid'
                }
            },
            check: {
                enable: false,
                chkStyle: "checkbox",
            },
            callback: {
                beforeClick: function(treeId, treeNode) {
                    // var zTree = $.fn.zTree.getZTreeObj("department_list");
                    // _this.parentNodeObj = treeNode.getParentNode(); //父节点
                    _this.zTree.expandNode(treeNode, true); //打开当前节点
                    _this.getChildList(treeNode);
                }
            }
        };
        _this.zTree = $.fn.zTree.init($("#department_list"), setting, e);
        _this.zTree.expandAll(true);
        if (_this._selectedId == '' || _this._selectedId == null) {
            var nodes = _this.zTree.getNodes();
            _this.zTree.selectNode(nodes[0]);
            _this.getChildList(nodes[0]);
        } else {
            var nodes = _this.zTree.getNodesByParam("id", _this._selectedId, null); //根据id查询节点对象数组
            _this.zTree.selectNode(nodes[0]); //设置默认被选中
            _this.getChildList(nodes[0]);
        }
    },
    getChildList: function(e) { //右侧显示子部门列表
        this.$childList.html("");
        this._selectedId = e.id;
        this._selectedName = e.name;
        var txt = null;
        if (e.children.length > 0) {
            for (var i = 0; i < e.children.length; i++) {
                txt = '<li data-id="' + e.children[i].id + '"><span>' + e.children[i].name + '</span>' +
                    '<i class="delete_btn" title="删除"></i>' +
                    '<i class="modify_btn" title="修改"></i></li>';
                this.$childList.append(txt);
            }
        } else {
            txt = '<li>暂无子部门</li>';
            this.$childList.append(txt);
        }
    },
    addDepartment: function(addOrgName, addOrgParentId) { //添加子部门
        var _this = this;
        var enterpriseId = JSON.parse(lsObj.getLocalStorage('userBo')).enterpriseId;
        var condition = {
            orgName: addOrgName,
            enterpriseId: enterpriseId,
            parentId: addOrgParentId,
            manager: ""
        };
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/organization/add?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(condition),
            dataType: "json",
            success: function(data) {
                if (data.success == 1) {
                    $("input[name=addDepart]").val("");
                    _this._selectedId = addOrgParentId;
                    _this.$frameAdd.modal('hide');
                    _this.getAllData();
                } else {
                    xxwsWindowObj.xxwsAlert("当前网络不稳定,请稍后再试");
                }
                _this.again();
            },
            error: function() {
                xxwsWindowObj.xxwsAlert("当前网络不稳定,请稍后再试");
                _this.again();
            }
        });
    },
    deleteDepartment: function(objId) { //删除部门
        var _this = this;
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/organization/delete?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify({ "objectId": objId }),
            dataType: "json",
            success: function(data) {
                console.log(data);
                if (data.success == 1) {
                    xxwsWindowObj.xxwsAlert("删除成功！");
                    _this.getAllData();
                } else {
                    xxwsWindowObj.xxwsAlert(data.msg);
                }
            },
            error: function() {
                xxwsWindowObj.xxwsAlert("当前网络不稳定,请稍后再试");
            }
        });
    },
    updataDepartment: function(orgChildId, orgChildName, orgParentId) { //更新部门信息
        var _this = this;
        var orgChild = {
            objectId: orgChildId,
            orgName: orgChildName,
        };
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/organization/update?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(orgChild),
            dataType: "json",
            success: function(data) {
                if (data.success == 1) {
                    _this.updataParentDepart(orgChildId, orgParentId);
                } else {
                    xxwsWindowObj.xxwsAlert(data.msg);
                    _this.again();
                }
            },
            error: function() {
                xxwsWindowObj.xxwsAlert("当前网络不稳定,请稍后再试");
                _this.again();
            }
        });
    },
    updataParentDepart: function(orgChildId, orgParentId) {
        var _this = this;
        var orgParent = {
            targetId: orgParentId,
            sourceId: orgChildId,
            type: "append"
        };
        $.ajax({
            type: "POST",
            url: "/cloudlink-core-framework/organization/updateOrganizationTree?token=" + lsObj.getLocalStorage('token'),
            contentType: "application/json",
            data: JSON.stringify(orgParent),
            dataType: "json",
            success: function(data) {
                if (data.success == 1) {
                    _this.$frameModify.modal('hide');
                    _this._selectedId = orgParentId;
                    _this.getAllData();
                } else {
                    xxwsWindowObj.xxwsAlert(data.msg);
                }
                _this.again();
            },
            error: function() {
                xxwsWindowObj.xxwsAlert("当前网络不稳定,请稍后再试");
                _this.again();
            }
        });
    },
    modifyData: function(id, name) { //渲染修改模态框数据
        var _this = this;
        this.$frameModify.on('shown.bs.modal', function(e) {
            $("input[name=childDepart]").attr("data-id", id).val(name);
            $("input[name=parentDepart]").attr("data-id", _this._selectedId).val(_this._selectedName);
        });
    },
    again: function() {
        this._flag = true;
    }
};



$(function() {
    organizationObj.init();
    //通过该方法来为每次弹出的模态框设置最新的zIndex值，从而使最新的modal显示在最前面
    $(document).on('show.bs.modal', '.modal', function(event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });
    $(document).on('hidden.bs.modal', '.modal', function(event) {
        if ($('.modal:visible').length > 0) {
            $("body").addClass("modal-open");
        }
    });
});