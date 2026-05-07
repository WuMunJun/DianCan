"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-gap",
  props: {
    bgColor: {
      type: String,
      default: "transparent "
      // 背景透明
    },
    // 高度
    height: {
      type: [String, Number],
      default: 30
    },
    // 与上一个组件的距离
    marginTop: {
      type: [String, Number],
      default: 0
    },
    // 与下一个组件的距离
    marginBottom: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    gapStyle() {
      return {
        backgroundColor: this.bgColor,
        height: isNaN(this.height) ? this.height : this.height + "rpx",
        marginTop: isNaN(this.marginTop) ? this.marginTop : this.marginTop + "rpx",
        marginBottom: isNaN(this.marginBottom) ? this.marginBottom : this.marginBottom + "rpx"
      };
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.gapStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-925f7f25"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/vk-uview-ui/components/u-gap/u-gap.js.map
