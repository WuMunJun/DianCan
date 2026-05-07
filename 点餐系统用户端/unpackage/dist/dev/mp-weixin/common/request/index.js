"use strict";
const common_vendor = require("../vendor.js");
const common_request_promotion = require("./promotion.js");
const common_request_order = require("./order.js");
const common_request_menu = require("./menu.js");
const json = {
  promotion: common_request_promotion.promotion,
  order: common_request_order.order,
  menu: common_request_menu.menu
};
const api = (name, loading = true) => {
  if (loading) {
    common_vendor.index.showLoading();
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      common_vendor.index.hideLoading();
      resolve(json[name]);
    }, 500);
  });
};
exports.api = api;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/common/request/index.js.map
