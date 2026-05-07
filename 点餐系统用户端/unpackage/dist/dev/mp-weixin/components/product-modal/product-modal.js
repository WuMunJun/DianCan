"use strict";
const common_util = require("../../common/util.js");
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const Modal = () => "../modal/modal.js";
const Actions = () => "../actions/actions.js";
const _sfc_main = {
  name: "ProductModal",
  components: {
    Modal,
    Actions
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => {
      }
    },
    // 接收订单类型
    orderType: {
      type: String,
      default: "takein"
      // 默认自取
    }
  },
  data() {
    return {
      util: common_util.util,
      productData: {}
    };
  },
  watch: {
    product(val) {
      this.productData = JSON.parse(JSON.stringify(val));
      this.$set(this.productData, "number", 1);
    }
  },
  computed: {
    getProductSelectedMaterials() {
      if (!this.productData.is_single && this.productData.materials) {
        let materials = [];
        this.productData.materials.forEach(({
          values
        }) => {
          values.forEach((value) => {
            if (value.is_selected) {
              materials.push(value.name);
            }
          });
        });
        return materials.length ? materials.join("，") : "";
      }
      return "";
    },
    currentPrice() {
      return this.productData.price || "0.00";
    }
  },
  methods: {
    changeMaterialSelected(index, key) {
      const currentMaterial = this.productData.materials[index].values[key];
      if (!currentMaterial.is_exclusive) {
        if (currentMaterial.is_selected)
          return;
        this.productData.materials[index].values.forEach((value) => this.$set(value, "is_selected", 0));
        currentMaterial.is_selected = 1;
        this.productData.number = 1;
      } else {
        currentMaterial.is_selected = !currentMaterial.is_selected;
        this.productData.number = 1;
      }
    },
    add() {
      this.productData.number += 1;
    },
    minus() {
      if (this.productData.number == 1) {
        return;
      }
      this.productData.number -= 1;
    },
    addToCart() {
      const product = {
        ...this.productData,
        "materials_text": this.getProductSelectedMaterials
      };
      this.$emit("add-to-cart", product);
    }
  }
};
if (!Array) {
  const _easycom_actions2 = common_vendor.resolveComponent("actions");
  const _easycom_modal2 = common_vendor.resolveComponent("modal");
  (_easycom_actions2 + _easycom_modal2)();
}
const _easycom_actions = () => "../actions/actions.js";
const _easycom_modal = () => "../modal/modal.js";
if (!Math) {
  (_easycom_actions + _easycom_modal)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$6,
    b: common_vendor.o(($event) => _ctx.$emit("cancel"), "e0"),
    c: common_vendor.f($data.productData.images, (image, index, i0) => {
      return {
        a: image.url,
        b: index
      };
    }),
    d: common_vendor.t($data.productData.name),
    e: common_vendor.f($data.productData.labels, (label, index, i0) => {
      return {
        a: common_vendor.t(label.name),
        b: index,
        c: label.label_color,
        d: $data.util.hexToRgba(label.label_color, 0.2)
      };
    }),
    f: $data.productData.description
  }, $data.productData.description ? {} : {}, {
    g: $data.productData.description
  }, $data.productData.description ? {
    h: common_vendor.t($data.productData.description)
  } : {}, {
    i: common_vendor.f($data.productData.materials, (material, index, i0) => {
      return {
        a: common_vendor.t(material.group_name),
        b: common_vendor.f(material.values, (value, key, i1) => {
          return {
            a: common_vendor.t(value.name),
            b: value.is_selected ? 1 : "",
            c: common_vendor.o(($event) => $options.changeMaterialSelected(index, key), key),
            d: key
          };
        }),
        c: index
      };
    }),
    j: common_vendor.t($options.currentPrice),
    k: common_vendor.t($options.getProductSelectedMaterials),
    l: $options.getProductSelectedMaterials,
    m: common_vendor.o($options.add, "a0"),
    n: common_vendor.o($options.minus, "0f"),
    o: common_vendor.p({
      number: $data.productData.number
    }),
    p: common_vendor.o((...args) => $options.addToCart && $options.addToCart(...args), "0e"),
    q: !$data.productData.is_single ? "250rpx" : "200rpx",
    r: common_vendor.o(($event) => _ctx.$emit("cancel"), "3c"),
    s: common_vendor.p({
      show: $props.visible,
      custom: true,
      padding: "0",
      width: "100%",
      height: "85vh",
      radius: "18rpx"
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-54ed53f8"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/product-modal/product-modal.js.map
