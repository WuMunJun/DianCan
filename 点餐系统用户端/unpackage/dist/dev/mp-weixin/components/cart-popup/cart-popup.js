"use strict";
const common_vendor = require("../../common/vendor.js");
const uniPopup = () => "../uni-popup/uni-popup.js";
const actions = () => "../actions/actions.js";
const _sfc_main = {
  components: {
    uniPopup,
    actions
  },
  props: {
    cart: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    open() {
      this.$refs["popup"].open();
    },
    close() {
      this.$refs["popup"].close();
    },
    change({
      show
    }) {
      this.$emit("change", show);
    },
    add(item) {
      this.$emit("add", item);
    },
    minus(item) {
      this.$emit("minus", item);
    },
    clear() {
      this.$emit("clear");
    }
  }
};
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_actions2 = common_vendor.resolveComponent("actions");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_u_icon2 + _easycom_actions2 + _easycom_uni_popup2)();
}
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_actions = () => "../actions/actions.js";
const _easycom_uni_popup = () => "../uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_u_icon + _easycom_actions + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      size: "23",
      name: "trash"
    }),
    b: common_vendor.o((...args) => $options.clear && $options.clear(...args), "92"),
    c: common_vendor.f($props.cart, (item, index, i0) => {
      return common_vendor.e({
        a: item.image,
        b: common_vendor.t(item.name),
        c: item.materials_text
      }, item.materials_text ? {
        d: common_vendor.t(item.materials_text)
      } : {}, {
        e: common_vendor.t(item.price),
        f: common_vendor.o(($event) => $options.add(item), index),
        g: common_vendor.o(($event) => $options.minus(item), index),
        h: "f070f07b-2-" + i0 + ",f070f07b-0",
        i: common_vendor.p({
          number: item.number
        }),
        j: index
      });
    }),
    d: common_vendor.sr("popup", "f070f07b-0"),
    e: common_vendor.o($options.change, "7f"),
    f: common_vendor.p({
      type: "bottom"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f070f07b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/cart-popup/cart-popup.js.map
