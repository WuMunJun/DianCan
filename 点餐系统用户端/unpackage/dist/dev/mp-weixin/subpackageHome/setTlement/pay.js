"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_u_alert_tips2 = common_vendor.resolveComponent("u-alert-tips");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_input2 = common_vendor.resolveComponent("u-input");
  const _easycom_list_cell2 = common_vendor.resolveComponent("list-cell");
  (_easycom_u_alert_tips2 + _easycom_u_icon2 + _easycom_u_image2 + _easycom_u_input2 + _easycom_list_cell2)();
}
const _easycom_u_alert_tips = () => "../../uni_modules/vk-uview-ui/components/u-alert-tips/u-alert-tips.js";
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_input = () => "../../uni_modules/vk-uview-ui/components/u-input/u-input.js";
const _easycom_list_cell = () => "../../components/list-cell/list-cell.js";
if (!Math) {
  (_easycom_u_alert_tips + _easycom_u_icon + TimePicker + _easycom_u_image + _easycom_u_input + _easycom_list_cell)();
}
const TimePicker = () => "../../uni_modules/hbxw-timepicker/components/hbxw-timepicker/hbxw-timepicker.js";
const _sfc_main = {
  __name: "pay",
  setup(__props) {
    const store = common_vendor.useStore();
    const cart = common_vendor.ref([]);
    common_vendor.ref({});
    const deliveryType = common_vendor.ref("immediately");
    const reservationTime = common_vendor.ref("");
    const showReservationPicker = common_vendor.ref(false);
    const addressInfo = common_vendor.computed(() => store.state.addressInfo);
    const orderType = common_vendor.computed(() => store.state.orderType);
    const remark = common_vendor.computed(() => store.state.remark);
    const instance = common_vendor.getCurrentInstance();
    instance.appContext.config.globalProperties;
    common_vendor.computed({
      get: () => store.state.remark,
      set: (value) => store.commit("setRemark", value)
    });
    common_vendor.onUnmounted(() => {
      store.commit("SET_REMARK", "");
    });
    const cartNum = common_vendor.computed(() => {
      return cart.value.reduce((acc, cur) => acc + cur.number, 0);
    });
    const cartAmount = common_vendor.computed(() => {
      const originalTotal = cart.value.reduce((acc, cur) => acc + cur.number * cur.price, 0);
      const fixedTotal = Math.floor(originalTotal * 100) / 100;
      return fixedTotal;
    });
    common_vendor.watchEffect(() => {
      const cartKey = "cart";
      const cartData = (common_vendor.index.getStorageSync(cartKey) || []).map((item) => ({
        ...item,
        is_refund: 0
      }));
      cart.value = cartData;
      common_vendor.index.setStorageSync(cartKey, cartData);
    });
    const selectDeliveryType = (type) => {
      if (type === "immediately") {
        deliveryType.value = "immediately";
        reservationTime.value = "";
      } else {
        showReservationPicker.value = true;
      }
    };
    const pickerChange = (event) => {
      const {
        result,
        form
      } = event;
      if (form === "hour" || form === "sure") {
        if (result) {
          if (result.displayText) {
            reservationTime.value = `${result.displayText} ${result.hoursStr}`;
          } else {
            const date = new Date(result.year, result.month - 1, result.day);
            const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            const weekDay = weekDays[date.getDay()];
            reservationTime.value = `${result.month}月${result.day}日（${weekDay}） ${result.hoursStr}`;
          }
          deliveryType.value = "reservation";
          showReservationPicker.value = false;
        }
      }
      if (form === "close") {
        showReservationPicker.value = false;
      }
    };
    const addRemark = () => {
      common_vendor.index.navigateTo({
        url: `/subpackageHome/setTlement/remark`
      });
    };
    const addressManage = () => {
      common_vendor.index.navigateTo({
        url: `/subpackageMy/myAddress/address-manage?methods=pay`
      });
    };
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.p({
          type: "warning",
          description: "如果觉得还不错的话，麻烦免费插件给个五星好评，您的鼓励是我更新的动力，感谢🙏！"
        }),
        b: common_vendor.p({
          type: "error",
          title: "合作请备注",
          description: "QQ：2234207170，VX：Kaiyuan_Q"
        }),
        c: orderType.value == "takeout"
      }, orderType.value == "takeout" ? common_vendor.e({
        d: (_a = addressInfo.value) == null ? void 0 : _a.address
      }, ((_b = addressInfo.value) == null ? void 0 : _b.address) ? {
        e: common_vendor.t(addressInfo.value.address),
        f: common_vendor.t(addressInfo.value.house_number),
        g: common_vendor.t(addressInfo.value.name),
        h: common_vendor.t(addressInfo.value.phone),
        i: common_vendor.p({
          name: "arrow-right",
          color: "#909399"
        }),
        j: common_vendor.o(addressManage, "95")
      } : {
        k: common_vendor.p({
          name: "plus",
          size: "30"
        }),
        l: common_vendor.o(addressManage, "83")
      }, {
        m: orderType.value == "takeout" && ((_c = addressInfo.value) == null ? void 0 : _c.address)
      }, orderType.value == "takeout" && ((_d = addressInfo.value) == null ? void 0 : _d.address) ? common_vendor.e({
        n: deliveryType.value === "immediately" ? 1 : "",
        o: common_vendor.o(($event) => selectDeliveryType("immediately"), "d9"),
        p: reservationTime.value
      }, reservationTime.value ? {
        q: common_vendor.t(reservationTime.value)
      } : {}, {
        r: common_vendor.p({
          name: "arrow-right",
          color: deliveryType.value === "reservation" ? "#FFFFFF" : "#909399"
        }),
        s: deliveryType.value === "reservation" ? 1 : "",
        t: common_vendor.o(($event) => selectDeliveryType("reservation"), "18")
      }) : {}) : {}, {
        v: showReservationPicker.value
      }, showReservationPicker.value ? {
        w: common_vendor.o(pickerChange, "fd"),
        x: common_vendor.o(($event) => showReservationPicker.value = $event, "ea"),
        y: common_vendor.p({
          isBtn: false,
          isFast: false,
          isAutoClose: true,
          title: "选择预计送达时间",
          subTitle: "请选择您方便的送达时间",
          minHour: 6,
          maxHour: 18,
          dayRange: "7",
          isShow: showReservationPicker.value
        })
      } : {}, {
        z: common_vendor.f(cart.value, (item, index, i0) => {
          return {
            a: "a8628b61-6-" + i0,
            b: common_vendor.p({
              src: item.image,
              ["border-radius"]: "18",
              width: "100",
              height: "100"
            }),
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.materials_text),
            e: common_vendor.t(item.number),
            f: common_vendor.t(item.price),
            g: index
          };
        }),
        A: common_vendor.o(addRemark, "48"),
        B: common_vendor.o(($event) => remark.value = $event, "1c"),
        C: common_vendor.p({
          placeholder: "请填写您的要求",
          disabled: true,
          ["input-align"]: "right",
          modelValue: remark.value
        }),
        D: common_vendor.p({
          arrow: true,
          last: true
        }),
        E: common_vendor.t(cartNum.value),
        F: common_vendor.t(cartAmount.value),
        G: common_vendor.p({
          last: true
        }),
        H: common_assets._imports_0$2,
        I: common_vendor.p({
          last: true
        }),
        J: common_vendor.t(cartAmount.value)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a8628b61"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageHome/setTlement/pay.js.map
