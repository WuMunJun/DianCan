"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "address-manage",
  setup(__props) {
    const dataList = common_vendor.ref([{
      address: "北京市东城区王府井大街",
      house_number: "88号",
      name: "Kaiyuan_Q",
      phone: "18888888888"
    }]);
    const add = () => {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/myAddress/add-address`
      });
    };
    const chooseAddress = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(dataList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.address),
            b: common_vendor.t(item.house_number),
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.phone),
            e: index,
            f: common_vendor.o(chooseAddress, index)
          };
        }),
        b: common_vendor.o(add, "c2")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f7a2ca4d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageMy/myAddress/address-manage.js.map
