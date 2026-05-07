"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      list: [
        {
          recharge_amount: 10,
          coupon_reward: 0,
          egg_reward: 0
        },
        {
          recharge_amount: 20,
          coupon_reward: 0,
          egg_reward: 0
        },
        {
          recharge_amount: 100,
          coupon_reward: 10,
          egg_reward: 0
        },
        {
          recharge_amount: 200,
          coupon_reward: 50,
          egg_reward: 0
        },
        {
          recharge_amount: 500,
          coupon_reward: 500,
          egg_reward: 10
        }
      ]
    };
  },
  methods: {
    test() {
      common_vendor.index.showToast({
        title: "开发中...",
        icon: "none"
      });
    }
  }
};
if (!Array) {
  const _easycom_u_grid_item2 = common_vendor.resolveComponent("u-grid-item");
  const _easycom_u_grid2 = common_vendor.resolveComponent("u-grid");
  (_easycom_u_grid_item2 + _easycom_u_grid2)();
}
const _easycom_u_grid_item = () => "../../uni_modules/vk-uview-ui/components/u-grid-item/u-grid-item.js";
const _easycom_u_grid = () => "../../uni_modules/vk-uview-ui/components/u-grid/u-grid.js";
if (!Math) {
  (_easycom_u_grid_item + _easycom_u_grid)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.test && $options.test(...args), "69"),
    b: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.recharge_amount),
        b: item.coupon_reward || item.egg_reward
      }, item.coupon_reward || item.egg_reward ? common_vendor.e({
        c: item.coupon_reward && Number(item.coupon_reward) > 0
      }, item.coupon_reward && Number(item.coupon_reward) > 0 ? {
        d: common_vendor.t(item.coupon_reward)
      } : {}, {
        e: item.egg_reward && Number(item.egg_reward) > 0
      }, item.egg_reward && Number(item.egg_reward) > 0 ? common_vendor.e({
        f: item.coupon_reward && Number(item.coupon_reward) > 0
      }, item.coupon_reward && Number(item.coupon_reward) > 0 ? {} : {}, {
        g: common_vendor.t(item.egg_reward)
      }) : {}) : {}, {
        h: index,
        i: "bea0bd88-1-" + i0 + ",bea0bd88-0"
      });
    }),
    c: common_vendor.p({
      col: 2
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bea0bd88"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageMy/myBalance/balance-topup.js.map
