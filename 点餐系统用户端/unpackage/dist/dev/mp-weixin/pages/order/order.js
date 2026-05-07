"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_u_tabs2 = common_vendor.resolveComponent("u-tabs");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  (_easycom_u_tabs2 + _easycom_u_image2)();
}
const _easycom_u_tabs = () => "../../uni_modules/vk-uview-ui/components/u-tabs/u-tabs.js";
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
if (!Math) {
  (_easycom_u_tabs + _easycom_u_image)();
}
const _sfc_main = {
  __name: "order",
  setup(__props) {
    const tabsList = common_vendor.ref([
      {
        name: "自取订单"
      },
      {
        name: "外卖订单"
      },
      {
        name: "劵码订单"
      }
    ]);
    const pickupList = common_vendor.ref([{
      "status": "0",
      "commodity_list": [{
        "name": "招牌酱肉包",
        "price": 5.99,
        "number": 1,
        "image": "/static/img/menu/menu-1.jpg",
        "is_single": false,
        "materials_text": ""
      }],
      "shop_num": 1,
      "price": 5.99
    }, {
      "status": "1",
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
      "price": 9.98
    }, {
      "status": "2",
      "commodity_list": [{
        "id": 13,
        "name": "酸菜油滋啦包",
        "price": 4.59,
        "number": 1,
        "image": "/static/img/menu/menu-3.jpg",
        "is_single": false,
        "materials_text": ""
      }, {
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
      "shop_num": 3,
      "price": 14.57
    }]);
    const takeoutList = common_vendor.ref([{
      "commodity_list": [{
        "name": "招牌酱肉包",
        "price": 5.99,
        "number": 1,
        "image": "/static/img/menu/menu-1.jpg",
        "is_single": false,
        "materials_text": ""
      }],
      "shop_num": 1,
      "price": 5.99,
      "orderstatus": 0,
      "delivery_status": 0
    }, {
      "commodity_list": [{
        "name": "火腿包",
        "price": 3.99,
        "number": 1,
        "image": "/static/img/menu/menu-2.jpg",
        "is_single": false,
        "materials_text": ""
      }],
      "shop_num": 1,
      "price": 3.99,
      "orderstatus": 0,
      "delivery_status": 1
    }, {
      "commodity_list": [{
        "name": "酸菜油滋啦包",
        "price": 4.59,
        "number": 1,
        "image": "/static/img/menu/menu-3.jpg",
        "is_single": false,
        "materials_text": ""
      }],
      "shop_num": 1,
      "price": 4.59,
      "orderstatus": 0,
      "delivery_status": 2
    }, {
      "commodity_list": [{
        "name": "透汁鲜肉+透汁牛肉+小米粥+小菜",
        "price": 16.66,
        "number": 1,
        "image": "/static/img/menu/menu-4.jpg",
        "is_single": false,
        "materials_text": ""
      }],
      "shop_num": 1,
      "price": 16.66,
      "orderstatus": 2,
      "delivery_status": 0
    }]);
    const couponList = common_vendor.ref([{
      "image": "/static/img/order/egg-img.jpg",
      "name": "精品富硒鸡蛋",
      "price": 0,
      "shop_num": 1,
      "status": "0"
    }, {
      "image": "/static/img/order/egg-img.jpg",
      "name": "精品富硒鸡蛋",
      "price": 0,
      "shop_num": 1,
      "status": "1"
    }]);
    const current = common_vendor.ref(0);
    const change = (index) => {
      current.value = index;
    };
    const orderDetail = (param) => {
      const type = current.value == 0 ? "takein" : "takeout";
      common_vendor.index.navigateTo({
        url: `/subpackageOrder/order/order-detail?type=${type}`
      });
    };
    const checkCoupon = (param) => {
      common_vendor.index.navigateTo({
        url: `/subpackageOrder/order/coupon-detail?id=${param.id}`
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(change, "62"),
        b: common_vendor.o(($event) => current.value = $event, "ab"),
        c: common_vendor.p({
          list: tabsList.value,
          ["is-scroll"]: false,
          ["active-color"]: "#0A3D28",
          ["bar-width"]: "100",
          duration: "0",
          ["inactive-color"]: "#9A9A9A",
          modelValue: current.value
        }),
        d: current.value === 0
      }, current.value === 0 ? {
        e: common_vendor.f(pickupList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.status == "0" ? "待付款" : item.status == "1" ? "已付款" : "已退款"),
            b: common_vendor.f(item.commodity_list, (itemt, indext, i1) => {
              return common_vendor.e({
                a: "93207a4f-1-" + i0 + "-" + i1,
                b: common_vendor.p({
                  src: itemt.image,
                  width: "180",
                  height: "140",
                  ["border-radius"]: "8"
                }),
                c: common_vendor.t(itemt.name),
                d: itemt.materials_text
              }, itemt.materials_text ? {
                e: common_vendor.t(itemt.materials_text)
              } : {}, {
                f: common_vendor.t(itemt.price),
                g: common_vendor.t(itemt.number),
                h: indext
              });
            }),
            c: common_vendor.t(item.shop_num),
            d: common_vendor.t(item.price),
            e: item.id,
            f: common_vendor.o(($event) => orderDetail(), item.id)
          };
        })
      } : current.value === 1 ? {
        g: common_vendor.f(takeoutList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.orderstatus == 2 ? "已退款" : item.delivery_status == 0 ? "商家已接单" : item.delivery_status == 1 ? "配送中" : "已完成"),
            b: common_vendor.f(item.commodity_list, (itemt, indext, i1) => {
              return common_vendor.e({
                a: "93207a4f-2-" + i0 + "-" + i1,
                b: common_vendor.p({
                  src: itemt.image,
                  width: "180",
                  height: "140",
                  ["border-radius"]: "8"
                }),
                c: common_vendor.t(itemt.name),
                d: itemt.materials_text
              }, itemt.materials_text ? {
                e: common_vendor.t(itemt.materials_text)
              } : {}, {
                f: common_vendor.t(itemt.price),
                g: common_vendor.t(itemt.number),
                h: indext
              });
            }),
            c: common_vendor.t(item.shop_num),
            d: common_vendor.t(item.price),
            e: item.id,
            f: common_vendor.o(($event) => orderDetail(), item.id)
          };
        })
      } : {
        h: common_vendor.f(couponList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.status == "0" ? "待核销" : "已核销"),
            b: "93207a4f-3-" + i0,
            c: common_vendor.p({
              src: item.image,
              width: "180",
              height: "140"
            }),
            d: common_vendor.t(item.name),
            e: common_vendor.t(item.price),
            f: common_vendor.t(item.price),
            g: item.status == "0"
          }, item.status == "0" ? {
            h: common_vendor.o(($event) => checkCoupon(item), item.id)
          } : {}, {
            i: item.id
          });
        })
      }, {
        f: current.value === 1
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93207a4f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
