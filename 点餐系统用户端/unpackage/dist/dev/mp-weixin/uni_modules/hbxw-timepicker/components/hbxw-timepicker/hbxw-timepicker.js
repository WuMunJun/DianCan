"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "请选择配送时间"
    },
    subTitle: {
      type: String,
      default: "请选择期望的配送时间"
    },
    // 是否显示1小时内
    isFast: {
      type: Boolean,
      default: true
    },
    // 日期别名，用于一些特殊场景，如需要显示今天明天后天...
    anotherNames: {
      type: Array,
      default() {
        return ["今天", "明天", "后天"];
      }
    },
    dayRange: {
      type: Number,
      default: 3
    },
    minHour: {
      type: Number,
      default: 9
    },
    maxHour: {
      type: Number,
      default: 19
    },
    isBtn: {
      type: Boolean,
      default: true
    },
    isAni: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 9999
    },
    maskOpacity: {
      type: Number,
      default: 0.76
    },
    noDateTips: {
      type: String,
      default: "今日配送时间已过"
    },
    isTwo: {
      type: Boolean,
      default: true
    },
    isAutoClose: {
      type: Boolean,
      default: false
    },
    emitEventName: {
      type: String,
      default: "timepicker"
    },
    closeImgSrc: {
      type: String,
      default: common_assets.guanbi
    },
    selectImgSrc: {
      type: String,
      default: common_assets.gougou
    }
  },
  model: {
    prop: "isShow",
    event: "update"
  },
  watch: {
    isShow: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.init();
        }
      },
      immediate: true
    }
  },
  mounted() {
    common_vendor.index.$on(this.emitEventName, (type) => {
      this[type] && this[type]();
    });
  },
  unmounted() {
    common_vendor.index.$off(this.emitEventName);
  },
  data() {
    return {
      days: [],
      dayActiveIndex: 0,
      hourActiveIndex: 0
    };
  },
  computed: {
    // 可选时间列表
    hours() {
      let nowDate = /* @__PURE__ */ new Date();
      let hoursResult = [];
      let firstHour = this.minHour;
      if (this.dayActiveIndex === 0) {
        firstHour = nowDate.getHours() > firstHour ? nowDate.getHours() : firstHour;
        if (firstHour >= this.maxHour) {
          return [];
        }
        if (this.isFast) {
          hoursResult.push({
            start: firstHour,
            end: firstHour,
            hoursStr: "1小时内"
          });
          firstHour = firstHour + 1;
        }
      }
      for (let i = firstHour; i < this.maxHour; i++) {
        hoursResult.push({
          start: i,
          end: i + 1,
          hoursStr: `${this.isTwo ? ("0" + i).slice(-2) : i}:00~${this.isTwo ? ("0" + (i + 1)).slice(-2) : i + 1}:00`
        });
      }
      return hoursResult;
    },
    // 当前选中结果
    result() {
      if (this.days.length === 0 || this.hours.length === 0) {
        return null;
      }
      const {
        year,
        month,
        day,
        displayText
        // 添加 displayText
      } = this.days[this.dayActiveIndex];
      const {
        start,
        end,
        hoursStr
      } = this.hours[this.hourActiveIndex] || {};
      return {
        year,
        month: this.isTwo ? ("0" + month).slice(-2) : month,
        day: this.isTwo ? ("0" + day).slice(-2) : day,
        hourStart: this.isTwo ? ("0" + start).slice(-2) : start,
        hourEnd: this.isTwo ? ("0" + end).slice(-2) : end,
        hoursStr,
        anotherName: this.anotherNames[this.dayActiveIndex] || "",
        displayText
        // 添加 displayText 字段
      };
    },
    btnStr() {
      var _a;
      let hoursStr = "";
      if (!this.result) {
        return "待选择";
      }
      if (this.result.hourStart === this.result.hourEnd) {
        hoursStr = `${this.result.hourStart}:00(${this.result.hoursStr})`;
      } else {
        hoursStr = this.result.hoursStr;
      }
      const day = this.days[this.dayActiveIndex];
      const displayText = day.displayText;
      const datePart = displayText.split("（")[0];
      const weekPart = ((_a = displayText.split("（")[1]) == null ? void 0 : _a.replace("）", "")) || "";
      return `预约${datePart} ${hoursStr} ${weekPart}`;
    }
  },
  methods: {
    // 获取星期几的中文表示
    getWeekDay(date) {
      const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      return weekDays[date.getDay()];
    },
    // 插件初如化
    init() {
      let today = /* @__PURE__ */ new Date();
      this.days = [];
      for (let i = 0; i < this.dayRange; i++) {
        const dateItem = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        const month = dateItem.getMonth() + 1;
        const day = dateItem.getDate();
        const weekDay = this.getWeekDay(dateItem);
        let displayText = "";
        if (i === 0) {
          displayText = `今天（${weekDay}）`;
        } else if (i === 1) {
          displayText = `明天（${weekDay}）`;
        } else if (i === 2) {
          displayText = `后天（${weekDay}）`;
        } else {
          displayText = `${month}月${day}日（${weekDay}）`;
        }
        this.days.push({
          year: dateItem.getFullYear(),
          month,
          day,
          displayText,
          value: `${month}月${day}日`
        });
      }
    },
    // 切换月份
    toggleDay(index) {
      this.dayActiveIndex = index;
      this.hourActiveIndex = 0;
      this.$nextTick(() => {
        this.$emit("change", {
          result: this.result,
          form: "day"
        });
      });
    },
    // 切换时间
    toggleHour(index) {
      this.hourActiveIndex = index;
      this.$nextTick(() => {
        this.$emit("change", {
          result: this.result,
          form: "hour"
        });
        if (this.isAutoClose) {
          this.$emit("update:isShow", false);
        }
      });
    },
    // 确认按钮
    sure() {
      this.$emit("change", {
        result: this.result,
        form: "sure"
      });
    },
    // 关闭弹窗方法
    close() {
      this.$emit("change", {
        result: this.result,
        form: "close"
      });
      this.$emit("update:isShow", false);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.isShow
  }, $props.isShow ? common_vendor.e({
    b: common_vendor.o((...args) => $options.close && $options.close(...args), "03"),
    c: common_vendor.t($props.title),
    d: common_vendor.t($props.subTitle),
    e: common_vendor.r("title", {
      title: $props.title,
      subTitle: $props.subTitle
    }),
    f: $props.closeImgSrc,
    g: common_vendor.o((...args) => $options.close && $options.close(...args), "4a"),
    h: common_vendor.f($data.days, (day, index, i0) => {
      return {
        a: common_vendor.t(day.displayText),
        b: $data.dayActiveIndex === index ? 1 : "",
        c: index,
        d: common_vendor.o(($event) => $options.toggleDay(index), index)
      };
    }),
    i: $options.hours.length > 0
  }, $options.hours.length > 0 ? {
    j: common_vendor.f($options.hours, (hour, index, i0) => {
      return {
        a: common_vendor.t(hour.hoursStr),
        b: index,
        c: $data.hourActiveIndex === index ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleHour(index), index)
      };
    }),
    k: $props.selectImgSrc
  } : {
    l: common_vendor.t($props.noDateTips)
  }, {
    m: $props.isBtn
  }, $props.isBtn ? common_vendor.e({
    n: $options.btnStr
  }, $options.btnStr ? {
    o: common_vendor.t($options.btnStr),
    p: common_vendor.o((...args) => $options.sure && $options.sure(...args), "a9")
  } : {}, {
    q: common_vendor.r("btn", {
      result: $options.result
    })
  }) : {}, {
    r: $props.isAni ? 1 : "",
    s: $props.isAni ? 1 : "",
    t: $props.zIndex,
    v: $props.maskOpacity
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5480826b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/hbxw-timepicker/components/hbxw-timepicker/hbxw-timepicker.js.map
