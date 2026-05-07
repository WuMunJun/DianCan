"use strict";
const common_vendor = require("../../common/vendor.js");
const uniTransition = () => "../uni-transition/uni-transition.js";
const _sfc_main = {
  name: "Search",
  components: {
    uniTransition
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tranStyles: {
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "#fff",
        zIndex: 998
      },
      keyword: "",
      result: [],
      oldKeywordList: [],
      hotKeywordList: [],
      // keywordList: [],
      forbid: true,
      isShowKeywordList: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.loadOldKeyword();
      this.loadHotKeyword();
    },
    blur() {
      common_vendor.index.hideKeyboard();
    },
    loadOldKeyword() {
      common_vendor.index.getStorage({
        key: "OldKeys",
        success: (res) => {
          try {
            const OldKeys = JSON.parse(res.data);
            this.oldKeywordList = Array.isArray(OldKeys) ? OldKeys : [];
          } catch (e) {
            this.oldKeywordList = [];
          }
        },
        fail: () => {
          this.oldKeywordList = [];
        }
      });
    },
    loadHotKeyword() {
      this.hotKeywordList = ["招牌酱肉包", "火腿包", "招牌胡辣汤", "古法八宝粥", "茶叶蛋", "灵魂肉肠"];
    },
    drawCorrelativeKeyword(keywords, keyword) {
      const len = keywords.length;
      const keywordArr = [];
      for (let i = 0; i < len; i++) {
        const row = keywords[i];
        const html = row[0].replace(keyword, "<span style='color: #9f9f9f;'>" + keyword + "</span>");
        const htmlStr = "<div>" + html + "</div>";
        keywordArr.push({
          keyword: row[0],
          htmlStr
        });
      }
      return keywordArr;
    },
    setKeyword(index) {
      if (this.keywordList[index]) {
        this.keyword = this.keywordList[index].keyword;
      }
    },
    oldDelete() {
      common_vendor.index.showModal({
        content: "确定清除历史搜索记录？",
        success: (res) => {
          if (res.confirm) {
            this.oldKeywordList = [];
            common_vendor.index.removeStorage({
              key: "OldKeys"
            });
          }
        }
      });
    },
    hotToggle() {
      this.forbid = !this.forbid;
    },
    saveKeyword(keyword) {
      if (!keyword.trim())
        return;
      common_vendor.index.getStorage({
        key: "OldKeys",
        success: (res) => {
          let OldKeys = [];
          try {
            OldKeys = JSON.parse(res.data) || [];
          } catch (e) {
            OldKeys = [];
          }
          const findIndex = OldKeys.indexOf(keyword);
          if (findIndex === -1) {
            OldKeys.unshift(keyword);
          } else {
            OldKeys.splice(findIndex, 1);
            OldKeys.unshift(keyword);
          }
          OldKeys.length > 10 && OldKeys.pop();
          common_vendor.index.setStorage({
            key: "OldKeys",
            data: JSON.stringify(OldKeys)
          });
          this.oldKeywordList = OldKeys;
        },
        fail: () => {
          const OldKeys = [keyword];
          common_vendor.index.setStorage({
            key: "OldKeys",
            data: JSON.stringify(OldKeys)
          });
          this.oldKeywordList = OldKeys;
        }
      });
    },
    hide() {
      this.keyword = "";
      this.result = [];
      this.$emit("hide");
    },
    handleChoose(item, isSearch = false) {
      if (isSearch) {
        this.hide();
        this.$emit("choose", item);
        return;
      }
      this.categories.forEach((category) => {
        var _a;
        const find = (_a = category.products) == null ? void 0 : _a.find((product) => product.id == item.productId);
        if (find) {
          this.hide();
          this.$emit("choose", find);
          return;
        }
      });
    },
    handleKeywordInput(e) {
      if (!e) {
        this.result = [];
        return;
      }
      let Result = [];
      this.categories.forEach((category) => {
        category.products.forEach((product) => {
          if (product.name.indexOf(e) > -1) {
            Result.push(product);
          }
        });
      });
      this.result = Result;
      this.saveKeyword(e);
    },
    doSearch(searchKeyword) {
      this.keyword = searchKeyword;
      this.handleKeywordInput(searchKeyword);
    }
  }
};
if (!Array) {
  const _easycom_u_search2 = common_vendor.resolveComponent("u-search");
  const _easycom_u_navbar2 = common_vendor.resolveComponent("u-navbar");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  (_easycom_u_search2 + _easycom_u_navbar2 + _easycom_u_icon2 + _component_template + _easycom_uni_transition2)();
}
const _easycom_u_search = () => "../../uni_modules/vk-uview-ui/components/u-search/u-search.js";
const _easycom_u_navbar = () => "../../uni_modules/vk-uview-ui/components/u-navbar/u-navbar.js";
const _easycom_u_icon = () => "../../uni_modules/vk-uview-ui/components/u-icon/u-icon.js";
const _easycom_uni_transition = () => "../uni-transition/uni-transition.js";
if (!Math) {
  (_easycom_u_search + _easycom_u_navbar + _easycom_u_icon + _easycom_uni_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.handleKeywordInput, "75"),
    b: common_vendor.o($options.hide, "54"),
    c: common_vendor.o(($event) => $data.keyword = $event, "e9"),
    d: common_vendor.p({
      placeholder: "请输入商品名",
      ["action-text"]: "取消",
      modelValue: $data.keyword
    }),
    e: common_vendor.p({
      ["is-back"]: false,
      ["border-bottom"]: false
    }),
    f: common_vendor.o($options.oldDelete, "3a"),
    g: common_vendor.p({
      name: "trash",
      color: "#909399",
      size: "28"
    }),
    h: common_vendor.f($data.oldKeywordList, (keyword, index, i0) => {
      return {
        a: common_vendor.t(keyword),
        b: common_vendor.o(($event) => $options.doSearch(keyword), index),
        c: index
      };
    }),
    i: $data.oldKeywordList.length > 0,
    j: common_vendor.o($options.hotToggle, "1c"),
    k: common_vendor.p({
      name: $data.forbid ? "eye-fill" : "eye-off",
      color: "#909399",
      size: "28"
    }),
    l: $data.forbid
  }, $data.forbid ? common_vendor.e({
    m: common_vendor.f($data.hotKeywordList, (keyword, index, i0) => {
      return {
        a: common_vendor.t(keyword),
        b: common_vendor.o(($event) => $options.doSearch(keyword), index),
        c: index
      };
    }),
    n: $data.hotKeywordList.length === 0
  }, $data.hotKeywordList.length === 0 ? {} : {}) : {}, {
    o: !$data.isShowKeywordList,
    p: $data.result.length
  }, $data.result.length ? {
    q: common_vendor.f($data.result, (item, index, i0) => {
      return {
        a: item.images[0].url,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.price),
        d: index,
        e: common_vendor.o(($event) => $options.handleChoose(item, true), index)
      };
    })
  } : {}, {
    r: common_vendor.p({
      ["mode-class"]: ["slide-left"],
      styles: $data.tranStyles,
      show: $props.show
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2df110ac"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/search/search.js.map
