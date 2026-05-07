"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  (_easycom_u_image2 + _easycom_u_avatar2)();
}
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_avatar = () => "../../uni_modules/vk-uview-ui/components/u-avatar/u-avatar.js";
if (!Math) {
  (_easycom_u_image + _easycom_u_avatar)();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      src: common_assets._imports_0$1,
      width: "100%",
      height: "800",
      ["lazy-load"]: true
    }),
    b: common_vendor.p({
      src: ""
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ded723a4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/friendRegistration/friend-registration.js.map
