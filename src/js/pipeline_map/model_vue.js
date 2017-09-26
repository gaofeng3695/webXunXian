/**
 * 参数说明
 * inputobj：
 * title: "管线名称",
 *  type: 1,1：表示一行只显示一条；2：表示一行显示两天；0表示文本域
 *  required: true
 */

// 实现列表组件展示
Vue.component('modal-vue', {
    props: {
        styleobj: {
            type: Object,
        },
        inputobj: {
            type: Object,
        }
    },
    template: [
        '<div class="forms"><div class="modal_table" v-bind:style="whstyle">',
        '<modal-top :title="styleobj.title" @closes="createinfo"></modal-top>',
        '<div class="content"  v-bind:style="height">',
        '<div class="tablevue">',
        '<slot>',
        '</slot>',
        '</div>',
        '</div>',
        '<modal-footer @closes="createinfo" @save="save"></modal-footer>',
        '</div>',
        '</div>',
    ].join(" "),
    data: function() {
        return {

        }
    },
    methods: {
        createinfo: function() {
            this.$emit('createinfo', this.styleobj);
        },
        save: function() {
            this.$emit('createsave');
            // 进行数据的保存
        }
    },
    computed: {
        whstyle: function() {
            return {
                width: this.styleobj.width + "px",
                height: this.styleobj.height + "px",
            }
        },
        height: function() {
            return {
                height: (this.styleobj.height - 110) + "px",
            }
        }
    }
});


Vue.component('modal-top', {
    props: {
        title: {
            type: String,
        }
    },
    template: [
        '<div class="top">',
        '<span class="htitle" v-text="title"></span>',
        '<span class="closes"  @click="createInfo">X</span>',
        '</div>',
    ].join(" "),
    methods: {
        createInfo: function() {
            this.$emit('closes');
        },
    },
});
Vue.component('modal-footer', {
    template: [
        '<div class="footer">',
        '<button class="btns submit" @click="save()">保存</button>',
        '<button class="btns cancel" @click="closes()">取消</button>',
        '</div>',
    ].join(" "),
    methods: {
        closes: function() {
            this.$emit('closes');
        },
        save: function() {
            this.$emit('save');
        }
    },
});
Vue.component('input-vue', {
    props: {
        title: {
            type: String,
        },
        required: {
            type: Boolean,
        },
        name: {
            type: String,
        },
        inputobj: {
            type: Object,
        }
    },
    template: [
        '<div class="form_list"><div class="list_left text-right">',
        '<i v-if="required">*</i>{{title}}',
        '</div>',
        '<div class="list_right">',
        '<input type="text" class="form-control" :name="name" v-model="inputobj[name]">',
        '</div></div>',
    ].join(" "),
});
Vue.component('textarea-vue', {
    props: {
        title: {
            type: String,
        },
        name: {
            type: String,
        },
        inputobj: {
            type: Object,
        }
    },
    template: [
        '<div class="form_list"><div class="list_left text-right">',
        '{{title}}',
        '</div>',
        '<div class="list_right textarea_text">',
        '<textarea :name="name" class="form-control" v-model="inputobj[name]"></textarea>',
        '</div></div>',
    ].join(" "),

});
Vue.component('input-two-vue', {
    props: {
        title: {
            type: String,
        },
        name: {
            type: String,
        },
        inputobj: {
            type: Object,
        },
        required: {
            type: Boolean,
        }
    },
    template: [
        '<div class="form_part" >',
        '<div class="list_left">',
        '<i v-if="required">*</i>{{title}}</div>',
        '<div class="list_right">',
        '<input type="text" class="form-control" :name="name" v-model="inputobj[name]">',
        '</div>',
        '</div>',
    ].join(" "),
    mounted: function() {

    },

});