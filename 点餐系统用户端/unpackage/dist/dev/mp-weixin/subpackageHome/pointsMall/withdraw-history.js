"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "withdraw-history",
  setup(__props) {
    const withdrawList = common_vendor.ref([{
      "apply_amount": 50,
      "createtime": "2026-01-03 19:52"
    }, {
      "apply_amount": 20,
      "createtime": "2026-01-02 09:38"
    }, {
      "apply_amount": 50,
      "createtime": "2026-01-01 13:55"
    }]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: withdrawList.value.length != 0
      }, withdrawList.value.length != 0 ? {
        b: common_vendor.f(withdrawList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.createtime),
            b: common_vendor.t(item.apply_amount),
            c: index
          };
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ca6e5601"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageHome/pointsMall/withdraw-history.js.map
