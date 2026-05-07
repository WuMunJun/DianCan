"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "Modal",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    custom: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: "80%"
    },
    padding: {
      type: String,
      default: "30rpx"
    },
    radius: {
      type: String,
      default: "12rpx"
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#343434"
    },
    size: {
      type: Number,
      default: 28
    },
    shape: {
      type: String,
      default: "square"
    },
    button: {
      type: Array,
      default: function() {
        return [{
          text: "取消",
          type: "red",
          plain: true
        }, {
          text: "确定",
          type: "red",
          plain: false
        }];
      }
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    // 保留 fadein 属性，但不再控制动画，避免干扰
    fadein: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick(e) {
      if (!this.show)
        return;
      const dataset = e.currentTarget.dataset;
      this.$emit("click", {
        index: Number(dataset.index)
      });
    },
    handleClickCancel() {
      if (!this.maskClosable)
        return;
      this.$emit("cancel");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.custom
  }, $props.custom ? {} : common_vendor.e({
    b: $props.title
  }, $props.title ? {
    c: common_vendor.t($props.title)
  } : {}, {
    d: common_vendor.n($props.title ? "" : "mtop"),
    e: $props.color,
    f: $props.size + "rpx",
    g: common_vendor.f($props.button, (item, index, i0) => {
      return {
        a: common_vendor.t(item.text || "确定"),
        b: common_vendor.n("" + (item.type || "primary") + (item.plain ? "-outline" : "")),
        c: common_vendor.n("btn-" + (item.size || "default")),
        d: "" + (item.plain ? "outline" : item.type || "primary") + "-hover",
        e: index,
        f: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args), index),
        g: index
      };
    }),
    h: common_vendor.n($props.button.length != 2 ? "btn-width" : ""),
    i: common_vendor.n($props.button.length > 2 ? "mbtm" : ""),
    j: common_vendor.n($props.shape == "circle" ? "circle-btn" : ""),
    k: common_vendor.n($props.button.length != 2 ? "flex-column" : "")
  }), {
    l: $props.width,
    m: $props.padding,
    n: $props.radius,
    o: common_vendor.n($props.show ? "modal-show" : ""),
    p: common_vendor.n($props.show ? "mask-show" : ""),
    q: common_vendor.o((...args) => $options.handleClickCancel && $options.handleClickCancel(...args), "79"),
    r: common_vendor.o(() => {
    }, "05")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/modal/modal.js.map
