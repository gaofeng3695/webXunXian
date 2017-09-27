/**
 * 参数说明
 *<modal-vue v-if="netshow" :styleobj="styleobj"  :footer="aFooters" @click1="createSave" @click2="cancel">
 *styleobj:打开模态框的样式{title: '标题',width: '宽度800(不需要单位)',height: '高度',}
 :footer="aFooters"下面按钮的样式[{ "title": "新建", "bgcolor": "#59b6fc","color":"按钮字体显示的颜色", "disabled": false }, { "title": "取消", "color": "#fff", "disabled": false }, ];
 后面的click1,click2依次写入  和前面的按钮相匹配上
 */

// 实现列表组件展示
Vue.component('modal-vue', {
    props: {
        styleobj: {
            type: Object,
        },
        footer: {
            type: Array,
        }
    },
    template: [
        '<transition name="fade">',
        '<div class="forms"><div class="modal_table" v-bind:style="whstyle">',
        '<modal-top :title="styleobj.title" @click1="click2"></modal-top>',
        '<div class="content"  v-bind:style="height">',
        '<div class="tablevue">',
        '<slot>',
        '</slot>',
        '</div>',
        '</div>',
        '<modal-footer :footer="footer"  @click1="click1" @click2="click2" v-if="footer"></modal-footer>',
        '</div>',
        '</div>',
        '</transition>',
    ].join(" "),
    methods: {
        click1: function() {
            this.$emit('click1', this.styleobj);
        },
        click2: function() {
            this.$emit('click2', this.styleobj);
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
        '<span class="closes"  @click="click1">X</span>',
        '</div>',
    ].join(" "),
    methods: {
        click1: function() {
            this.$emit('click1');
        },
    },
});
Vue.component('modal-footer', {
    props: {
        footer: {
            type: Array,
        }
    },
    template: [
        '<div class="footer">',
        '<button class="btns "  v-for="item,index in footer" @click="clickbtn($event.currentTarget,item,index)" :style=[{background:item.bgcolor,color:item.color}]>{{item.title}}</button>',
        '</div>',
    ].join(" "),
    data: function() {
        return {
            style: {

            }
        };
    },
    methods: {
        clickbtn: function(dom, item, index) {
            var that = this;
            if (that.footer[index].disabled) {
                return;
            }
            that.$emit('click' + (index + 1));
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