"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const common_request_index = require("./common/request/index.js");
const uni_modules_vkUviewUi_index = require("./uni_modules/vk-uview-ui/index.js");
const store_index = require("./store/index.js");
const common_util = require("./common/util.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/order/order.js";
  "./pages/my/my.js";
  "./pages/login/login.js";
  "./pages/friendRegistration/friend-registration.js";
  "./subpackageHome/pointSingle/point-single.js";
  "./subpackageHome/setTlement/pay.js";
  "./subpackageHome/setTlement/remark.js";
  "./subpackageHome/pointsMall/points-mall.js";
  "./subpackageHome/pointsMall/withdraw-history.js";
  "./subpackageOrder/order/order-detail.js";
  "./subpackageOrder/order/coupon-detail.js";
  "./subpackageMy/myAddress/add-address.js";
  "./subpackageMy/myAddress/address-manage.js";
  "./subpackageMy/infoSet/set.js";
  "./subpackageMy/myBalance/balance-topup.js";
  "./subpackageMy/myCoupon/coupon-topup.js";
  "./subpackageMy/riderCenter/rider-center.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(uni_modules_vkUviewUi_index.uView);
  app.use(store_index.store);
  app.config.globalProperties.$util = common_util.util;
  app.config.globalProperties.$api = common_request_index.api;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
