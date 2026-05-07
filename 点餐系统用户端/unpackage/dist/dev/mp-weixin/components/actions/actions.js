"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "Actions",
  props: {
    number: {
      type: Number,
      default: 0
    },
    materialsBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    add() {
      this.$emit("add");
    },
    minus() {
      this.$emit("minus");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.materialsBtn
  }, !$props.materialsBtn ? {
    b: common_assets._imports_0$4,
    c: $props.number,
    d: common_vendor.o((...args) => $options.minus && $options.minus(...args), "4c"),
    e: common_vendor.t($props.number),
    f: $props.number,
    g: common_assets._imports_1$1,
    h: common_vendor.o((...args) => $options.add && $options.add(...args), "d6")
  } : {
    i: common_vendor.o(($event) => _ctx.$emit("materials"), "f5"),
    j: common_vendor.t($props.number),
    k: $props.number
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4221311a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/actions/actions.js.map
