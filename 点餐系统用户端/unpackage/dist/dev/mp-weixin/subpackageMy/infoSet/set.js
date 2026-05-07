"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  const _easycom_u_cell_item2 = common_vendor.resolveComponent("u-cell-item");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  (_easycom_u_avatar2 + _easycom_u_cell_item2 + _easycom_u_cell_group2)();
}
const _easycom_u_avatar = () => "../../uni_modules/vk-uview-ui/components/u-avatar/u-avatar.js";
const _easycom_u_cell_item = () => "../../uni_modules/vk-uview-ui/components/u-cell-item/u-cell-item.js";
const _easycom_u_cell_group = () => "../../uni_modules/vk-uview-ui/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_u_avatar + _easycom_u_cell_item + _easycom_u_cell_group)();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      src: "/static/logo.jpg",
      size: "140"
    }),
    b: common_vendor.p({
      title: "姓名",
      ["bg-color"]: "#fff",
      value: "QXS_4vjsk4f",
      arrow: false
    }),
    c: common_vendor.p({
      title: "邀请码",
      ["bg-color"]: "#fff",
      arrow: false,
      value: "4vjsk4f"
    }),
    d: common_vendor.p({
      title: "手机号",
      ["bg-color"]: "#fff",
      ["border-bottom"]: false,
      arrow: false,
      value: "13000000000"
    }),
    e: common_vendor.p({
      title: "注册时间",
      ["bg-color"]: "#fff",
      arrow: false,
      value: "2026-03-03"
    }),
    f: common_vendor.p({
      border: false,
      ["bg-color"]: "#fff"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageMy/infoSet/set.js.map
