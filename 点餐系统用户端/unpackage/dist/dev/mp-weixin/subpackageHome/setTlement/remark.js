"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      remarks: [
        {
          label: "对骑手",
          active: 0
        },
        {
          label: "对商家",
          active: 0
        },
        {
          label: "不要敲门",
          active: 0
        },
        {
          label: "放前台",
          active: 0
        },
        {
          label: "放门卫",
          active: 0
        },
        {
          label: "不要打电话",
          active: 0
        },
        {
          label: "请提前电话联系",
          active: 0
        },
        {
          label: "堂食无需打包",
          active: 0
        },
        {
          label: "我要自取，不要配送",
          active: 0
        }
      ],
      remark: ""
    };
  },
  computed: {
    ...common_vendor.mapState(["orderType"])
  },
  onShow() {
    this.remark = this.$store.state.remark;
    this.remarks.forEach((item) => item.label == this.remark && (item.active = 1));
  },
  methods: {
    choose(index) {
      this.remarks.forEach((item) => item.active = 0);
      this.remarks[index].active = 1;
      this.remark = this.remarks[index].label;
    },
    handleTextareaInput(e) {
      if (e.detail.value.length >= 50) {
        common_vendor.index.showToast({
          icon: "none",
          title: "最多备注50个字符"
        });
        return;
      }
    },
    submit() {
      this.$store.commit("SET_REMARK", this.remark);
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.orderType != "takeshop"
  }, _ctx.orderType != "takeshop" ? {
    b: common_vendor.f($data.remarks, (remark, index, i0) => {
      return {
        a: common_vendor.t(remark.label),
        b: remark.active ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.choose(index), index)
      };
    })
  } : {}, {
    c: common_vendor.o([($event) => $data.remark = $event.detail.value, (...args) => $options.handleTextareaInput && $options.handleTextareaInput(...args)], "1d"),
    d: $data.remark,
    e: common_vendor.t($data.remark.length),
    f: common_vendor.o((...args) => $options.submit && $options.submit(...args), "3c")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageHome/setTlement/remark.js.map
