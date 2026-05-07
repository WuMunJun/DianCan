"use strict";
const common_vendor = require("../../common/vendor.js");
const common_util = require("../../common/util.js");
const Actions = () => "../../components/actions/actions.js";
const CartBar = () => "../../components/cartbar/cartbar.js";
const ProductModal = () => "../../components/product-modal/product-modal.js";
const cartPopup = () => "../../components/cart-popup/cart-popup.js";
const Search = () => "../../components/search/search.js";
const _sfc_main = {
  components: {
    Actions,
    CartBar,
    ProductModal,
    cartPopup,
    Search
  },
  data() {
    return {
      util: common_util.util,
      categories: [],
      cart: [],
      product: {},
      currentCategoryId: 0,
      ads1: [
        "/static/img/home/ads.jpg"
      ],
      productModalVisible: false,
      cartPopupShow: false,
      productsScrollTop: 0,
      showSearch: false
    };
  },
  computed: {
    ...common_vendor.mapState(["orderType"]),
    productCartNum() {
      return (id) => this.cart.reduce((acc, cur) => {
        if (cur.id === id) {
          return acc += cur.number;
        }
        return acc;
      }, 0);
    },
    // 根据订单类型过滤分类和商品
    filterCategories() {
      return this.categories.map((category) => {
        const filterProducts = category.products.filter((product) => {
          if (this.orderType === "takein") {
            return product.is_pickup === 1;
          } else {
            return product.is_takeout === 1;
          }
        });
        return {
          ...category,
          products: filterProducts
        };
      }).filter((category) => {
        return category.products.length > 0;
      });
    }
  },
  watch: {
    filterCategories: {
      handler(newVal) {
        if (newVal.length > 0) {
          const exists = newVal.some((cat) => cat.id === this.currentCategoryId);
          if (!exists) {
            this.currentCategoryId = newVal[0].id;
            this.$nextTick(async () => {
              await this.calcSize();
              const targetCategory = this.categories.find((item) => item.id === this.currentCategoryId);
              if (targetCategory && targetCategory.top !== void 0) {
                this.productsScrollTop = targetCategory.top;
              }
            });
          }
        }
      },
      immediate: true,
      // 立即执行，确保页面加载时就触发
      deep: true
    }
  },
  async onLoad() {
    const res = await this.$api("menu");
    this.categories = res;
    await this.$nextTick(async () => await this.calcSize());
    this.currentCategoryId = this.filterCategories.length && this.filterCategories[0].id;
  },
  methods: {
    ...common_vendor.mapMutations(["SET_ORDER_TYPE"]),
    switchOrderType() {
      if (this.cart.length != 0) {
        common_vendor.index.showModal({
          title: "温馨提示",
          content: "切换购买方式后，购物车中的商品将被清空，是否确认继续操作？",
          success: (res) => {
            if (res.confirm) {
              this.cart = [];
              if (this.cart.length == 0) {
                this.switchOrderChange();
                return;
              }
              this.$u.toast("切换失败");
            }
          }
        });
        return;
      }
      this.switchOrderChange();
    },
    switchOrderChange() {
      if (this.orderType === "takein") {
        this.SET_ORDER_TYPE("takeout");
      } else {
        this.SET_ORDER_TYPE("takein");
      }
      this.$nextTick(async () => await this.calcSize());
    },
    handleAddToCart(product) {
      const index = this.cart.findIndex((item) => {
        if (!product.is_single) {
          return item.id == product.id && item.materials_text == product.materials_text;
        } else {
          return item.id === product.id;
        }
      });
      if (index > -1) {
        this.cart[index].number += product.number || 1;
        return;
      }
      this.cart.push({
        id: product.id,
        cate_id: product.category_id,
        name: product.name,
        price: product.price,
        number: product.number || 1,
        image: product.images[0].url,
        is_single: product.is_single,
        materials_text: product.materials_text || ""
      });
    },
    handleMinusFromCart(product) {
      let index;
      if (product.is_single) {
        index = this.cart.findIndex((item) => item.id == product.id);
      } else {
        index = this.cart.findIndex((item) => item.id == product.id && item.materials_text == product.materials_text);
      }
      this.cart[index].number -= 1;
      if (this.cart[index].number <= 0) {
        this.cart.splice(index, 1);
      }
    },
    showProductDetailModal(product) {
      product.materials = product.materials || [];
      if (product.materials && product.materials.length > 0) {
        product.materials.forEach((group) => {
          if (group.values && group.values.length > 0) {
            group.values.forEach((val, idx) => {
              if (idx === 0) {
                val.is_selected = 1;
              } else {
                val.is_selected = 0;
              }
              if (val.is_exclusive === void 0) {
                val.is_exclusive = 0;
              }
            });
          }
        });
      }
      this.product = product;
      this.productModalVisible = true;
    },
    handleAddToCartInModal(product) {
      product.price;
      this.handleAddToCart(product);
      this.closeProductDetailModal();
    },
    closeProductDetailModal() {
      this.productModalVisible = false;
      this.product = {};
    },
    openCartDetailsPopup() {
      this.$refs["cartPopup"].open();
    },
    clearCart() {
      this.cart = [];
    },
    handleMenuSelected(id) {
      this.$nextTick(() => {
        const targetCategory = this.categories.find((item) => item.id === id);
        if (targetCategory && targetCategory.top !== void 0) {
          this.productsScrollTop = targetCategory.top;
        }
        this.currentCategoryId = id;
      });
    },
    productsScroll({
      detail
    }) {
      const {
        scrollTop
      } = detail;
      let tabs = this.categories.filter((item) => item.top <= scrollTop).reverse();
      if (tabs.length > 0) {
        this.currentCategoryId = tabs[0].id;
      }
    },
    async calcSize() {
      let h = 0;
      const adsData = await new Promise((resolve) => {
        common_vendor.index.createSelectorQuery().select("#ads").fields({
          size: true
        }, (data) => resolve(data)).exec();
      });
      if (adsData) {
        h += Math.floor(adsData.height);
      }
      for (const filterItem of this.filterCategories) {
        const originalItem = this.categories.find((item) => item.id === filterItem.id);
        if (!originalItem)
          continue;
        const productData = await new Promise((resolve) => {
          common_vendor.index.createSelectorQuery().select(`#products-${filterItem.id}`).fields({
            size: true
          }, (data) => resolve(data)).exec();
        });
        if (productData) {
          originalItem.top = h;
          h += Math.floor(productData.height);
          originalItem.bottom = h;
        }
      }
    },
    pay() {
      common_vendor.index.setStorageSync("cart", this.cart);
      common_vendor.index.navigateTo({
        url: "/subpackageHome/setTlement/pay"
      });
    }
  }
};
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_actions2 = common_vendor.resolveComponent("actions");
  const _easycom_product_modal2 = common_vendor.resolveComponent("product-modal");
  const _component_cart_bar = common_vendor.resolveComponent("cart-bar");
  const _easycom_search2 = common_vendor.resolveComponent("search");
  (_easycom_u_search2 + _easycom_u_navbar2 + _easycom_actions2 + _easycom_product_modal2 + _component_cart_bar + _easycom_search2)();
}
const _easycom_u_search = () => "../../uni_modules/vk-uview-ui/components/u-search/u-search.js";
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
const _easycom_actions = () => "../../components/actions/actions.js";
const _easycom_product_modal = () => "../../components/product-modal/product-modal.js";
const _easycom_search = () => "../../components/search/search.js";
if (!Math) {
  (_easycom_u_search + _easycom_u_navbar + _easycom_actions + _easycom_product_modal + _easycom_search)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.showSearch = true, "df"),
    b: common_vendor.p({
      placeholder: "搜索",
      disabled: true,
      ["show-action"]: false
    }),
    c: common_vendor.p({
      ["border-bottom"]: false
    }),
    d: _ctx.orderType == "takein" ? 1 : "",
    e: common_vendor.o((...args) => $options.switchOrderType && $options.switchOrderType(...args), "1b"),
    f: _ctx.orderType == "takeout" ? 1 : "",
    g: common_vendor.o((...args) => $options.switchOrderType && $options.switchOrderType(...args), "a3"),
    h: common_vendor.f($options.filterCategories, (category, index, i0) => {
      return common_vendor.e({
        a: category.category_image_url
      }, category.category_image_url ? {
        b: category.category_image_url
      } : {}, {
        c: common_vendor.t(category.name),
        d: common_vendor.o(($event) => $options.handleMenuSelected(category.id), index),
        e: $data.currentCategoryId == category.id ? 1 : "",
        f: index
      });
    }),
    i: common_vendor.f($data.ads1, (ad, index, i0) => {
      return {
        a: ad,
        b: index
      };
    }),
    j: common_vendor.f($options.filterCategories, (category, index, i0) => {
      return {
        a: common_vendor.t(category.name),
        b: common_vendor.f(category.products, (product, key, i1) => {
          return common_vendor.e({
            a: product.images[0].url,
            b: common_vendor.t(product.name),
            c: common_vendor.t(product.sold),
            d: product.labels.length > 0
          }, product.labels.length > 0 ? {
            e: common_vendor.f(product.labels, (label, k2, i2) => {
              return {
                a: common_vendor.t(label.name),
                b: label.label_color,
                c: $data.util.hexToRgba(label.label_color, 0.2),
                d: label.id
              };
            })
          } : {}, {
            f: common_vendor.t(product.price),
            g: common_vendor.o(($event) => $options.showProductDetailModal(product), key),
            h: common_vendor.o(($event) => $options.handleAddToCart(product), key),
            i: common_vendor.o(($event) => $options.handleMinusFromCart(product), key),
            j: "2193946f-2-" + i0 + "-" + i1,
            k: common_vendor.p({
              ["materials-btn"]: !product.is_single,
              number: $options.productCartNum(product.id)
            }),
            l: key,
            m: common_vendor.o(($event) => $options.showProductDetailModal(product), key)
          });
        }),
        c: index,
        d: `products-${category.id}`
      };
    }),
    k: $data.productsScrollTop,
    l: common_vendor.o((...args) => $options.productsScroll && $options.productsScroll(...args), "e8"),
    m: common_vendor.o($options.closeProductDetailModal, "95"),
    n: common_vendor.o($options.handleAddToCartInModal, "6b"),
    o: common_vendor.p({
      product: $data.product,
      visible: $data.productModalVisible,
      ["order-type"]: _ctx.orderType
    }),
    p: common_vendor.o($options.handleAddToCart, "03"),
    q: common_vendor.o($options.handleMinusFromCart, "36"),
    r: common_vendor.o($options.clearCart, "9f"),
    s: common_vendor.o($options.pay, "7e"),
    t: common_vendor.p({
      cart: $data.cart
    }),
    v: common_vendor.o(($event) => $data.showSearch = false, "44"),
    w: common_vendor.o($options.showProductDetailModal, "76"),
    x: common_vendor.p({
      show: $data.showSearch,
      categories: $options.filterCategories
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/subpackageHome/pointSingle/point-single.js.map
