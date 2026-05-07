"use strict";
const common_vendor = require("../common/vendor.js");
let store = null;
store = common_vendor.createStore({
  state: {
    orderType: "takein",
    addressInfo: {
      address: "北京市东城区王府井大街",
      house_number: "88号",
      name: "Kaiyuan_Q",
      phone: "18888888888"
    },
    remark: "",
    zhuohao: "",
    peopleCount: 1
  },
  mutations: {
    SET_ORDER_TYPE(state, orderType) {
      state.orderType = orderType;
    },
    SET_ADDRESS(state, addressInfo) {
      state.addressInfo = addressInfo;
    },
    SET_REMARK(state, remark) {
      state.remark = remark;
    },
    SET_ZHUOHAO(state, zhuohao) {
      state.zhuohao = zhuohao;
    },
    SET_PEOPLE_COUNT(state, count) {
      state.peopleCount = count;
    }
  }
});
const store$1 = store;
exports.store = store$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
