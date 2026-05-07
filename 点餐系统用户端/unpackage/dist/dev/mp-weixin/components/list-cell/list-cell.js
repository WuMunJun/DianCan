"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "ListCell",
  props: {
    //是否有箭头
    arrow: {
      type: Boolean,
      default: false
    },
    //是否有点击效果
    hover: {
      type: Boolean,
      default: false
    },
    lineLeft: {
      type: Boolean,
      default: true
    },
    lineRight: {
      type: Boolean,
      default: false
    },
    padding: {
      type: String,
      default: "30rpx"
    },
    last: {
      type: Boolean,
      default: false
      //最后一条数据隐藏线条
    },
    radius: {
      type: Boolean,
      default: false
    },
    bgcolor: {
      type: String,
      default: "#fff"
      //背景颜色
    },
    size: {
      type: Number,
      default: 28
      //字体大小
    },
    color: {
      type: String,
      default: "#343434"
      //字体颜色
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", {
        index: this.index
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.arrow
  }, $props.arrow ? {
    b: common_assets._imports_0$7
  } : {}, {
    c: $props.last ? 1 : "",
    d: $props.lineLeft ? 1 : "",
    e: $props.lineRight ? 1 : "",
    f: $props.radius ? 1 : "",
    g: $props.hover ? "tui-cell-hover" : "",
    h: $props.bgcolor,
    i: $props.size + "rpx",
    j: $props.color,
    k: $props.padding,
    l: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args), "ab")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-68e8e7aa"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/list-cell/list-cell.js.map
