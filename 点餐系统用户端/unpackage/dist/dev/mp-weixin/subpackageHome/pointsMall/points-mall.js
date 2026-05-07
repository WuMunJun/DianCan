"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_grid_item2 = common_vendor.resolveComponent("u-grid-item");
  const _easycom_u_grid2 = common_vendor.resolveComponent("u-grid");
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  (_easycom_u_image2 + _easycom_u_grid_item2 + _easycom_u_grid2 + _easycom_u_avatar2)();
}
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_grid_item = () => "../../uni_modules/vk-uview-ui/components/u-grid-item/u-grid-item.js";
const _easycom_u_grid = () => "../../uni_modules/vk-uview-ui/components/u-grid/u-grid.js";
const _easycom_u_avatar = () => "../../uni_modules/vk-uview-ui/components/u-avatar/u-avatar.js";
if (!Math) {
  (_easycom_u_image + _easycom_u_grid_item + _easycom_u_grid + _easycom_u_avatar)();
}
const _sfc_main = {
  __name: "points-mall",
  setup(__props) {
    const {
      proxy
    } = common_vendor.getCurrentInstance();
    const promotionList = common_vendor.ref([]);
    const withdrawRecord = () => {
      common_vendor.index.navigateTo({
        url: `/subpackageHome/pointsMall/withdraw-history`
      });
    };
    const inviteFriends = () => {
      common_vendor.index.navigateTo({
        url: `/pages/friendRegistration/friend-registration`
      });
    };
    common_vendor.onMounted(async () => {
      promotionList.value = await proxy.$api("promotion");
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(inviteFriends, "d7"),
        b: common_vendor.p({
          src: common_assets._imports_0$3,
          width: "100%",
          height: "800",
          ["lazy-load"]: true
        }),
        c: common_vendor.o(withdrawRecord, "83"),
        d: common_vendor.p({
          col: 2,
          border: false
        }),
        e: common_vendor.f(promotionList.value, (item, index, i0) => {
          return {
            a: "59decf1b-4-" + i0,
            b: common_vendor.p({
              src: item.avatar,
              size: "80"
            }),
            c: common_vendor.t(item.nickname),
            d: common_vendor.t(item.amount),
            e: common_vendor.t(item.amount),
            f: common_vendor.t(item.createtime),
            g: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-59decf1b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageHome/pointsMall/points-mall.js.map
