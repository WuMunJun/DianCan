"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      background: {
        backgroundColor: "#F5F5F5"
      },
      titleStyle: {
        fontSize: "29rpx",
        color: "#333333"
      }
    };
  },
  methods: {
    handleAddress() {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/myAddress/address-manage?methods=my`
      });
    },
    handleUserInfo() {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/infoSet/set`
      });
    },
    handleMyBalance() {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/myBalance/balance-topup`
      });
    },
    handleMyCoupon() {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/myCoupon/coupon-topup`
      });
    },
    handlePromotion() {
      common_vendor.index.navigateTo({
        url: `/subpackageHome/pointsMall/points-mall`
      });
    },
    handleRiderCenter() {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/riderCenter/rider-center`
      });
    },
    handleMyOrder(status) {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/myOrder/my-order?status=${status}`
      });
    }
  }
};
if (!Array) {
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_avatar2 = common_vendor.resolveComponent("u-avatar");
  const _easycom_u_cell_item2 = common_vendor.resolveComponent("u-cell-item");
  const _easycom_u_cell_group2 = common_vendor.resolveComponent("u-cell-group");
  (_easycom_u_navbar2 + _easycom_u_avatar2 + _easycom_u_cell_item2 + _easycom_u_cell_group2)();
}
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
const _easycom_u_avatar = () => "../../uni_modules/vk-uview-ui/components/u-avatar/u-avatar.js";
const _easycom_u_cell_item = () => "../../uni_modules/vk-uview-ui/components/u-cell-item/u-cell-item.js";
const _easycom_u_cell_group = () => "../../uni_modules/vk-uview-ui/components/u-cell-group/u-cell-group.js";
if (!Math) {
  (_easycom_u_navbar + _easycom_u_avatar + _easycom_u_cell_item + _easycom_u_cell_group)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      background: $data.background,
      ["border-bottom"]: false,
      ["is-back"]: false
    }),
    b: common_vendor.o((...args) => $options.handleUserInfo && $options.handleUserInfo(...args), "48"),
    c: common_vendor.p({
      src: "/static/logo.jpg",
      size: "77"
    }),
    d: common_vendor.o((...args) => $options.handleUserInfo && $options.handleUserInfo(...args), "1e"),
    e: common_vendor.o((...args) => $options.handleMyBalance && $options.handleMyBalance(...args), "c4"),
    f: common_vendor.o((...args) => $options.handleMyCoupon && $options.handleMyCoupon(...args), "14"),
    g: common_vendor.o($options.handleRiderCenter, "54"),
    h: common_vendor.p({
      title: "骑手中心",
      ["hover-class"]: "none",
      ["title-style"]: $data.titleStyle,
      ["border-bottom"]: false
    }),
    i: common_vendor.o($options.handleAddress, "71"),
    j: common_vendor.p({
      title: "收货地址",
      ["hover-class"]: "none",
      ["title-style"]: $data.titleStyle,
      ["border-bottom"]: false
    }),
    k: common_vendor.p({
      title: "问题反馈",
      ["hover-class"]: "none",
      ["title-style"]: $data.titleStyle,
      ["border-bottom"]: false
    }),
    l: common_vendor.p({
      title: "我的客服",
      ["hover-class"]: "none",
      ["title-style"]: $data.titleStyle,
      ["border-bottom"]: false
    }),
    m: common_vendor.o($options.handlePromotion, "6b"),
    n: common_vendor.p({
      title: "我的推广",
      ["hover-class"]: "none",
      ["title-style"]: $data.titleStyle,
      ["border-bottom"]: false
    }),
    o: common_vendor.p({
      border: false
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2f1ef635"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
