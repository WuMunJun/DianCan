"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const uniTransition = () => "../uni-transition/uni-transition.js";
const cartPopup = () => "../cart-popup/cart-popup.js";
const _sfc_main = {
  name: "CartBar",
  components: {
    uniTransition,
    cartPopup
  },
  props: {
    cart: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    cartNum() {
      return this.cart.reduce((acc, cur) => acc + cur.number, 0);
    },
    cartPrice() {
      const originalTotal = this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0);
      const fixedTotal = Math.floor(originalTotal * 100) / 100;
      return fixedTotal;
    }
  },
  data() {
    return {
      cartBarStyles: {
        "position": "fixed",
        "bottom": 0,
        "width": "100%",
        "z-index": "995",
        "height": "100rpx",
        "background-color": "#f0f0f1",
        "display": "flex",
        "justify-content": "space-between",
        "align-items": "stretch"
      }
    };
  },
  methods: {
    details() {
      this.$refs["cartPopup"].open();
    },
    add(product) {
      this.$emit("add", {
        ...product,
        number: 1
      });
    },
    minus(product) {
      this.$emit("minus", product);
    },
    clear() {
      this.$emit("clear");
    },
    pay() {
      this.$emit("pay");
    }
  },
  watch: {
    cartNum(val) {
      if (!val) {
        this.$refs["cartPopup"].close();
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  const _easycom_cart_popup2 = common_vendor.resolveComponent("cart-popup");
  (_easycom_uni_transition2 + _easycom_cart_popup2)();
}
const _easycom_uni_transition = () => "../uni-transition/uni-transition.js";
const _easycom_cart_popup = () => "../cart-popup/cart-popup.js";
if (!Math) {
  (_easycom_uni_transition + _easycom_cart_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$5,
    b: common_vendor.t($options.cartNum),
    c: common_vendor.o((...args) => $options.details && $options.details(...args), "92"),
    d: common_vendor.t($options.cartPrice),
    e: common_vendor.o((...args) => $options.pay && $options.pay(...args), "da"),
    f: common_vendor.p({
      ["mode-class"]: ["slide-bottom"],
      show: !!$options.cartNum,
      styles: $data.cartBarStyles
    }),
    g: common_vendor.sr("cartPopup", "e460a6eb-1"),
    h: common_vendor.o($options.add, "33"),
    i: common_vendor.o($options.minus, "8c"),
    j: common_vendor.o($options.clear, "a1"),
    k: common_vendor.p({
      cart: $props.cart
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e460a6eb"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/cartbar/cartbar.js.map
