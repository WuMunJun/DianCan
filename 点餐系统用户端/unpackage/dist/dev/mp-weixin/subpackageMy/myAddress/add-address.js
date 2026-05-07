"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        name: "",
        phone: "",
        address: "",
        longitude: "",
        latitude: "",
        house_number: ""
      }
    };
  }
};
if (!Array) {
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_u_form_item2 = common_vendor.resolveComponent("u-form-item");
  const _easycom_u_form2 = common_vendor.resolveComponent("u-form");
  (_easycom_u_input2 + _easycom_u_form_item2 + _easycom_u_form2)();
}
const _easycom_u_input = () => "../../uni_modules/vk-uview-ui/components/u-input/u-input.js";
const _easycom_u_form_item = () => "../../uni_modules/vk-uview-ui/components/u-form-item/u-form-item.js";
const _easycom_u_form = () => "../../uni_modules/vk-uview-ui/components/u-form/u-form.js";
if (!Math) {
  (_easycom_u_input + _easycom_u_form_item + _easycom_u_form)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.form.name = $event, "e3"),
    b: common_vendor.p({
      placeholder: "请输入联系人",
      modelValue: $data.form.name
    }),
    c: common_vendor.p({
      label: "联系人",
      prop: "name",
      ["label-position"]: "top"
    }),
    d: common_vendor.o(($event) => $data.form.phone = $event, "f8"),
    e: common_vendor.p({
      placeholder: "请输入手机号",
      type: "number",
      maxlength: "11",
      modelValue: $data.form.phone
    }),
    f: common_vendor.p({
      label: "手机号",
      prop: "phone",
      ["label-position"]: "top"
    }),
    g: common_vendor.o(($event) => $data.form.address = $event, "66"),
    h: common_vendor.p({
      placeholder: "请输入详细地址",
      modelValue: $data.form.address
    }),
    i: common_vendor.p({
      label: "详细地址",
      prop: "address",
      ["label-position"]: "top"
    }),
    j: common_vendor.o(($event) => $data.form.house_number = $event, "c4"),
    k: common_vendor.p({
      placeholder: "请输入门牌号",
      modelValue: $data.form.house_number
    }),
    l: common_vendor.p({
      label: "门牌号（例:1号楼2单元301）",
      prop: "house_number",
      ["label-position"]: "top"
    }),
    m: common_vendor.p({
      model: $data.form
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5bf08bc1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageMy/myAddress/add-address.js.map
