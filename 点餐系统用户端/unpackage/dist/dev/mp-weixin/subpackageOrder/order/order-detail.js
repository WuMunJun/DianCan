"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      type: "",
      orderData: {
        "torder": "T1",
        "status": "1",
        "orderstatus": 0,
        "delivery_status": 1,
        "commodity_list": [{
          "id": 12,
          "name": "火腿包",
          "price": 3.99,
          "number": 1,
          "image": "/static/img/menu/menu-2.jpg",
          "is_single": false,
          "materials_text": ""
        }, {
          "name": "招牌酱肉包",
          "price": 5.99,
          "number": 1,
          "image": "/static/img/menu/menu-1.jpg",
          "is_single": false,
          "materials_text": ""
        }],
        "shop_num": 2,
        "price": 9.98,
        "name": "Kaiyuan_Q",
        "phone": "18888888888",
        "address": "北京市东城区王府井大街",
        "house_number": "88号",
        "remark": "放门口，不要打电话",
        "out_trade_no": "38fhfhs9048ujv0sjv",
        "transaction_id": "3gfr324r32r32fd23",
        "payment_time_text": "2026-03-03 17:40"
      }
    };
  },
  onLoad(param) {
    this.type = param.type;
  }
};
if (!Array) {
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_gap2 = common_vendor.resolveComponent("u-gap");
  (_easycom_u_image2 + _easycom_u_gap2)();
}
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_gap = () => "../../uni_modules/vk-uview-ui/components/u-gap/u-gap.js";
if (!Math) {
  (_easycom_u_image + _easycom_u_gap)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.type
  }, $data.type ? common_vendor.e({
    b: $data.type == "takein"
  }, $data.type == "takein" ? common_vendor.e({
    c: common_vendor.t($data.orderData.status != "2" ? $data.orderData.torder : "订单已退款"),
    d: $data.orderData.status != "2"
  }, $data.orderData.status != "2" ? {} : {}) : {
    e: common_vendor.t($data.orderData.orderstatus == 2 ? "订单已退款" : $data.orderData.delivery_status == 0 ? "商家已接单" : $data.orderData.delivery_status == 1 ? "订单配送中" : "订单已完成"),
    f: common_vendor.p({
      src: common_assets._imports_0,
      width: "100",
      height: "100",
      ["border-radius"]: "18rpx"
    })
  }, {
    g: common_vendor.f($data.orderData.commodity_list, (item, index, i0) => {
      return common_vendor.e({
        a: "3fa875e6-1-" + i0,
        b: common_vendor.p({
          src: item.image,
          width: "180",
          height: "140",
          ["border-radius"]: "8"
        }),
        c: common_vendor.t(item.name),
        d: item.materials_text
      }, item.materials_text ? {
        e: common_vendor.t(item.materials_text)
      } : {}, {
        f: common_vendor.t(item.price),
        g: common_vendor.t(item.number),
        h: index
      });
    }),
    h: common_vendor.t($data.orderData.shop_num),
    i: common_vendor.t($data.orderData.price),
    j: $data.type == "takeout"
  }, $data.type == "takeout" ? {
    k: common_vendor.t($data.orderData.name),
    l: common_vendor.t($data.orderData.phone),
    m: common_vendor.t($data.orderData.address),
    n: common_vendor.t($data.orderData.house_number)
  } : {}, {
    o: common_vendor.t($data.orderData.remark ? $data.orderData.remark : "无"),
    p: common_vendor.t($data.orderData.out_trade_no),
    q: common_vendor.t($data.orderData.transaction_id),
    r: common_vendor.t($data.orderData.payment_time_text),
    s: common_vendor.o((...args) => _ctx.moreOrder && _ctx.moreOrder(...args), "14"),
    t: common_vendor.p({
      height: "130"
    })
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3fa875e6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageOrder/order/order-detail.js.map
