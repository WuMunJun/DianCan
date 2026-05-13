"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userinfo: {},
      swiperList: [{
        image: "/static/img/home/banner.jpg"
      }],
      showZhuohaoPopup: false,
      currentZhuohao: "",
      selectedPeople: 1
    };
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/home/home.vue:96", "首页加载，options:", options);
    this.handleQrcode(options);
  },
  onShow() {
    this.checkQrcodeFromStorage();
  },
  methods: {
    handleQrcode(options) {
      if (options.scene) {
        common_vendor.index.__f__("log", "at pages/home/home.vue:107", "从options.scene:", options.scene);
        this.processScene(options.scene);
        return;
      }
      if (options.q) {
        common_vendor.index.__f__("log", "at pages/home/home.vue:114", "从options.q:", options.q);
        const scene = this.decodeQueryString(options.q);
        if (scene) {
          this.processScene(scene);
        }
        return;
      }
      this.checkQrcodeFromStorage();
    },
    checkQrcodeFromStorage() {
      const savedScene = common_vendor.index.getStorageSync("qrcode_scene");
      if (savedScene) {
        common_vendor.index.__f__("log", "at pages/home/home.vue:128", "从缓存读取scene:", savedScene);
        this.processScene(savedScene);
        common_vendor.index.removeStorageSync("qrcode_scene");
      }
    },
    decodeQueryString(q) {
      try {
        let result = {};
        const queryString = decodeURIComponent(q);
        const index = queryString.indexOf("?");
        if (index !== -1) {
          return queryString.slice(index + 1);
        }
        return queryString;
      } catch (e) {
        return q;
      }
    },
    processScene(scene) {
      if (!scene)
        return;
      const params = this.parseScene(scene);
      common_vendor.index.__f__("log", "at pages/home/home.vue:149", "解析scene参数:", params);
      if (params.zhuohao) {
        this.currentZhuohao = params.zhuohao;
        this.showZhuohaoPopup = true;
      }
    },
    parseScene(scene) {
      const params = {};
      try {
        let sceneStr = decodeURIComponent(scene);
        if (sceneStr.indexOf("=") !== -1) {
          const pairs = sceneStr.split("&");
          pairs.forEach((pair) => {
            const [key, value] = pair.split("=");
            if (key && value) {
              params[key.trim()] = value.trim();
            }
          });
        } else {
          params.zhuohao = sceneStr;
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/home/home.vue:173", "解析scene失败:", e);
      }
      return params;
    },
    confirmZhuohao() {
      this.$store.commit("SET_ZHUOHAO", this.currentZhuohao);
      this.$store.commit("SET_PEOPLE_COUNT", this.selectedPeople);
      this.showZhuohaoPopup = false;
      this.$store.commit("SET_ORDER_TYPE", "takein");
      common_vendor.index.navigateTo({
        url: `/subpackageHome/pointSingle/point-single`
      });
    },
    handleLogin() {
      common_vendor.index.navigateTo({
        url: `/pages/login/login`
      });
    },
    handlePointSingle(type) {
      this.$store.commit("SET_ORDER_TYPE", type);
      common_vendor.index.navigateTo({
        url: `/subpackageHome/pointSingle/point-single`
      });
    },
    handleMyPromotion() {
      common_vendor.index.navigateTo({
        url: `/subpackageHome/pointsMall/points-mall`
      });
    }
  }
};
if (!Array) {
  const _easycom_u_swiper2 = common_vendor.resolveComponent("u-swiper");
  const _easycom_u_image2 = common_vendor.resolveComponent("u-image");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _easycom_u_popup2 = common_vendor.resolveComponent("u-popup");
  (_easycom_u_swiper2 + _easycom_u_image2 + _easycom_u_icon2 + _easycom_u_popup2)();
}
const _easycom_u_swiper = () => "../../uni_modules/vk-uview-ui/components/u-swiper/u-swiper.js";
const _easycom_u_image = () => "../../uni_modules/vk-uview-ui/components/u-image/u-image.js";
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_u_popup = () => "../../uni_modules/vk-uview-ui/components/u-popup/u-popup.js";
if (!Math) {
  (_easycom_u_swiper + _easycom_u_image + _easycom_u_icon + _easycom_u_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.swiperList.length
  }, $data.swiperList.length ? {
    b: common_vendor.p({
      list: $data.swiperList,
      height: "600",
      ["border-radius"]: "0",
      mode: "none"
    })
  } : {}, {
    c: common_vendor.p({
      src: common_assets._imports_0,
      width: "60",
      height: "60",
      ["border-radius"]: "50%",
      ["lazy-load"]: true
    }),
    d: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args), "0b"),
    e: common_vendor.p({
      src: common_assets._imports_1,
      width: "180",
      height: "180",
      ["lazy-load"]: true
    }),
    f: common_vendor.o(($event) => $options.handlePointSingle("takein"), "56"),
    g: common_vendor.p({
      src: common_assets._imports_2,
      width: "180",
      height: "180",
      ["lazy-load"]: true
    }),
    h: common_vendor.o(($event) => $options.handlePointSingle("takeout"), "7e"),
    i: common_vendor.p({
      src: common_assets._imports_3,
      width: "180",
      height: "180",
      ["lazy-load"]: true
    }),
    j: common_vendor.p({
      name: "arrow-right",
      size: "24"
    }),
    k: common_vendor.o((...args) => $options.handleMyPromotion && $options.handleMyPromotion(...args), "ea"),
    l: common_vendor.t($data.currentZhuohao),
    m: common_vendor.f(10, (n, k0, i0) => {
      return {
        a: common_vendor.t(n),
        b: n,
        c: $data.selectedPeople === n ? 1 : "",
        d: common_vendor.o(($event) => $data.selectedPeople = n, n)
      };
    }),
    n: common_vendor.o((...args) => $options.confirmZhuohao && $options.confirmZhuohao(...args), "d4"),
    o: common_vendor.o(($event) => $data.showZhuohaoPopup = $event, "87"),
    p: common_vendor.p({
      mode: "center",
      ["border-radius"]: "20",
      modelValue: $data.showZhuohaoPopup
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
