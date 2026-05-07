"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "u-alert-tips",
  emits: ["click", "close"],
  props: {
    // 显示文字
    title: {
      type: String,
      default: ""
    },
    // 主题，success/warning/info/error
    type: {
      type: String,
      default: "warning"
    },
    // 辅助性文字
    description: {
      type: String,
      default: ""
    },
    // 是否可关闭
    closeAble: {
      type: Boolean,
      default: false
    },
    // 关闭按钮自定义文本
    closeText: {
      type: String,
      default: ""
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: false
    },
    // 文字颜色，如果定义了color值，icon会失效
    color: {
      type: String,
      default: ""
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: ""
    },
    // 边框颜色
    borderColor: {
      type: String,
      default: ""
    },
    // 是否显示
    show: {
      type: Boolean,
      default: true
    },
    // 左边显示的icon
    icon: {
      type: String,
      default: ""
    },
    // icon的样式
    iconStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    // 标题的样式
    titleStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    // 描述文字的样式
    descStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    uTitleStyle() {
      let style = {};
      style.fontWeight = this.description ? 500 : "normal";
      return this.$u.deepMerge(style, this.titleStyle);
    },
    uIcon() {
      return this.icon ? this.icon : this.$u.type2icon(this.type);
    },
    uIconType() {
      return Object.keys(this.iconStyle).length ? "" : this.type;
    }
  },
  methods: {
    // 点击内容
    click() {
      this.$emit("click");
    },
    // 点击关闭按钮
    close() {
      this.$emit("close");
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? common_vendor.e({
    b: $props.showIcon
  }, $props.showIcon ? {
    c: common_vendor.p({
      name: $options.uIcon,
      size: $props.description ? 40 : 32,
      color: $options.uIconType,
      ["custom-style"]: $props.iconStyle
    })
  } : {}, {
    d: common_vendor.t($props.title),
    e: common_vendor.s($options.uTitleStyle),
    f: $props.description
  }, $props.description ? {
    g: common_vendor.t($props.description),
    h: common_vendor.s($props.descStyle)
  } : {}, {
    i: common_vendor.o((...args) => $options.click && $options.click(...args), "af"),
    j: $props.closeAble && !$props.closeText
  }, $props.closeAble && !$props.closeText ? {
    k: common_vendor.o($options.close, "c9"),
    l: $props.description ? "18rpx" : "24rpx",
    m: common_vendor.p({
      hoverClass: "u-type-error-hover-color",
      name: "close",
      color: "#c0c4cc",
      size: 22
    })
  } : {}, {
    n: $props.closeAble && $props.closeText
  }, $props.closeAble && $props.closeText ? {
    o: common_vendor.t($props.closeText),
    p: common_vendor.o((...args) => $options.close && $options.close(...args), "56"),
    q: $props.description ? "18rpx" : "24rpx"
  } : {}, {
    r: common_vendor.n(!$props.show ? "u-close-alert-tips" : ""),
    s: common_vendor.n($props.type ? "u-alert-tips--bg--" + $props.type + "-light" : ""),
    t: common_vendor.n($props.type ? "u-alert-tips--border--" + $props.type + "-disabled" : ""),
    v: $props.bgColor,
    w: $props.borderColor
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-76f5e8f2"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/vk-uview-ui/components/u-alert-tips/u-alert-tips.js.map
