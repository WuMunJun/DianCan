"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  const _easycom_u_grid_item2 = common_vendor.resolveComponent("u-grid-item");
  const _easycom_u_grid2 = common_vendor.resolveComponent("u-grid");
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  (_easycom_u_avatar2 + _easycom_u_grid_item2 + _easycom_u_grid2 + _easycom_u_tabs2)();
}
const _easycom_u_avatar = () => "../../uni_modules/vk-uview-ui/components/u-avatar/u-avatar.js";
const _easycom_u_grid_item = () => "../../uni_modules/vk-uview-ui/components/u-grid-item/u-grid-item.js";
const _easycom_u_grid = () => "../../uni_modules/vk-uview-ui/components/u-grid/u-grid.js";
const _easycom_u_tabs = () => "../../uni_modules/vk-uview-ui/components/u-tabs/u-tabs.js";
if (!Math) {
  (_easycom_u_avatar + _easycom_u_grid_item + _easycom_u_grid + _easycom_u_tabs)();
}
const _sfc_main = {
  __name: "rider-center",
  setup(__props) {
    const tabsList = [{
      name: "待取货"
    }, {
      name: "配送中"
    }, {
      name: "已完成"
    }];
    const current = common_vendor.ref(0);
    const change = (event) => {
      current.value = event;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          src: "/static/logo.jpg",
          size: "80"
        }),
        b: common_vendor.p({
          col: 4,
          border: false
        }),
        c: common_vendor.o(change, "e6"),
        d: common_vendor.p({
          list: tabsList,
          ["is-scroll"]: false,
          current: current.value,
          ["active-color"]: "#0A3D28",
          ["bar-width"]: "90",
          duration: "0",
          ["inactive-color"]: "#9A9A9A"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-09a0efaa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageMy/riderCenter/rider-center.js.map
