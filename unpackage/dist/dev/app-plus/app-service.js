if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  class AbortablePromise {
    constructor(executor) {
      this._reject = null;
      this.promise = new Promise((resolve, reject) => {
        executor(resolve, reject);
        this._reject = reject;
      });
    }
    // 提供abort方法来中止Promise
    abort(error) {
      if (this._reject) {
        this._reject(error);
      }
    }
    then(onfulfilled, onrejected) {
      return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
      return this.promise.catch(onrejected);
    }
  }
  function addUnit(num) {
    return Number.isNaN(Number(num)) ? `${num}` : `${num}px`;
  }
  function isObj(value) {
    return Object.prototype.toString.call(value) === "[object Object]" || typeof value === "object";
  }
  function getType(target) {
    const typeStr = Object.prototype.toString.call(target);
    const match = typeStr.match(/\[object (\w+)\]/);
    const type = match && match.length ? match[1].toLowerCase() : "";
    return type;
  }
  const defaultDisplayFormat = function(items, kv) {
    const labelKey = (kv == null ? void 0 : kv.labelKey) || "value";
    if (Array.isArray(items)) {
      return items.map((item) => item[labelKey]).join(", ");
    } else {
      return items[labelKey];
    }
  };
  const isDef = (value) => value !== void 0 && value !== null;
  const checkNumRange = (num, label = "value") => {
    if (num < 0) {
      throw new Error(`${label} shouldn't be less than zero`);
    }
  };
  function rgbToHex(r, g, b) {
    const hex = (r << 16 | g << 8 | b).toString(16);
    const paddedHex = "#" + "0".repeat(Math.max(0, 6 - hex.length)) + hex;
    return paddedHex;
  }
  function hexToRgb(hex) {
    const rgb = [];
    for (let i = 1; i < 7; i += 2) {
      rgb.push(parseInt("0x" + hex.slice(i, i + 2), 16));
    }
    return rgb;
  }
  const gradient = (startColor, endColor, step = 2) => {
    const sColor = hexToRgb(startColor);
    const eColor = hexToRgb(endColor);
    const rStep = (eColor[0] - sColor[0]) / step;
    const gStep = (eColor[1] - sColor[1]) / step;
    const bStep = (eColor[2] - sColor[2]) / step;
    const gradientColorArr = [];
    for (let i = 0; i < step; i++) {
      gradientColorArr.push(
        rgbToHex(parseInt(String(rStep * i + sColor[0])), parseInt(String(gStep * i + sColor[1])), parseInt(String(bStep * i + sColor[2])))
      );
    }
    return gradientColorArr;
  };
  const range = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
  };
  const isEqual = (value1, value2) => {
    if (value1 === value2) {
      return true;
    }
    if (!Array.isArray(value1) || !Array.isArray(value2)) {
      return false;
    }
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; ++i) {
      if (value1[i] !== value2[i]) {
        return false;
      }
    }
    return true;
  };
  const padZero = (number, length = 2) => {
    let numStr = number.toString();
    while (numStr.length < length) {
      numStr = "0" + numStr;
    }
    return numStr;
  };
  const context = {
    id: 1e3
  };
  function getRect(selector, all, scope, useFields) {
    return new Promise((resolve, reject) => {
      let query = null;
      if (scope) {
        query = uni.createSelectorQuery().in(scope);
      } else {
        query = uni.createSelectorQuery();
      }
      const method = all ? "selectAll" : "select";
      const callback = (rect) => {
        if (all && isArray(rect) && rect.length > 0) {
          resolve(rect);
        } else if (!all && rect) {
          resolve(rect);
        } else {
          reject(new Error("No nodes found"));
        }
      };
      if (useFields) {
        query[method](selector).fields({ size: true, node: true }, callback).exec();
      } else {
        query[method](selector).boundingClientRect(callback).exec();
      }
    });
  }
  function kebabCase(word) {
    const newWord = word.replace(/[A-Z]/g, function(match) {
      return "-" + match;
    }).toLowerCase();
    return newWord;
  }
  function camelCase(word) {
    return word.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  }
  function isArray(value) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(value);
    }
    return Object.prototype.toString.call(value) === "[object Array]";
  }
  function isFunction(value) {
    return getType(value) === "function" || getType(value) === "asyncfunction";
  }
  function isString(value) {
    return getType(value) === "string";
  }
  function isNumber(value) {
    return getType(value) === "number";
  }
  function isPromise(value) {
    if (isObj(value) && isDef(value)) {
      return isFunction(value.then) && isFunction(value.catch);
    }
    return false;
  }
  function isUndefined$1(value) {
    return typeof value === "undefined";
  }
  function objToStyle(styles) {
    if (isArray(styles)) {
      const result = styles.filter(function(item) {
        return item != null && item !== "";
      }).map(function(item) {
        return objToStyle(item);
      }).join(";");
      return result ? result.endsWith(";") ? result : result + ";" : "";
    }
    if (isString(styles)) {
      return styles ? styles.endsWith(";") ? styles : styles + ";" : "";
    }
    if (isObj(styles)) {
      const result = Object.keys(styles).filter(function(key) {
        return styles[key] != null && styles[key] !== "";
      }).map(function(key) {
        return [kebabCase(key), styles[key]].join(":");
      }).join(";");
      return result ? result.endsWith(";") ? result : result + ";" : "";
    }
    return "";
  }
  const pause = (ms = 1e3 / 30) => {
    return new AbortablePromise((resolve) => {
      const timer2 = setTimeout(() => {
        clearTimeout(timer2);
        resolve(true);
      }, ms);
    });
  };
  function deepClone(obj, cache = /* @__PURE__ */ new Map()) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (isDate(obj)) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj.source, obj.flags);
    }
    if (obj instanceof Error) {
      const errorCopy = new Error(obj.message);
      errorCopy.stack = obj.stack;
      return errorCopy;
    }
    if (cache.has(obj)) {
      return cache.get(obj);
    }
    const copy = Array.isArray(obj) ? [] : {};
    cache.set(obj, copy);
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepClone(obj[key], cache);
      }
    }
    return copy;
  }
  function deepMerge(target, source) {
    target = deepClone(target);
    if (typeof target !== "object" || typeof source !== "object") {
      throw new Error("Both target and source must be objects.");
    }
    for (const prop in source) {
      if (!source.hasOwnProperty(prop))
        continue;
      target[prop] = source[prop];
    }
    return target;
  }
  function deepAssign(target, source) {
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const newObjValue = source[key];
      if (isObj(targetValue) && isObj(newObjValue)) {
        deepAssign(targetValue, newObjValue);
      } else {
        target[key] = newObjValue;
      }
    });
    return target;
  }
  function debounce(func, wait, options = {}) {
    let timeoutId = null;
    let lastArgs;
    let lastThis;
    let result;
    const leading = isDef(options.leading) ? options.leading : false;
    const trailing = isDef(options.trailing) ? options.trailing : true;
    function invokeFunc() {
      if (lastArgs !== void 0) {
        result = func.apply(lastThis, lastArgs);
        lastArgs = void 0;
      }
    }
    function startTimer() {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        if (trailing) {
          invokeFunc();
        }
      }, wait);
    }
    function cancelTimer() {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
    function debounced(...args) {
      lastArgs = args;
      lastThis = this;
      if (timeoutId === null) {
        if (leading) {
          invokeFunc();
        }
        startTimer();
      } else if (trailing) {
        cancelTimer();
        startTimer();
      }
      return result;
    }
    return debounced;
  }
  const getPropByPath = (obj, path) => {
    const keys = path.split(".");
    try {
      return keys.reduce((acc, key) => acc !== void 0 && acc !== null ? acc[key] : void 0, obj);
    } catch (error) {
      return void 0;
    }
  };
  const isDate = (val) => Object.prototype.toString.call(val) === "[object Date]" && !Number.isNaN(val.getTime());
  function isVideoUrl(url) {
    const videoRegex = /\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|video)/i;
    return videoRegex.test(url);
  }
  function isImageUrl(url) {
    const imageRegex = /\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg|image)/i;
    return imageRegex.test(url);
  }
  function omitBy(obj, predicate) {
    const newObj = deepClone(obj);
    Object.keys(newObj).forEach((key) => predicate(newObj[key], key) && delete newObj[key]);
    return newObj;
  }
  const numericProp = [Number, String];
  const makeRequiredProp = (type) => ({
    type,
    required: true
  });
  const makeArrayProp = () => ({
    type: Array,
    default: () => []
  });
  const makeBooleanProp = (defaultVal) => ({
    type: Boolean,
    default: defaultVal
  });
  const makeNumberProp = (defaultVal) => ({
    type: Number,
    default: defaultVal
  });
  const makeNumericProp = (defaultVal) => ({
    type: numericProp,
    default: defaultVal
  });
  const makeStringProp = (defaultVal) => ({
    type: String,
    default: defaultVal
  });
  const baseProps = {
    /**
     * 自定义根节点样式
     */
    customStyle: makeStringProp(""),
    /**
     * 自定义根节点样式类
     */
    customClass: makeStringProp("")
  };
  const iconProps = {
    ...baseProps,
    /**
     * 使用的图标名字，可以使用链接图片
     */
    name: makeRequiredProp(String),
    /**
     * 图标的颜色
     */
    color: String,
    /**
     * 图标的字体大小
     */
    size: numericProp,
    /**
     * 类名前缀，用于使用自定义图标
     */
    classPrefix: makeStringProp("wd-icon")
  };
  const __default__$x = {
    name: "wd-icon",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$M = /* @__PURE__ */ vue.defineComponent({
    ...__default__$x,
    props: iconProps,
    emits: ["click", "touch"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const isImage = vue.computed(() => {
        return isDef(props.name) && props.name.includes("/");
      });
      const rootClass = vue.computed(() => {
        const prefix = props.classPrefix;
        return `${prefix} ${props.customClass} ${isImage.value ? "wd-icon--image" : prefix + "-" + props.name}`;
      });
      const rootStyle = vue.computed(() => {
        const style = {};
        if (props.color) {
          style["color"] = props.color;
        }
        if (props.size) {
          style["font-size"] = addUnit(props.size);
        }
        return `${objToStyle(style)} ${props.customStyle}`;
      });
      function handleClick(event) {
        emit("click", event);
      }
      const __returned__ = { props, emit, isImage, rootClass, rootStyle, handleClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  function _sfc_render$L(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        onClick: $setup.handleClick,
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        $setup.isImage ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "wd-icon__image",
          src: _ctx.name
        }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1$3 = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$L], ["__scopeId", "data-v-24906af6"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-icon/wd-icon.vue"]]);
  function useParent(key) {
    const parent = vue.inject(key, null);
    if (parent) {
      const instance = vue.getCurrentInstance();
      const { link, unlink, internalChildren } = parent;
      link(instance);
      vue.onUnmounted(() => unlink(instance));
      const index = vue.computed(() => internalChildren.indexOf(instance));
      return {
        parent,
        index
      };
    }
    return {
      parent: null,
      index: vue.ref(-1)
    };
  }
  const CELL_GROUP_KEY = Symbol("wd-cell-group");
  const cellGroupProps = {
    ...baseProps,
    /**
     * 分组标题
     */
    title: String,
    /**
     * 分组右侧内容
     */
    value: String,
    /**
     * 分组启用插槽
     */
    useSlot: makeBooleanProp(false),
    /**
     * 是否展示边框线
     */
    border: makeBooleanProp(false)
  };
  function useCell() {
    const { parent: cellGroup, index } = useParent(CELL_GROUP_KEY);
    const border = vue.computed(() => {
      return cellGroup && cellGroup.props.border && index.value;
    });
    return { border };
  }
  const FORM_KEY = Symbol("wd-form");
  const formProps = {
    ...baseProps,
    /**
     * 表单数据对象
     */
    model: makeRequiredProp(Object),
    /**
     * 表单验证规则
     */
    rules: {
      type: Object,
      default: () => ({})
    },
    /**
     * 是否在输入时重置表单校验信息
     */
    resetOnChange: makeBooleanProp(true),
    /**
     * 错误提示类型
     */
    errorType: {
      type: String,
      default: "message"
    }
  };
  const zhCN = {
    calendar: {
      placeholder: "请选择",
      title: "选择日期",
      day: "日",
      week: "周",
      month: "月",
      confirm: "确定",
      startTime: "开始时间",
      endTime: "结束时间",
      to: "至",
      timeFormat: "YY年MM月DD日 HH:mm:ss",
      dateFormat: "YYYY年MM月DD日",
      weekFormat: (year, week) => `${year} 第 ${week} 周`,
      startWeek: "开始周",
      endWeek: "结束周",
      startMonth: "开始月",
      endMonth: "结束月",
      monthFormat: "YYYY年MM月"
    },
    calendarView: {
      startTime: "开始",
      endTime: "结束",
      weeks: {
        sun: "日",
        mon: "一",
        tue: "二",
        wed: "三",
        thu: "四",
        fri: "五",
        sat: "六"
      },
      rangePrompt: (maxRange) => `选择天数不能超过${maxRange}天`,
      rangePromptWeek: (maxRange) => `选择周数不能超过${maxRange}周`,
      rangePromptMonth: (maxRange) => `选择月份不能超过${maxRange}个月`,
      monthTitle: "YYYY年M月",
      yearTitle: "YYYY年",
      month: "M月",
      hour: (value) => `${value}时`,
      minute: (value) => `${value}分`,
      second: (value) => `${value}秒`
    },
    collapse: {
      expand: "展开",
      retract: "收起"
    },
    colPicker: {
      title: "请选择",
      placeholder: "请选择",
      select: "请选择"
    },
    datetimePicker: {
      start: "开始时间",
      end: "结束时间",
      to: "至",
      placeholder: "请选择",
      confirm: "完成",
      cancel: "取消"
    },
    loadmore: {
      loading: "正在努力加载中...",
      finished: "已加载完毕",
      error: "加载失败",
      retry: "点击重试"
    },
    messageBox: {
      inputPlaceholder: "请输入",
      confirm: "确定",
      cancel: "取消",
      inputNoValidate: "输入的数据不合法"
    },
    numberKeyboard: {
      confirm: "完成"
    },
    pagination: {
      prev: "上一页",
      next: "下一页",
      page: (value) => `当前页：${value}`,
      total: (total) => `当前数据：${total}条`,
      size: (size) => `分页大小：${size}`
    },
    picker: {
      cancel: "取消",
      done: "完成",
      placeholder: "请选择"
    },
    imgCropper: {
      confirm: "完成",
      cancel: "取消"
    },
    search: {
      search: "搜索",
      cancel: "取消"
    },
    steps: {
      wait: "未开始",
      finished: "已完成",
      process: "进行中",
      failed: "失败"
    },
    tabs: {
      all: "全部"
    },
    upload: {
      error: "上传失败"
    },
    input: {
      placeholder: "请输入..."
    },
    selectPicker: {
      title: "请选择",
      placeholder: "请选择",
      select: "请选择",
      confirm: "确认",
      filterPlaceholder: "搜索"
    },
    tag: {
      placeholder: "请输入",
      add: "新增标签"
    },
    textarea: {
      placeholder: "请输入..."
    },
    tableCol: {
      indexLabel: "序号"
    },
    signature: {
      confirmText: "确认",
      clearText: "清空",
      revokeText: "撤销",
      restoreText: "恢复"
    }
  };
  const lang = vue.ref("zh-CN");
  const messages = vue.reactive({
    "zh-CN": zhCN
  });
  const Locale = {
    messages() {
      return messages[lang.value];
    },
    use(newLang, newMessage) {
      lang.value = newLang;
      if (newMessage) {
        this.add({ [newLang]: newMessage });
      }
    },
    add(newMessages = {}) {
      deepAssign(messages, newMessages);
    }
  };
  const useTranslate = (name) => {
    const prefix = name ? camelCase(name) + "." : "";
    const translate = (key, ...args) => {
      const currentMessages = Locale.messages();
      const message = getPropByPath(currentMessages, prefix + key);
      return isFunction(message) ? message(...args) : isDef(message) ? message : `${prefix}${key}`;
    };
    return { translate };
  };
  const inputProps = {
    ...baseProps,
    customInputClass: makeStringProp(""),
    customLabelClass: makeStringProp(""),
    // 原生属性
    /**
     * 占位文本
     */
    placeholder: String,
    /**
     * 原生属性，指定 placeholder 的样式，目前仅支持color,font-size和font-weight
     */
    placeholderStyle: String,
    /**
     * 原生属性，指定 placeholder 的样式类
     */
    placeholderClass: makeStringProp(""),
    /**
     * 原生属性，指定光标与键盘的距离。取 input 距离底部的距离和cursor-spacing指定的距离的最小值作为光标与键盘的距离
     */
    cursorSpacing: makeNumberProp(0),
    /**
     * 原生属性，指定focus时的光标位置
     */
    cursor: makeNumberProp(-1),
    /**
     * 原生属性，光标起始位置，自动聚集时有效，需与selection-end搭配使用
     */
    selectionStart: makeNumberProp(-1),
    /**
     * 原生属性，光标结束位置，自动聚集时有效，需与selection-start搭配使用
     */
    selectionEnd: makeNumberProp(-1),
    /**
     * 原生属性，键盘弹起时，是否自动上推页面
     */
    adjustPosition: makeBooleanProp(true),
    /**
     * focus时，点击页面的时候不收起键盘
     */
    holdKeyboard: makeBooleanProp(false),
    /**
     * 设置键盘右下角按钮的文字，仅在type='text'时生效，可选值：done / go / next / search / send
     */
    confirmType: makeStringProp("done"),
    /**
     * 点击键盘右下角按钮时是否保持键盘不收起
     */
    confirmHold: makeBooleanProp(false),
    /**
     * 原生属性，获取焦点
     */
    focus: makeBooleanProp(false),
    /**
     * 类型，可选值：text / number / digit / idcard / safe-password / nickname / tel
     */
    type: makeStringProp("text"),
    /**
     * 原生属性，最大长度
     */
    maxlength: {
      type: Number,
      default: -1
    },
    /**
     * 原生属性，禁用
     */
    disabled: makeBooleanProp(false),
    /**
     * 微信小程序原生属性，强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效)
     */
    alwaysEmbed: makeBooleanProp(false),
    // 原生属性结束
    /**
     * 输入框的值靠右展示
     */
    alignRight: makeBooleanProp(false),
    /**
     * 绑定值
     */
    modelValue: makeNumericProp(""),
    /**
     * 显示为密码框
     */
    showPassword: makeBooleanProp(false),
    /**
     * 显示清空按钮
     */
    clearable: makeBooleanProp(false),
    /**
     * 只读
     */
    readonly: makeBooleanProp(false),
    /**
     * 前置图标，icon组件中的图标类名
     */
    prefixIcon: String,
    /**
     * 后置图标，icon组件中的图标类名
     */
    suffixIcon: String,
    /**
     * 显示字数限制，需要同时设置 maxlength
     */
    showWordLimit: makeBooleanProp(false),
    /**
     * 设置左侧标题
     */
    label: String,
    /**
     * 设置左侧标题宽度
     */
    labelWidth: makeStringProp(""),
    /**
     * 设置输入框大小，可选值：large
     */
    size: String,
    /**
     * 设置输入框错误状态，错误状态时为红色
     */
    error: makeBooleanProp(false),
    /**
     * 当有label属性时，设置标题和输入框垂直居中，默认为顶部居中
     */
    center: makeBooleanProp(false),
    /**
     * 非 cell 类型下是否隐藏下划线
     */
    noBorder: makeBooleanProp(false),
    /**
     * 是否必填
     */
    required: makeBooleanProp(false),
    /**
     * 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的
     */
    prop: String,
    /**
     * 表单验证规则，结合wd-form组件使用
     */
    rules: makeArrayProp(),
    /**
     * 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示
     * 类型: "focus" | "always"
     * 默认值: "always"
     */
    clearTrigger: makeStringProp("always"),
    /**
     * 是否在点击清除按钮时聚焦输入框
     * 类型: boolean
     * 默认值: true
     */
    focusWhenClear: makeBooleanProp(true),
    /**
     * 是否忽略组件内对文本合成系统事件的处理。为 false 时将触发 compositionstart、compositionend、compositionupdate 事件，且在文本合成期间会触发 input 事件
     * 类型: boolean
     * 默认值: true
     */
    ignoreCompositionEvent: makeBooleanProp(true),
    /**
     * 它提供了用户在编辑元素或其内容时可能输入的数据类型的提示。在符合条件的高版本webview里，uni-app的web和app-vue平台中可使用本属性。
     * 类型: InputMode
     * 可选值: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | "password"
     * 默认值: "text"
     */
    inputmode: makeStringProp("text"),
    /**
     * 必填标记位置，可选值：before（标签前）、after（标签后）
     */
    markerSide: makeStringProp("before")
  };
  const __default__$w = {
    name: "wd-input",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$L = /* @__PURE__ */ vue.defineComponent({
    ...__default__$w,
    props: inputProps,
    emits: [
      "update:modelValue",
      "clear",
      "blur",
      "focus",
      "input",
      "keyboardheightchange",
      "confirm",
      "clicksuffixicon",
      "clickprefixicon",
      "click"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const slots = vue.useSlots();
      const { translate } = useTranslate("input");
      const isPwdVisible = vue.ref(false);
      const clearing = vue.ref(false);
      const focused = vue.ref(false);
      const focusing = vue.ref(false);
      const inputValue = vue.ref(getInitValue());
      const cell = useCell();
      vue.watch(
        () => props.focus,
        (newValue) => {
          focused.value = newValue;
        },
        { immediate: true, deep: true }
      );
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          inputValue.value = isDef(newValue) ? String(newValue) : "";
        }
      );
      const { parent: form } = useParent(FORM_KEY);
      const placeholderValue = vue.computed(() => {
        return isDef(props.placeholder) ? props.placeholder : translate("placeholder");
      });
      const showClear = vue.computed(() => {
        const { disabled, readonly, clearable, clearTrigger } = props;
        if (clearable && !readonly && !disabled && inputValue.value && (clearTrigger === "always" || props.clearTrigger === "focus" && focusing.value)) {
          return true;
        } else {
          return false;
        }
      });
      const showWordCount = vue.computed(() => {
        const { disabled, readonly, maxlength, showWordLimit } = props;
        return Boolean(!disabled && !readonly && isDef(maxlength) && maxlength > -1 && showWordLimit);
      });
      const errorMessage = vue.computed(() => {
        if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
          return form.errorMessages[props.prop];
        } else {
          return "";
        }
      });
      const isRequired = vue.computed(() => {
        let formRequired = false;
        if (form && form.props.rules) {
          const rules = form.props.rules;
          for (const key in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key])) {
              formRequired = rules[key].some((rule) => rule.required);
            }
          }
        }
        return props.required || props.rules.some((rule) => rule.required) || formRequired;
      });
      const rootClass = vue.computed(() => {
        return `wd-input  ${props.label || slots.label ? "is-cell" : ""} ${props.center ? "is-center" : ""} ${cell.border.value ? "is-border" : ""} ${props.size ? "is-" + props.size : ""} ${props.error ? "is-error" : ""} ${props.disabled ? "is-disabled" : ""}  ${inputValue.value && String(inputValue.value).length > 0 ? "is-not-empty" : ""}  ${props.noBorder ? "is-no-border" : ""} ${props.customClass}`;
      });
      const labelClass = vue.computed(() => {
        return `wd-input__label ${props.customLabelClass}`;
      });
      const inputPlaceholderClass = vue.computed(() => {
        return `wd-input__placeholder  ${props.placeholderClass}`;
      });
      const labelStyle = vue.computed(() => {
        return props.labelWidth ? objToStyle({
          "min-width": props.labelWidth,
          "max-width": props.labelWidth
        }) : "";
      });
      function getInitValue() {
        const formatted = formatValue(props.modelValue);
        if (!isValueEqual(formatted, props.modelValue)) {
          emit("update:modelValue", formatted);
        }
        return formatted;
      }
      function formatValue(value) {
        const { maxlength } = props;
        if (isDef(maxlength) && maxlength !== -1 && String(value).length > maxlength) {
          return value.toString().slice(0, maxlength);
        }
        return value;
      }
      function togglePwdVisible() {
        isPwdVisible.value = !isPwdVisible.value;
      }
      async function handleClear() {
        focusing.value = false;
        inputValue.value = "";
        if (props.focusWhenClear) {
          clearing.value = true;
          focused.value = false;
        }
        await pause();
        if (props.focusWhenClear) {
          focused.value = true;
          focusing.value = true;
        }
        emit("update:modelValue", inputValue.value);
        emit("clear");
      }
      async function handleBlur() {
        await pause(150);
        if (clearing.value) {
          clearing.value = false;
          return;
        }
        focusing.value = false;
        emit("blur", {
          value: inputValue.value
        });
      }
      function handleFocus({ detail }) {
        focusing.value = true;
        emit("focus", detail);
      }
      function handleInput({ detail }) {
        emit("update:modelValue", inputValue.value);
        emit("input", detail);
      }
      function handleKeyboardheightchange({ detail }) {
        emit("keyboardheightchange", detail);
      }
      function handleConfirm({ detail }) {
        emit("confirm", detail);
      }
      function onClickSuffixIcon() {
        emit("clicksuffixicon");
      }
      function onClickPrefixIcon() {
        emit("clickprefixicon");
      }
      function handleClick(event) {
        emit("click", event);
      }
      function isValueEqual(value1, value2) {
        return isEqual(String(value1), String(value2));
      }
      const __returned__ = { props, emit, slots, translate, isPwdVisible, clearing, focused, focusing, inputValue, cell, form, placeholderValue, showClear, showWordCount, errorMessage, isRequired, rootClass, labelClass, inputPlaceholderClass, labelStyle, getInitValue, formatValue, togglePwdVisible, handleClear, handleBlur, handleFocus, handleInput, handleKeyboardheightchange, handleConfirm, onClickSuffixIcon, onClickPrefixIcon, handleClick, isValueEqual, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$K(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle(_ctx.customStyle),
        onClick: $setup.handleClick
      },
      [
        _ctx.label || _ctx.$slots.label ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass($setup.labelClass),
            style: vue.normalizeStyle($setup.labelStyle)
          },
          [
            $setup.isRequired && _ctx.markerSide === "before" ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "wd-input__required wd-input__required--left"
            }, "*")) : vue.createCommentVNode("v-if", true),
            _ctx.prefixIcon || _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "wd-input__prefix"
            }, [
              _ctx.prefixIcon && !_ctx.$slots.prefix ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-input__icon",
                name: _ctx.prefixIcon,
                onClick: $setup.onClickPrefixIcon
              }, null, 8, ["name"])) : vue.renderSlot(_ctx.$slots, "prefix", { key: 1 }, void 0, true)
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "wd-input__label-inner" }, [
              _ctx.label && !_ctx.$slots.label ? (vue.openBlock(), vue.createElementBlock(
                "text",
                { key: 0 },
                vue.toDisplayString(_ctx.label),
                1
                /* TEXT */
              )) : _ctx.$slots.label ? vue.renderSlot(_ctx.$slots, "label", { key: 1 }, void 0, true) : vue.createCommentVNode("v-if", true)
            ]),
            $setup.isRequired && _ctx.markerSide === "after" ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 2,
              class: "wd-input__required"
            }, "*")) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "wd-input__body" }, [
          vue.createElementVNode("view", { class: "wd-input__value" }, [
            (_ctx.prefixIcon || _ctx.$slots.prefix) && !_ctx.label ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "wd-input__prefix"
            }, [
              _ctx.prefixIcon && !_ctx.$slots.prefix ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-input__icon",
                name: _ctx.prefixIcon,
                onClick: $setup.onClickPrefixIcon
              }, null, 8, ["name"])) : vue.renderSlot(_ctx.$slots, "prefix", { key: 1 }, void 0, true)
            ])) : vue.createCommentVNode("v-if", true),
            vue.withDirectives(vue.createElementVNode("input", {
              class: vue.normalizeClass([
                "wd-input__inner",
                _ctx.prefixIcon ? "wd-input__inner--prefix" : "",
                $setup.showWordCount ? "wd-input__inner--count" : "",
                _ctx.alignRight ? "is-align-right" : "",
                _ctx.customInputClass
              ]),
              type: _ctx.type,
              password: _ctx.showPassword && !$setup.isPwdVisible,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
              placeholder: $setup.placeholderValue,
              disabled: _ctx.disabled || _ctx.readonly,
              maxlength: _ctx.maxlength,
              focus: $setup.focused,
              "confirm-type": _ctx.confirmType,
              "confirm-hold": _ctx.confirmHold,
              cursor: _ctx.cursor,
              "cursor-spacing": _ctx.cursorSpacing,
              "placeholder-style": _ctx.placeholderStyle,
              "selection-start": _ctx.selectionStart,
              "selection-end": _ctx.selectionEnd,
              "adjust-position": _ctx.adjustPosition,
              "hold-keyboard": _ctx.holdKeyboard,
              "always-embed": _ctx.alwaysEmbed,
              "placeholder-class": $setup.inputPlaceholderClass,
              ignoreCompositionEvent: _ctx.ignoreCompositionEvent,
              inputmode: _ctx.inputmode,
              onInput: $setup.handleInput,
              onFocus: $setup.handleFocus,
              onBlur: $setup.handleBlur,
              onConfirm: $setup.handleConfirm,
              onKeyboardheightchange: $setup.handleKeyboardheightchange
            }, null, 42, ["type", "password", "placeholder", "disabled", "maxlength", "focus", "confirm-type", "confirm-hold", "cursor", "cursor-spacing", "placeholder-style", "selection-start", "selection-end", "adjust-position", "hold-keyboard", "always-embed", "placeholder-class", "ignoreCompositionEvent", "inputmode"]), [
              [vue.vModelDynamic, $setup.inputValue]
            ]),
            $setup.props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "wd-input__readonly-mask"
            })) : vue.createCommentVNode("v-if", true),
            $setup.showClear || _ctx.showPassword || _ctx.suffixIcon || $setup.showWordCount || _ctx.$slots.suffix ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "wd-input__suffix"
            }, [
              $setup.showClear ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-input__clear",
                name: "error-fill",
                onClick: $setup.handleClear
              })) : vue.createCommentVNode("v-if", true),
              _ctx.showPassword ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 1,
                "custom-class": "wd-input__icon",
                name: $setup.isPwdVisible ? "view" : "eye-close",
                onClick: $setup.togglePwdVisible
              }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
              $setup.showWordCount ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 2,
                class: "wd-input__count"
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass([
                      $setup.inputValue && String($setup.inputValue).length > 0 ? "wd-input__count-current" : "",
                      String($setup.inputValue).length > _ctx.maxlength ? "is-error" : ""
                    ])
                  },
                  vue.toDisplayString(String($setup.inputValue).length),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createTextVNode(
                  " /" + vue.toDisplayString(_ctx.maxlength),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true),
              _ctx.suffixIcon && !_ctx.$slots.suffix ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 3,
                "custom-class": "wd-input__icon",
                name: _ctx.suffixIcon,
                onClick: $setup.onClickSuffixIcon
              }, null, 8, ["name"])) : vue.renderSlot(_ctx.$slots, "suffix", { key: 4 }, void 0, true)
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "wd-input__error-message"
            },
            vue.toDisplayString($setup.errorMessage),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$K], ["__scopeId", "data-v-4e0c9774"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-input/wd-input.vue"]]);
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    1 | 2
    /* HookFlags.PAGE */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const onPullDownRefresh = /* @__PURE__ */ createLifeCycleHook(
    ON_PULL_DOWN_REFRESH,
    2
    /* HookFlags.PAGE */
  );
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function flattenVNodes(children) {
    const result = [];
    const traverse = (children2) => {
      if (Array.isArray(children2)) {
        children2.forEach((child) => {
          var _a;
          if (isVNode(child)) {
            result.push(child);
            if ((_a = child.component) == null ? void 0 : _a.subTree) {
              result.push(child.component.subTree);
              traverse(child.component.subTree.children);
            }
            if (child.children) {
              traverse(child.children);
            }
          }
        });
      }
    };
    traverse(children);
    return result;
  }
  const findVNodeIndex = (vnodes, vnode) => {
    const index = vnodes.indexOf(vnode);
    if (index === -1) {
      return vnodes.findIndex((item) => vnode.key !== void 0 && vnode.key !== null && item.type === vnode.type && item.key === vnode.key);
    }
    return index;
  };
  function sortChildren(parent, publicChildren, internalChildren) {
    const vnodes = parent && parent.subTree && parent.subTree.children ? flattenVNodes(parent.subTree.children) : [];
    internalChildren.sort((a, b) => findVNodeIndex(vnodes, a.vnode) - findVNodeIndex(vnodes, b.vnode));
    const orderedPublicChildren = internalChildren.map((item) => item.proxy);
    publicChildren.sort((a, b) => {
      const indexA = orderedPublicChildren.indexOf(a);
      const indexB = orderedPublicChildren.indexOf(b);
      return indexA - indexB;
    });
  }
  function useChildren(key) {
    const publicChildren = vue.reactive([]);
    const internalChildren = vue.reactive([]);
    const parent = vue.getCurrentInstance();
    const linkChildren = (value) => {
      const link = (child) => {
        if (child.proxy) {
          internalChildren.push(child);
          publicChildren.push(child.proxy);
          sortChildren(parent, publicChildren, internalChildren);
        }
      };
      const unlink = (child) => {
        const index = internalChildren.indexOf(child);
        publicChildren.splice(index, 1);
        internalChildren.splice(index, 1);
      };
      vue.provide(
        key,
        Object.assign(
          {
            link,
            unlink,
            children: publicChildren,
            internalChildren
          },
          value
        )
      );
    };
    return {
      children: publicChildren,
      linkChildren
    };
  }
  const __default__$v = {
    name: "wd-cell-group",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$K = /* @__PURE__ */ vue.defineComponent({
    ...__default__$v,
    props: cellGroupProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const { linkChildren } = useChildren(CELL_GROUP_KEY);
      linkChildren({ props });
      const __returned__ = { props, linkChildren };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$J(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["wd-cell-group", _ctx.border ? "is-border" : "", _ctx.customClass]),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        _ctx.title || _ctx.value || _ctx.useSlot ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "wd-cell-group__title"
        }, [
          vue.createCommentVNode("左侧标题"),
          vue.createElementVNode("view", { class: "wd-cell-group__left" }, [
            !_ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock(
              "text",
              { key: 0 },
              vue.toDisplayString(_ctx.title),
              1
              /* TEXT */
            )) : vue.renderSlot(_ctx.$slots, "title", { key: 1 }, void 0, true)
          ]),
          vue.createCommentVNode("右侧标题"),
          vue.createElementVNode("view", { class: "wd-cell-group__right" }, [
            !_ctx.$slots.value ? (vue.openBlock(), vue.createElementBlock(
              "text",
              { key: 0 },
              vue.toDisplayString(_ctx.value),
              1
              /* TEXT */
            )) : vue.renderSlot(_ctx.$slots, "value", { key: 1 }, void 0, true)
          ])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "wd-cell-group__body" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$J], ["__scopeId", "data-v-55e5786b"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-cell-group/wd-cell-group.vue"]]);
  const _b64chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"];
  const _mkUriSafe = (src) => src.replace(/[+/]/g, (m0) => m0 === "+" ? "-" : "_").replace(/=+\$/m, "");
  const fromUint8Array = (src, rfc4648 = false) => {
    let b64 = "";
    for (let i = 0, l = src.length; i < l; i += 3) {
      const [a0, a1, a2] = [src[i], src[i + 1], src[i + 2]];
      const ord = a0 << 16 | a1 << 8 | a2;
      b64 += _b64chars[ord >>> 18];
      b64 += _b64chars[ord >>> 12 & 63];
      b64 += typeof a1 !== "undefined" ? _b64chars[ord >>> 6 & 63] : "=";
      b64 += typeof a2 !== "undefined" ? _b64chars[ord & 63] : "=";
    }
    return rfc4648 ? _mkUriSafe(b64) : b64;
  };
  const _btoa = typeof btoa === "function" ? (s) => btoa(s) : (s) => {
    if (s.charCodeAt(0) > 255) {
      throw new RangeError("The string contains invalid characters.");
    }
    return fromUint8Array(Uint8Array.from(s, (c) => c.charCodeAt(0)));
  };
  const utob = (src) => unescape(encodeURIComponent(src));
  function encode(src, rfc4648 = false) {
    const b64 = _btoa(utob(src));
    return rfc4648 ? _mkUriSafe(b64) : b64;
  }
  const buttonProps = {
    ...baseProps,
    /**
     * 幽灵按钮
     */
    plain: makeBooleanProp(false),
    /**
     * 圆角按钮
     */
    round: makeBooleanProp(true),
    /**
     * 禁用按钮
     */
    disabled: makeBooleanProp(false),
    /**
     * 是否细边框
     */
    hairline: makeBooleanProp(false),
    /**
     * 块状按钮
     */
    block: makeBooleanProp(false),
    /**
     * 按钮类型，可选值：primary / success / info / warning / error / text / icon
     */
    type: makeStringProp("primary"),
    /**
     * 按钮尺寸，可选值：small / medium / large
     */
    size: makeStringProp("medium"),
    /**
     * 图标类名
     */
    icon: String,
    /**
     * 类名前缀，用于使用自定义图标，用法参考Icon组件
     */
    classPrefix: makeStringProp("wd-icon"),
    /**
     * 加载中按钮
     */
    loading: makeBooleanProp(false),
    /**
     * 加载图标颜色
     */
    loadingColor: String,
    /**
     * 开放能力
     */
    openType: String,
    /**
     * 指定是否阻止本节点的祖先节点出现点击态
     */
    hoverStopPropagation: Boolean,
    /**
     * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文
     */
    lang: String,
    /**
     * 会话来源，open-type="contact"时有效
     */
    sessionFrom: String,
    /**
     * 会话内消息卡片标题，open-type="contact"时有效
     */
    sendMessageTitle: String,
    /**
     * 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
     */
    sendMessagePath: String,
    /**
     * 会话内消息卡片图片，open-type="contact"时有效
     */
    sendMessageImg: String,
    /**
     * 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
     */
    appParameter: String,
    /**
     * 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效
     */
    showMessageCard: Boolean,
    /**
     * 按钮的唯一标识，可用于设置隐私同意授权按钮的id
     */
    buttonId: String,
    /**
     * 支付宝小程序，当 open-type 为 getAuthorize 时有效。
     * 可选值：'phoneNumber' | 'userInfo'
     */
    scope: String
  };
  const __default__$u = {
    name: "wd-button",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$J = /* @__PURE__ */ vue.defineComponent({
    ...__default__$u,
    props: buttonProps,
    emits: [
      "click",
      "getuserinfo",
      "contact",
      "getphonenumber",
      "error",
      "launchapp",
      "opensetting",
      "chooseavatar",
      "agreeprivacyauthorization"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const loadingIcon = (color = "#4D80F0", reverse = true) => {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="a"><stop stop-color="${reverse ? color : "#fff"}" offset="0%" stop-opacity="0"/><stop stop-color="${reverse ? color : "#fff"}" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${reverse ? "#fff" : color}"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#a)" stroke-width="3.5" stroke-linecap="round"/></g></svg>`;
      };
      const props = __props;
      const emit = __emit;
      const hoverStartTime = vue.ref(20);
      const hoverStayTime = vue.ref(70);
      const loadingIconSvg = vue.ref("");
      const loadingStyle = vue.computed(() => {
        return `background-image: url(${loadingIconSvg.value});`;
      });
      vue.watch(
        () => props.loading,
        () => {
          buildLoadingSvg();
        },
        { deep: true, immediate: true }
      );
      function handleClick(event) {
        if (!props.disabled && !props.loading) {
          emit("click", event);
        }
      }
      function handleGetAuthorize(event) {
        if (props.scope === "phoneNumber") {
          handleGetphonenumber(event);
        } else if (props.scope === "userInfo") {
          handleGetuserinfo(event);
        }
      }
      function handleGetuserinfo(event) {
        emit("getuserinfo", event.detail);
      }
      function handleConcat(event) {
        emit("contact", event.detail);
      }
      function handleGetphonenumber(event) {
        emit("getphonenumber", event.detail);
      }
      function handleError(event) {
        emit("error", event.detail);
      }
      function handleLaunchapp(event) {
        emit("launchapp", event.detail);
      }
      function handleOpensetting(event) {
        emit("opensetting", event.detail);
      }
      function handleChooseavatar(event) {
        emit("chooseavatar", event.detail);
      }
      function handleAgreePrivacyAuthorization(event) {
        emit("agreeprivacyauthorization", event.detail);
      }
      function buildLoadingSvg() {
        const { loadingColor, type, plain } = props;
        let color = loadingColor;
        if (!color) {
          switch (type) {
            case "primary":
              color = "#4D80F0";
              break;
            case "success":
              color = "#34d19d";
              break;
            case "info":
              color = "#333";
              break;
            case "warning":
              color = "#f0883a";
              break;
            case "error":
              color = "#fa4350";
              break;
            case "default":
              color = "#333";
              break;
          }
        }
        const svg = loadingIcon(color, !plain);
        loadingIconSvg.value = `"data:image/svg+xml;base64,${encode(svg)}"`;
      }
      const __returned__ = { loadingIcon, props, emit, hoverStartTime, hoverStayTime, loadingIconSvg, loadingStyle, handleClick, handleGetAuthorize, handleGetuserinfo, handleConcat, handleGetphonenumber, handleError, handleLaunchapp, handleOpensetting, handleChooseavatar, handleAgreePrivacyAuthorization, buildLoadingSvg, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$I(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("button", {
      id: _ctx.buttonId,
      "hover-class": `${_ctx.disabled || _ctx.loading ? "" : "wd-button--active"}`,
      style: vue.normalizeStyle(_ctx.customStyle),
      class: vue.normalizeClass([
        "wd-button",
        "is-" + _ctx.type,
        "is-" + _ctx.size,
        _ctx.round ? "is-round" : "",
        _ctx.hairline ? "is-hairline" : "",
        _ctx.plain ? "is-plain" : "",
        _ctx.disabled ? "is-disabled" : "",
        _ctx.block ? "is-block" : "",
        _ctx.loading ? "is-loading" : "",
        _ctx.customClass
      ]),
      "hover-start-time": $setup.hoverStartTime,
      "hover-stay-time": $setup.hoverStayTime,
      "open-type": _ctx.disabled || _ctx.loading ? void 0 : _ctx.openType,
      "send-message-title": _ctx.sendMessageTitle,
      "send-message-path": _ctx.sendMessagePath,
      "send-message-img": _ctx.sendMessageImg,
      "app-parameter": _ctx.appParameter,
      "show-message-card": _ctx.showMessageCard,
      "session-from": _ctx.sessionFrom,
      lang: _ctx.lang,
      "hover-stop-propagation": _ctx.hoverStopPropagation,
      scope: _ctx.scope,
      onClick: $setup.handleClick,
      "on:getAuthorize": $setup.handleGetAuthorize,
      onGetuserinfo: $setup.handleGetuserinfo,
      onContact: $setup.handleConcat,
      onGetphonenumber: $setup.handleGetphonenumber,
      onError: $setup.handleError,
      onLaunchapp: $setup.handleLaunchapp,
      onOpensetting: $setup.handleOpensetting,
      onChooseavatar: $setup.handleChooseavatar,
      onAgreeprivacyauthorization: $setup.handleAgreePrivacyAuthorization
    }, [
      vue.createElementVNode("view", { class: "wd-button__content" }, [
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "wd-button__loading"
        }, [
          vue.createElementVNode(
            "view",
            {
              class: "wd-button__loading-svg",
              style: vue.normalizeStyle($setup.loadingStyle)
            },
            null,
            4
            /* STYLE */
          )
        ])) : _ctx.icon ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
          key: 1,
          "custom-class": "wd-button__icon",
          name: _ctx.icon,
          classPrefix: _ctx.classPrefix
        }, null, 8, ["name", "classPrefix"])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "wd-button__text" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ])
    ], 46, ["id", "hover-class", "hover-start-time", "hover-stay-time", "open-type", "send-message-title", "send-message-path", "send-message-img", "app-parameter", "show-message-card", "session-from", "lang", "hover-stop-propagation", "scope"]);
  }
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$I], ["__scopeId", "data-v-d858c170"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-button/wd-button.vue"]]);
  const loadingProps = {
    ...baseProps,
    /**
     * 加载指示器类型，可选值：'outline' | 'ring'
     */
    type: makeStringProp("ring"),
    /**
     * 设置加载指示器颜色
     */
    color: makeStringProp("#4D80F0"),
    /**
     * 设置加载指示器大小
     */
    size: makeNumericProp("")
  };
  const __default__$t = {
    name: "wd-loading",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$I = /* @__PURE__ */ vue.defineComponent({
    ...__default__$t,
    props: loadingProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const svgDefineId = context.id++;
      const svgDefineId1 = context.id++;
      const svgDefineId2 = context.id++;
      const icon = {
        outline(color = "#4D80F0") {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><defs><linearGradient x1="100%" y1="0%" x2="0%" y2="0%" id="${svgDefineId}"><stop stop-color="#FFF" offset="0%" stop-opacity="0"/><stop stop-color="#FFF" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M21 1c11.046 0 20 8.954 20 20s-8.954 20-20 20S1 32.046 1 21 9.954 1 21 1zm0 7C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8z" fill="${color}"/><path d="M4.599 21c0 9.044 7.332 16.376 16.376 16.376 9.045 0 16.376-7.332 16.376-16.376" stroke="url(#${svgDefineId}) " stroke-width="3.5" stroke-linecap="round"/></g></svg>`;
        },
        ring(color = "#4D80F0", intermediateColor2 = "#a6bff7") {
          return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><linearGradient id="${svgDefineId1}" gradientUnits="userSpaceOnUse" x1="50" x2="50" y2="180"><stop offset="0" stop-color="${color}"></stop> <stop offset="1" stop-color="${intermediateColor2}"></stop></linearGradient> <path fill="url(#${svgDefineId1})" d="M20 100c0-44.1 35.9-80 80-80V0C44.8 0 0 44.8 0 100s44.8 100 100 100v-20c-44.1 0-80-35.9-80-80z"></path> <linearGradient id="${svgDefineId2}" gradientUnits="userSpaceOnUse" x1="150" y1="20" x2="150" y2="180"><stop offset="0" stop-color="#fff" stop-opacity="0"></stop> <stop offset="1" stop-color="${intermediateColor2}"></stop></linearGradient> <path fill="url(#${svgDefineId2})" d="M100 0v20c44.1 0 80 35.9 80 80s-35.9 80-80 80v20c55.2 0 100-44.8 100-100S155.2 0 100 0z"></path> <circle cx="100" cy="10" r="10" fill="${color}"></circle></svg>`;
        }
      };
      const props = __props;
      const svg = vue.ref("");
      const intermediateColor = vue.ref("");
      const iconSize = vue.ref(null);
      vue.watch(
        () => props.size,
        (newVal) => {
          iconSize.value = addUnit(newVal);
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.type,
        () => {
          buildSvg();
        },
        {
          deep: true,
          immediate: true
        }
      );
      const rootStyle = vue.computed(() => {
        const style = {};
        if (isDef(iconSize.value)) {
          style.height = addUnit(iconSize.value);
          style.width = addUnit(iconSize.value);
        }
        return `${objToStyle(style)} ${props.customStyle}`;
      });
      vue.onBeforeMount(() => {
        intermediateColor.value = gradient(props.color, "#ffffff", 2)[1];
        buildSvg();
      });
      function buildSvg() {
        const { type, color } = props;
        let ringType = isDef(type) ? type : "ring";
        const svgStr = `"data:image/svg+xml;base64,${encode(ringType === "ring" ? icon[ringType](color, intermediateColor.value) : icon[ringType](color))}"`;
        svg.value = svgStr;
      }
      const __returned__ = { svgDefineId, svgDefineId1, svgDefineId2, icon, props, svg, intermediateColor, iconSize, rootStyle, buildSvg };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$H(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-loading ${$setup.props.customClass}`),
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        vue.createElementVNode("view", { class: "wd-loading__body" }, [
          vue.createElementVNode(
            "view",
            {
              class: "wd-loading__svg",
              style: vue.normalizeStyle(`background-image: url(${$setup.svg});`)
            },
            null,
            4
            /* STYLE */
          )
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const wdLoading = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$H], ["__scopeId", "data-v-f2b508ee"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-loading/wd-loading.vue"]]);
  const transitionProps = {
    ...baseProps,
    /**
     * 是否展示组件
     * 类型：boolean
     * 默认值：false
     */
    show: makeBooleanProp(false),
    /**
     * 动画执行时间
     * 类型：number | boolean | Record<string, number>
     * 默认值：300 (毫秒)
     */
    duration: {
      type: [Object, Number, Boolean],
      default: 300
    },
    /**
     * 弹层内容懒渲染，触发展示时才渲染内容
     * 类型：boolean
     * 默认值：false
     */
    lazyRender: makeBooleanProp(false),
    /**
     * 动画类型
     * 类型：string
     * 可选值：fade / fade-up / fade-down / fade-left / fade-right / slide-up / slide-down / slide-left / slide-right / zoom-in
     * 默认值：'fade'
     */
    name: [String, Array],
    /**
     * 是否在动画结束时销毁子节点（display: none)
     * 类型：boolean
     * 默认值：false
     */
    destroy: makeBooleanProp(true),
    /**
     * 进入过渡的开始状态
     * 类型：string
     */
    enterClass: makeStringProp(""),
    /**
     * 进入过渡的激活状态
     * 类型：string
     */
    enterActiveClass: makeStringProp(""),
    /**
     * 进入过渡的结束状态
     * 类型：string
     */
    enterToClass: makeStringProp(""),
    /**
     * 离开过渡的开始状态
     * 类型：string
     */
    leaveClass: makeStringProp(""),
    /**
     * 离开过渡的激活状态
     * 类型：string
     */
    leaveActiveClass: makeStringProp(""),
    /**
     * 离开过渡的结束状态
     * 类型：string
     */
    leaveToClass: makeStringProp(""),
    /**
     * 是否阻止触摸滚动
     * 类型：boolean
     * 默认值：false
     */
    disableTouchMove: makeBooleanProp(false)
  };
  const __default__$s = {
    name: "wd-transition",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$H = /* @__PURE__ */ vue.defineComponent({
    ...__default__$s,
    props: transitionProps,
    emits: ["click", "before-enter", "enter", "before-leave", "leave", "after-leave", "after-enter"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const getClassNames = (name) => {
        let enter2 = `${props.enterClass} ${props.enterActiveClass}`;
        let enterTo = `${props.enterToClass} ${props.enterActiveClass}`;
        let leave2 = `${props.leaveClass} ${props.leaveActiveClass}`;
        let leaveTo = `${props.leaveToClass} ${props.leaveActiveClass}`;
        if (Array.isArray(name)) {
          for (let index = 0; index < name.length; index++) {
            enter2 = `wd-${name[index]}-enter wd-${name[index]}-enter-active ${enter2}`;
            enterTo = `wd-${name[index]}-enter-to wd-${name[index]}-enter-active ${enterTo}`;
            leave2 = `wd-${name[index]}-leave wd-${name[index]}-leave-active ${leave2}`;
            leaveTo = `wd-${name[index]}-leave-to wd-${name[index]}-leave-active ${leaveTo}`;
          }
        } else if (name) {
          enter2 = `wd-${name}-enter wd-${name}-enter-active ${enter2}`;
          enterTo = `wd-${name}-enter-to wd-${name}-enter-active ${enterTo}`;
          leave2 = `wd-${name}-leave wd-${name}-leave-active ${leave2}`;
          leaveTo = `wd-${name}-leave-to wd-${name}-leave-active ${leaveTo}`;
        }
        return {
          enter: enter2,
          "enter-to": enterTo,
          leave: leave2,
          "leave-to": leaveTo
        };
      };
      const props = __props;
      const emit = __emit;
      const inited = vue.ref(false);
      const display = vue.ref(false);
      const status = vue.ref("");
      const transitionEnded = vue.ref(false);
      const currentDuration = vue.ref(300);
      const classes = vue.ref("");
      const enterPromise = vue.ref(null);
      const enterLifeCyclePromises = vue.ref(null);
      const leaveLifeCyclePromises = vue.ref(null);
      const style = vue.computed(() => {
        return `-webkit-transition-duration:${currentDuration.value}ms;transition-duration:${currentDuration.value}ms;${display.value || !props.destroy ? "" : "display: none;"}${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-transition ${props.customClass}  ${classes.value}`;
      });
      const isShow = vue.computed(() => {
        return !props.lazyRender || inited.value;
      });
      vue.onBeforeMount(() => {
        if (props.show) {
          enter();
        }
      });
      vue.watch(
        () => props.show,
        (newVal) => {
          handleShow(newVal);
        },
        { deep: true }
      );
      function handleClick() {
        emit("click");
      }
      function handleShow(value) {
        if (value) {
          handleAbortPromise();
          enter();
        } else {
          leave();
        }
      }
      function handleAbortPromise() {
        isPromise(enterPromise.value) && enterPromise.value.abort();
        isPromise(enterLifeCyclePromises.value) && enterLifeCyclePromises.value.abort();
        isPromise(leaveLifeCyclePromises.value) && leaveLifeCyclePromises.value.abort();
        enterPromise.value = null;
        enterLifeCyclePromises.value = null;
        leaveLifeCyclePromises.value = null;
      }
      function enter() {
        enterPromise.value = new AbortablePromise(async (resolve) => {
          try {
            const classNames = getClassNames(props.name);
            const duration = isObj(props.duration) ? props.duration.enter : props.duration;
            status.value = "enter";
            emit("before-enter");
            enterLifeCyclePromises.value = pause();
            await enterLifeCyclePromises.value;
            emit("enter");
            classes.value = classNames.enter;
            currentDuration.value = duration;
            enterLifeCyclePromises.value = pause();
            await enterLifeCyclePromises.value;
            inited.value = true;
            display.value = true;
            enterLifeCyclePromises.value = pause();
            await enterLifeCyclePromises.value;
            enterLifeCyclePromises.value = null;
            transitionEnded.value = false;
            classes.value = classNames["enter-to"];
            resolve();
          } catch (error) {
          }
        });
      }
      async function leave() {
        if (!enterPromise.value) {
          transitionEnded.value = false;
          return onTransitionEnd();
        }
        try {
          await enterPromise.value;
          if (!display.value)
            return;
          const classNames = getClassNames(props.name);
          const duration = isObj(props.duration) ? props.duration.leave : props.duration;
          status.value = "leave";
          emit("before-leave");
          currentDuration.value = duration;
          leaveLifeCyclePromises.value = pause();
          await leaveLifeCyclePromises.value;
          emit("leave");
          classes.value = classNames.leave;
          leaveLifeCyclePromises.value = pause();
          await leaveLifeCyclePromises.value;
          transitionEnded.value = false;
          classes.value = classNames["leave-to"];
          leaveLifeCyclePromises.value = setPromise(currentDuration.value);
          await leaveLifeCyclePromises.value;
          leaveLifeCyclePromises.value = null;
          onTransitionEnd();
          enterPromise.value = null;
        } catch (error) {
        }
      }
      function setPromise(duration) {
        return new AbortablePromise((resolve) => {
          const timer2 = setTimeout(() => {
            clearTimeout(timer2);
            resolve();
          }, duration);
        });
      }
      function onTransitionEnd() {
        if (transitionEnded.value)
          return;
        transitionEnded.value = true;
        if (status.value === "leave") {
          emit("after-leave");
        } else if (status.value === "enter") {
          emit("after-enter");
        }
        if (!props.show && display.value) {
          display.value = false;
        }
      }
      function noop() {
      }
      const __returned__ = { getClassNames, props, emit, inited, display, status, transitionEnded, currentDuration, classes, enterPromise, enterLifeCyclePromises, leaveLifeCyclePromises, style, rootClass, isShow, handleClick, handleShow, handleAbortPromise, enter, leave, setPromise, onTransitionEnd, noop };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$G(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.isShow && _ctx.disableTouchMove ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle($setup.style),
        onTransitionend: $setup.onTransitionEnd,
        onClick: $setup.handleClick,
        onTouchmove: vue.withModifiers($setup.noop, ["stop", "prevent"])
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      38
      /* CLASS, STYLE, NEED_HYDRATION */
    )) : $setup.isShow && !_ctx.disableTouchMove ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 1,
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle($setup.style),
        onTransitionend: $setup.onTransitionEnd,
        onClick: $setup.handleClick
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      38
      /* CLASS, STYLE, NEED_HYDRATION */
    )) : vue.createCommentVNode("v-if", true);
  }
  const wdTransition = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$G], ["__scopeId", "data-v-af59a128"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-transition/wd-transition.vue"]]);
  const overlayProps = {
    ...baseProps,
    /**
     * 是否展示遮罩层
     */
    show: makeBooleanProp(false),
    /**
     * 动画时长，单位毫秒
     */
    duration: {
      type: [Object, Number, Boolean],
      default: 300
    },
    /**
     * 是否锁定滚动
     */
    lockScroll: makeBooleanProp(true),
    /**
     * 层级
     */
    zIndex: makeNumberProp(10)
  };
  const __default__$r = {
    name: "wd-overlay",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$G = /* @__PURE__ */ vue.defineComponent({
    ...__default__$r,
    props: overlayProps,
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function handleClick() {
        emit("click");
      }
      const __returned__ = { props, emit, handleClick, wdTransition };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$F(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock($setup["wdTransition"], {
      show: _ctx.show,
      name: "fade",
      "custom-class": "wd-overlay",
      duration: _ctx.duration,
      "custom-style": `z-index: ${_ctx.zIndex}; ${_ctx.customStyle}`,
      "disable-touch-move": _ctx.lockScroll,
      onClick: $setup.handleClick
    }, {
      default: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["show", "duration", "custom-style", "disable-touch-move"]);
  }
  const wdOverlay = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$F], ["__scopeId", "data-v-6e0d1141"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-overlay/wd-overlay.vue"]]);
  const toastDefaultOptionKey = "__TOAST_OPTION__";
  const defaultOptions$1 = {
    duration: 2e3,
    show: false
  };
  const None$2 = Symbol("None");
  function useToast(selector = "") {
    const toastOptionKey = getToastOptionKey(selector);
    const toastOption = vue.inject(toastOptionKey, vue.ref(None$2));
    if (toastOption.value === None$2) {
      toastOption.value = defaultOptions$1;
      vue.provide(toastOptionKey, toastOption);
    }
    let timer2 = null;
    const createMethod = (toastOptions) => {
      return (options) => {
        return show(deepMerge(toastOptions, typeof options === "string" ? { msg: options } : options));
      };
    };
    const show = (option) => {
      const options = deepMerge(defaultOptions$1, typeof option === "string" ? { msg: option } : option);
      toastOption.value = deepMerge(options, {
        show: true
      });
      timer2 && clearTimeout(timer2);
      if (toastOption.value.duration && toastOption.value.duration > 0) {
        timer2 = setTimeout(() => {
          timer2 && clearTimeout(timer2);
          close();
        }, options.duration);
      }
    };
    const loading = createMethod({
      iconName: "loading",
      duration: 0,
      cover: true
    });
    const success = createMethod({
      iconName: "success",
      duration: 1500
    });
    const error = createMethod({ iconName: "error" });
    const warning = createMethod({ iconName: "warning" });
    const info = createMethod({ iconName: "info" });
    const close = () => {
      toastOption.value = { show: false };
    };
    return {
      show,
      loading,
      success,
      error,
      warning,
      info,
      close
    };
  }
  const getToastOptionKey = (selector) => {
    return selector ? `${toastDefaultOptionKey}${selector}` : toastDefaultOptionKey;
  };
  const toastIcon = {
    success() {
      return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>成功</title><desc>Created with Sketch.</desc><defs><filter x="-63.2%" y="-80.0%" width="226.3%" height="260.0%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.122733141   0 0 0 0 0.710852582   0 0 0 0 0.514812768  0 0 0 1 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><rect id="path-2" x="3.4176226" y="5.81442199" width="3" height="8.5" rx="1.5"></rect><linearGradient x1="50%" y1="0.126649064%" x2="50%" y2="100%" id="linearGradient-4"><stop stop-color="#ACFFBD" stop-opacity="0.208123907" offset="0%"></stop><stop stop-color="#10B87C" offset="100%"></stop></linearGradient></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-388.000000, -538.000000)"><g id="成功" transform="translate(388.000000, 538.000000)"><circle id="Oval" fill="#34D19D" opacity="0.400000006" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#34D19D" cx="21" cy="21" r="16"></circle><g id="Group-6" filter="url(#filter-1)" transform="translate(11.500000, 14.000000)"><mask id="mask-3" fill="white"><use xlink:href="#path-2"></use></mask><use id="Rectangle-Copy-24" fill="#C4FFEB" transform="translate(4.917623, 10.064422) rotate(-45.000000) translate(-4.917623, -10.064422) " xlink:href="#path-2"></use><rect id="Rectangle" fill="url(#linearGradient-4)" mask="url(#mask-3)" transform="translate(6.215869, 11.372277) rotate(-45.000000) translate(-6.215869, -11.372277) " x="4.71586891" y="9.52269089" width="3" height="3.69917136"></rect><rect id="Rectangle" fill="#FFFFFF" transform="translate(11.636236, 7.232744) scale(1, -1) rotate(-45.000000) translate(-11.636236, -7.232744) " x="10.1362361" y="-1.02185365" width="3" height="16.5091951" rx="1.5"></rect></g></g></g></g></svg>';
    },
    warning() {
      return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>警告</title><desc>Created with Sketch.</desc> <defs> <filter x="-240.0%" y="-60.0%" width="580.0%" height="220.0%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.824756567   0 0 0 0 0.450356612   0 0 0 0 0.168550194  0 0 0 1 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode> <feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-580.000000, -538.000000)"> <g id="警告" transform="translate(580.000000, 538.000000)"><circle id="Oval" fill="#F0883A" opacity="0.400000006" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#F0883A" cx="21" cy="21" r="16"></circle><g id="Group-6" filter="url(#filter-1)" transform="translate(18.500000, 10.800000)"><rect id="Rectangle" fill="#FFFFFF" transform="translate(2.492935, 7.171583) scale(1, -1) rotate(-360.000000) translate(-2.492935, -7.171583) " x="0.992934699" y="0.955464537" width="3" height="12.4322365" rx="1.5"></rect><rect id="Rectangle-Copy-25" fill="#FFDEC5" transform="translate(2.508751, 17.202636) scale(1, -1) rotate(-360.000000) translate(-2.508751, -17.202636) " x="1.00875134" y="15.200563" width="3" height="4.00414639" rx="1.5"></rect></g></g></g></g></svg>';
    },
    info() {
      return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>常规</title><desc>Created with Sketch.</desc><defs><filter x="-300.0%" y="-57.1%" width="700.0%" height="214.3%" filterUnits="objectBoundingBox" id="filter-1"><feOffset dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="2" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.362700096   0 0 0 0 0.409035039   0 0 0 0 0.520238904  0 0 0 1 0" type="matrix" in="shadowBlurOuter1" result="shadowMatrixOuter1"></feColorMatrix><feMerge><feMergeNode in="shadowMatrixOuter1"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-772.000000, -538.000000)"><g id="常规" transform="translate(772.000000, 538.000000)"><circle id="Oval" fill="#909CB7" opacity="0.4" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#909CB7" cx="21" cy="21" r="16"></circle><g id="Group-6" filter="url(#filter-1)" transform="translate(18.500000, 9.800000)"><g id="编组-2" transform="translate(2.492935, 10.204709) rotate(-180.000000) translate(-2.492935, -10.204709) translate(0.992935, 0.204709)"><rect id="Rectangle" fill="#FFFFFF" transform="translate(1.500000, 7.000000) scale(1, -1) rotate(-360.000000) translate(-1.500000, -7.000000) " x="0" y="0" width="3" height="14" rx="1.5"></rect><rect id="Rectangle-Copy-25" fill="#EEEEEE" transform="translate(1.500000, 18.000000) scale(1, -1) rotate(-360.000000) translate(-1.500000, -18.000000) " x="0" y="16" width="3" height="4" rx="1.5"></rect></g></g></g></g></g></svg>';
    },
    error() {
      return '<svg width="42px" height="42px" viewBox="0 0 42 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>toast</title><desc>Created with Sketch.</desc><defs><linearGradient x1="99.6229896%" y1="50.3770104%" x2="0.377010363%" y2="50.3770104%" id="linearGradient-1"><stop stop-color="#FFDFDF" offset="0%"></stop><stop stop-color="#F9BEBE" offset="100%"></stop></linearGradient><linearGradient x1="0.377010363%" y1="50.3770104%" x2="99.6229896%" y2="50.3770104%" id="linearGradient-2"><stop stop-color="#FFDFDF" offset="0%"></stop><stop stop-color="#F9BEBE" offset="100%"></stop></linearGradient></defs><g id="规范" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="反馈-轻提示" transform="translate(-196.000000, -538.000000)"> <g id="toast" transform="translate(196.000000, 538.000000)"><circle id="Oval" fill="#FA4350" opacity="0.400000006" cx="21" cy="21" r="20"></circle><circle id="Oval" fill="#FA4350" opacity="0.900000036" cx="21" cy="21" r="16"></circle><rect id="矩形" fill="#FFDFDF" transform="translate(21.071068, 21.071068) rotate(-225.000000) translate(-21.071068, -21.071068) " x="12.5710678" y="19.5710678" width="17" height="3" rx="1.5"></rect><rect id="矩形" fill="url(#linearGradient-1)" transform="translate(19.303301, 22.838835) rotate(-225.000000) translate(-19.303301, -22.838835) " x="17.3033009" y="21.3388348" width="4" height="3"></rect><rect id="矩形" fill="url(#linearGradient-2)" transform="translate(22.838835, 19.303301) rotate(-225.000000) translate(-22.838835, -19.303301) " x="20.8388348" y="17.8033009" width="4" height="3"></rect><rect id="矩形" fill="#FFFFFF" transform="translate(21.071068, 21.071068) rotate(-315.000000) translate(-21.071068, -21.071068) " x="12.5710678" y="19.5710678" width="17" height="3" rx="1.5"></rect></g></g></g></svg>';
    }
  };
  const toastProps = {
    ...baseProps,
    /**
     * 选择器
     * @type {string}
     * @default ''
     */
    selector: makeStringProp(""),
    /**
     * 提示信息
     * @type {string}
     * @default ''
     */
    msg: {
      type: String,
      default: ""
    },
    /**
     * 排列方向
     * @type {'vertical' | 'horizontal'}
     * @default 'horizontal'
     */
    direction: makeStringProp("horizontal"),
    /**
     * 图标名称
     * @type {'success' | 'error' | 'warning' | 'loading' | 'info'}
     * @default ''
     */
    iconName: {
      type: String,
      default: ""
    },
    /**
     * 图标大小
     * @type {number}
     */
    iconSize: Number,
    /**
     * 加载类型
     * @type {'outline' | 'ring'}
     * @default 'outline'
     */
    loadingType: makeStringProp("outline"),
    /**
     * 加载颜色
     * @type {string}
     * @default '#4D80F0'
     */
    loadingColor: {
      type: String,
      default: "#4D80F0"
    },
    /**
     * 加载大小
     * @type {number}
     */
    loadingSize: Number,
    /**
     * 图标颜色
     * @type {string}
     */
    iconColor: String,
    /**
     * 位置
     * @type {'top' | 'middle-top' | 'middle' | 'bottom'}
     * @default 'middle-top'
     */
    position: makeStringProp("middle-top"),
    /**
     * 层级
     * @type {number}
     * @default 100
     */
    zIndex: {
      type: Number,
      default: 100
    },
    /**
     * 是否存在遮罩层
     * @type {boolean}
     * @default false
     */
    cover: {
      type: Boolean,
      default: false
    },
    /**
     * 图标类名
     * @type {string}
     * @default ''
     */
    iconClass: {
      type: String,
      default: ""
    },
    /**
     * 类名前缀
     * @type {string}
     * @default 'wd-icon'
     */
    classPrefix: {
      type: String,
      default: "wd-icon"
    },
    /**
     * 完全展示后的回调函数
     * @type {Function}
     */
    opened: Function,
    /**
     * 完全关闭时的回调函数
     * @type {Function}
     */
    closed: Function
  };
  const __default__$q = {
    name: "wd-toast",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$F = /* @__PURE__ */ vue.defineComponent({
    ...__default__$q,
    props: toastProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const iconName = vue.ref("");
      const msg = vue.ref("");
      const position = vue.ref("middle");
      const show = vue.ref(false);
      const zIndex = vue.ref(100);
      const loadingType = vue.ref("outline");
      const loadingColor = vue.ref("#4D80F0");
      const iconSize = vue.ref();
      const loadingSize = vue.ref();
      const svgStr = vue.ref("");
      const cover = vue.ref(false);
      const classPrefix = vue.ref("wd-icon");
      const iconClass = vue.ref("");
      const direction = vue.ref("horizontal");
      let opened = null;
      let closed = null;
      const toastOptionKey = getToastOptionKey(props.selector);
      const toastOption = vue.inject(toastOptionKey, vue.ref(defaultOptions$1));
      vue.watch(
        () => toastOption.value,
        (newVal) => {
          reset(newVal);
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => iconName.value,
        () => {
          buildSvg();
        },
        {
          deep: true,
          immediate: true
        }
      );
      const transitionStyle = vue.computed(() => {
        const style = {
          "z-index": zIndex.value,
          position: "fixed",
          top: "50%",
          left: 0,
          width: "100%",
          transform: "translate(0, -50%)",
          "text-align": "center",
          "pointer-events": "none"
        };
        return objToStyle(style);
      });
      const rootClass = vue.computed(() => {
        return `wd-toast ${props.customClass} wd-toast--${position.value} ${(iconName.value !== "loading" || msg.value) && (iconName.value || iconClass.value) ? "wd-toast--with-icon" : ""} ${iconName.value === "loading" && !msg.value ? "wd-toast--loading" : ""} ${direction.value === "vertical" ? "is-vertical" : ""}`;
      });
      const svgStyle = vue.computed(() => {
        const style = {
          backgroundImage: `url(${svgStr.value})`
        };
        if (isDef(iconSize.value)) {
          style.width = iconSize.value;
          style.height = iconSize.value;
        }
        return objToStyle(style);
      });
      vue.onBeforeMount(() => {
        buildSvg();
      });
      function handleAfterEnter() {
        if (isFunction(opened)) {
          opened();
        }
      }
      function handleAfterLeave() {
        if (isFunction(closed)) {
          closed();
        }
      }
      function buildSvg() {
        if (iconName.value !== "success" && iconName.value !== "warning" && iconName.value !== "info" && iconName.value !== "error")
          return;
        const iconSvg = toastIcon[iconName.value]();
        const iconSvgStr = `"data:image/svg+xml;base64,${encode(iconSvg)}"`;
        svgStr.value = iconSvgStr;
      }
      function reset(option) {
        show.value = isDef(option.show) ? option.show : false;
        if (show.value) {
          mergeOptionsWithProps(option, props);
        }
      }
      function mergeOptionsWithProps(option, props2) {
        iconName.value = isDef(option.iconName) ? option.iconName : props2.iconName;
        iconClass.value = isDef(option.iconClass) ? option.iconClass : props2.iconClass;
        msg.value = isDef(option.msg) ? option.msg : props2.msg;
        position.value = isDef(option.position) ? option.position : props2.position;
        zIndex.value = isDef(option.zIndex) ? option.zIndex : props2.zIndex;
        loadingType.value = isDef(option.loadingType) ? option.loadingType : props2.loadingType;
        loadingColor.value = isDef(option.loadingColor) ? option.loadingColor : props2.loadingColor;
        iconSize.value = isDef(option.iconSize) ? addUnit(option.iconSize) : isDef(props2.iconSize) ? addUnit(props2.iconSize) : void 0;
        loadingSize.value = isDef(option.loadingSize) ? addUnit(option.loadingSize) : isDef(props2.loadingSize) ? addUnit(props2.loadingSize) : void 0;
        cover.value = isDef(option.cover) ? option.cover : props2.cover;
        classPrefix.value = isDef(option.classPrefix) ? option.classPrefix : props2.classPrefix;
        direction.value = isDef(option.direction) ? option.direction : props2.direction;
        closed = isFunction(option.closed) ? option.closed : isFunction(props2.closed) ? props2.closed : null;
        opened = isFunction(option.opened) ? option.opened : isFunction(props2.opened) ? props2.opened : null;
      }
      const __returned__ = { props, iconName, msg, position, show, zIndex, loadingType, loadingColor, iconSize, loadingSize, svgStr, cover, classPrefix, iconClass, direction, get opened() {
        return opened;
      }, set opened(v) {
        opened = v;
      }, get closed() {
        return closed;
      }, set closed(v) {
        closed = v;
      }, toastOptionKey, toastOption, transitionStyle, rootClass, svgStyle, handleAfterEnter, handleAfterLeave, buildSvg, reset, mergeOptionsWithProps, wdIcon: __easycom_1$3, wdLoading, wdOverlay, wdTransition };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        $setup.cover ? (vue.openBlock(), vue.createBlock($setup["wdOverlay"], {
          key: 0,
          "z-index": $setup.zIndex,
          "lock-scroll": "",
          show: $setup.show,
          "custom-style": "background-color: transparent;pointer-events: auto;"
        }, null, 8, ["z-index", "show"])) : vue.createCommentVNode("v-if", true),
        vue.createVNode($setup["wdTransition"], {
          name: "fade",
          show: $setup.show,
          "custom-style": $setup.transitionStyle,
          onAfterEnter: $setup.handleAfterEnter,
          onAfterLeave: $setup.handleAfterLeave
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass($setup.rootClass)
              },
              [
                vue.createCommentVNode("iconName优先级更高"),
                $setup.iconName === "loading" ? (vue.openBlock(), vue.createBlock($setup["wdLoading"], {
                  key: 0,
                  type: $setup.loadingType,
                  color: $setup.loadingColor,
                  size: $setup.loadingSize,
                  "custom-class": `wd-toast__icon ${$setup.direction === "vertical" ? "is-vertical" : ""}`
                }, null, 8, ["type", "color", "size", "custom-class"])) : $setup.iconName === "success" || $setup.iconName === "warning" || $setup.iconName === "info" || $setup.iconName === "error" ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 1,
                    class: vue.normalizeClass(`wd-toast__iconWrap wd-toast__icon ${$setup.direction === "vertical" ? "is-vertical" : ""}`)
                  },
                  [
                    vue.createElementVNode("view", { class: "wd-toast__iconBox" }, [
                      vue.createElementVNode(
                        "view",
                        {
                          class: "wd-toast__iconSvg",
                          style: vue.normalizeStyle($setup.svgStyle)
                        },
                        null,
                        4
                        /* STYLE */
                      )
                    ])
                  ],
                  2
                  /* CLASS */
                )) : $setup.iconClass ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                  key: 2,
                  "custom-class": `wd-toast__icon ${$setup.direction === "vertical" ? "is-vertical" : ""}`,
                  size: $setup.iconSize,
                  "class-prefix": $setup.classPrefix,
                  name: $setup.iconClass
                }, null, 8, ["custom-class", "size", "class-prefix", "name"])) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode("文本"),
                $setup.msg ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 3,
                    class: "wd-toast__msg"
                  },
                  vue.toDisplayString($setup.msg),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            )
          ]),
          _: 1
          /* STABLE */
        }, 8, ["show", "custom-style"])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const __easycom_9$1 = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$E], ["__scopeId", "data-v-fce8c80a"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-toast/wd-toast.vue"]]);
  const __default__$p = {
    name: "wd-form",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$E = /* @__PURE__ */ vue.defineComponent({
    ...__default__$p,
    props: formProps,
    setup(__props, { expose: __expose }) {
      const { show: showToast2 } = useToast("wd-form-toast");
      const props = __props;
      const { children, linkChildren } = useChildren(FORM_KEY);
      let errorMessages = vue.reactive({});
      linkChildren({ props, errorMessages });
      vue.watch(
        () => props.model,
        () => {
          if (props.resetOnChange) {
            clearMessage();
          }
        },
        { immediate: true, deep: true }
      );
      async function validate(prop) {
        const errors = [];
        let valid = true;
        const promises = [];
        const formRules = getMergeRules();
        const propsToValidate = isArray(prop) ? prop : isDef(prop) ? [prop] : [];
        const rulesToValidate = propsToValidate.length > 0 ? propsToValidate.reduce((acc, key) => {
          if (formRules[key]) {
            acc[key] = formRules[key];
          }
          return acc;
        }, {}) : formRules;
        for (const propName in rulesToValidate) {
          const rules = rulesToValidate[propName];
          const value = getPropByPath(props.model, propName);
          if (rules && rules.length > 0) {
            for (const rule of rules) {
              if (rule.required && (!isDef(value) || value === "")) {
                errors.push({
                  prop: propName,
                  message: rule.message
                });
                valid = false;
                break;
              }
              if (rule.pattern && !rule.pattern.test(value)) {
                errors.push({
                  prop: propName,
                  message: rule.message
                });
                valid = false;
                break;
              }
              const { validator, ...ruleWithoutValidator } = rule;
              if (validator) {
                const result = validator(value, ruleWithoutValidator);
                if (isPromise(result)) {
                  promises.push(
                    result.then((res) => {
                      if (typeof res === "string") {
                        errors.push({
                          prop: propName,
                          message: res
                        });
                        valid = false;
                      } else if (typeof res === "boolean" && !res) {
                        errors.push({
                          prop: propName,
                          message: rule.message
                        });
                        valid = false;
                      }
                    }).catch((error) => {
                      const message = isDef(error) ? isString(error) ? error : error.message || rule.message : rule.message;
                      errors.push({ prop: propName, message });
                      valid = false;
                    })
                  );
                } else {
                  if (!result) {
                    errors.push({
                      prop: propName,
                      message: rule.message
                    });
                    valid = false;
                  }
                }
              }
            }
          }
        }
        await Promise.all(promises);
        showMessage(errors);
        if (valid) {
          if (propsToValidate.length) {
            propsToValidate.forEach(clearMessage);
          } else {
            clearMessage();
          }
        }
        return {
          valid,
          errors
        };
      }
      function getMergeRules() {
        const mergedRules = deepClone(props.rules);
        const childrenProps = children.map((child) => child.prop);
        Object.keys(mergedRules).forEach((key) => {
          if (!childrenProps.includes(key)) {
            delete mergedRules[key];
          }
        });
        children.forEach((item) => {
          if (isDef(item.prop) && isDef(item.rules) && item.rules.length) {
            if (mergedRules[item.prop]) {
              mergedRules[item.prop] = [...mergedRules[item.prop], ...item.rules];
            } else {
              mergedRules[item.prop] = item.rules;
            }
          }
        });
        return mergedRules;
      }
      function showMessage(errors) {
        const childrenProps = children.map((e) => e.prop).filter(Boolean);
        const messages2 = errors.filter((error) => error.message && childrenProps.includes(error.prop));
        if (messages2.length) {
          messages2.sort((a, b) => {
            return childrenProps.indexOf(a.prop) - childrenProps.indexOf(b.prop);
          });
          if (props.errorType === "toast") {
            showToast2(messages2[0].message);
          } else if (props.errorType === "message") {
            messages2.forEach((error) => {
              errorMessages[error.prop] = error.message;
            });
          }
        }
      }
      function clearMessage(prop) {
        if (prop) {
          errorMessages[prop] = "";
        } else {
          Object.keys(errorMessages).forEach((key) => {
            errorMessages[key] = "";
          });
        }
      }
      function reset() {
        clearMessage();
      }
      __expose({ validate, reset });
      const __returned__ = { showToast: showToast2, props, children, linkChildren, get errorMessages() {
        return errorMessages;
      }, set errorMessages(v) {
        errorMessages = v;
      }, validate, getMergeRules, showMessage, clearMessage, reset, wdToast: __easycom_9$1 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-form ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        $setup.props.errorType === "toast" ? (vue.openBlock(), vue.createBlock($setup["wdToast"], {
          key: 0,
          selector: "wd-form-toast"
        })) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$D], ["__scopeId", "data-v-6504e7d0"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-form/wd-form.vue"]]);
  const block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("render");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["render"] = "78afd58a";
  };
  const _sfc_main$D = {
    name: "wd-root-portal",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default");
  }
  if (typeof block0 === "function")
    block0(_sfc_main$D);
  const wdRootPortal = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$C], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-root-portal/wd-root-portal.vue"]]);
  const popupProps = {
    ...baseProps,
    /**
     * 动画类型，参见 wd-transition 组件的name
     * 类型：string
     * 可选值：fade / fade-up / fade-down / fade-left / fade-right / slide-up / slide-down / slide-left / slide-right / zoom-in
     */
    transition: String,
    /**
     * 关闭按钮
     * 类型：boolean
     * 默认值：false
     */
    closable: makeBooleanProp(false),
    /**
     * 弹出框的位置
     * 类型：string
     * 默认值：center
     * 可选值：center / top / right / bottom / left
     */
    position: makeStringProp("center"),
    /**
     * 点击遮罩是否关闭
     * 类型：boolean
     * 默认值：true
     */
    closeOnClickModal: makeBooleanProp(true),
    /**
     * 动画持续时间
     * 类型：number | boolean
     * 默认值：300
     */
    duration: {
      type: [Number, Boolean],
      default: 300
    },
    /**
     * 是否显示遮罩
     * 类型：boolean
     * 默认值：true
     */
    modal: makeBooleanProp(true),
    /**
     * 设置层级
     * 类型：number
     * 默认值：10
     */
    zIndex: makeNumberProp(10),
    /**
     * 是否当关闭时将弹出层隐藏（display: none)
     * 类型：boolean
     * 默认值：true
     */
    hideWhenClose: makeBooleanProp(true),
    /**
     * 遮罩样式
     * 类型：string
     * 默认值：''
     */
    modalStyle: makeStringProp(""),
    /**
     * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
     * 类型：boolean
     * 默认值：false
     */
    safeAreaInsetBottom: makeBooleanProp(false),
    /**
     * 弹出层是否显示
     */
    modelValue: makeBooleanProp(false),
    /**
     * 弹层内容懒渲染，触发展示时才渲染内容
     * 类型：boolean
     * 默认值：true
     */
    lazyRender: makeBooleanProp(true),
    /**
     * 是否锁定滚动
     * 类型：boolean
     * 默认值：true
     */
    lockScroll: makeBooleanProp(true),
    /**
     * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
     * 类型：boolean
     * 默认值：false
     */
    rootPortal: makeBooleanProp(false)
  };
  const __default__$o = {
    name: "wd-popup",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$C = /* @__PURE__ */ vue.defineComponent({
    ...__default__$o,
    props: popupProps,
    emits: [
      "update:modelValue",
      "before-enter",
      "enter",
      "before-leave",
      "leave",
      "after-leave",
      "after-enter",
      "click-modal",
      "close"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const transitionName = vue.computed(() => {
        if (props.transition) {
          return props.transition;
        }
        if (props.position === "center") {
          return ["zoom-in", "fade"];
        }
        if (props.position === "left") {
          return "slide-left";
        }
        if (props.position === "right") {
          return "slide-right";
        }
        if (props.position === "bottom") {
          return "slide-up";
        }
        if (props.position === "top") {
          return "slide-down";
        }
        return "slide-up";
      });
      const safeBottom = vue.ref(0);
      const style = vue.computed(() => {
        return `z-index:${props.zIndex}; padding-bottom: ${safeBottom.value}px;${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-popup wd-popup--${props.position} ${!props.transition && props.position === "center" ? "is-deep" : ""} ${props.customClass || ""}`;
      });
      vue.onBeforeMount(() => {
        if (props.safeAreaInsetBottom) {
          const { safeArea, screenHeight, safeAreaInsets } = uni.getSystemInfoSync();
          if (safeArea) {
            safeBottom.value = safeAreaInsets ? safeAreaInsets.bottom : 0;
          } else {
            safeBottom.value = 0;
          }
        }
      });
      function handleClickModal() {
        emit("click-modal");
        if (props.closeOnClickModal) {
          close();
        }
      }
      function close() {
        emit("close");
        emit("update:modelValue", false);
      }
      function noop() {
      }
      const __returned__ = { props, emit, transitionName, safeBottom, style, rootClass, handleClickModal, close, noop, wdIcon: __easycom_1$3, wdOverlay, wdTransition, wdRootPortal };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    return _ctx.rootPortal ? (vue.openBlock(), vue.createBlock($setup["wdRootPortal"], { key: 0 }, {
      default: vue.withCtx(() => [
        vue.createElementVNode("view", { class: "wd-popup-wrapper" }, [
          _ctx.modal ? (vue.openBlock(), vue.createBlock($setup["wdOverlay"], {
            key: 0,
            show: _ctx.modelValue,
            "z-index": _ctx.zIndex,
            "lock-scroll": _ctx.lockScroll,
            duration: _ctx.duration,
            "custom-style": _ctx.modalStyle,
            onClick: $setup.handleClickModal,
            onTouchmove: $setup.noop
          }, null, 8, ["show", "z-index", "lock-scroll", "duration", "custom-style"])) : vue.createCommentVNode("v-if", true),
          vue.createVNode($setup["wdTransition"], {
            "lazy-render": _ctx.lazyRender,
            "custom-class": $setup.rootClass,
            "custom-style": $setup.style,
            duration: _ctx.duration,
            show: _ctx.modelValue,
            name: $setup.transitionName,
            destroy: _ctx.hideWhenClose,
            onBeforeEnter: _cache[0] || (_cache[0] = ($event) => $setup.emit("before-enter")),
            onEnter: _cache[1] || (_cache[1] = ($event) => $setup.emit("enter")),
            onAfterEnter: _cache[2] || (_cache[2] = ($event) => $setup.emit("after-enter")),
            onBeforeLeave: _cache[3] || (_cache[3] = ($event) => $setup.emit("before-leave")),
            onLeave: _cache[4] || (_cache[4] = ($event) => $setup.emit("leave")),
            onAfterLeave: _cache[5] || (_cache[5] = ($event) => $setup.emit("after-leave"))
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
              _ctx.closable ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-popup__close",
                name: "add",
                onClick: $setup.close
              })) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
            /* FORWARDED */
          }, 8, ["lazy-render", "custom-class", "custom-style", "duration", "show", "name", "destroy"])
        ])
      ]),
      _: 3
      /* FORWARDED */
    })) : (vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      { key: 1 },
      [
        vue.createCommentVNode(" 非传送模式 "),
        vue.createElementVNode("view", { class: "wd-popup-wrapper" }, [
          _ctx.modal ? (vue.openBlock(), vue.createBlock($setup["wdOverlay"], {
            key: 0,
            show: _ctx.modelValue,
            "z-index": _ctx.zIndex,
            "lock-scroll": _ctx.lockScroll,
            duration: _ctx.duration,
            "custom-style": _ctx.modalStyle,
            onClick: $setup.handleClickModal,
            onTouchmove: $setup.noop
          }, null, 8, ["show", "z-index", "lock-scroll", "duration", "custom-style"])) : vue.createCommentVNode("v-if", true),
          vue.createVNode($setup["wdTransition"], {
            "lazy-render": _ctx.lazyRender,
            "custom-class": $setup.rootClass,
            "custom-style": $setup.style,
            duration: _ctx.duration,
            show: _ctx.modelValue,
            name: $setup.transitionName,
            destroy: _ctx.hideWhenClose,
            onBeforeEnter: _cache[6] || (_cache[6] = ($event) => $setup.emit("before-enter")),
            onEnter: _cache[7] || (_cache[7] = ($event) => $setup.emit("enter")),
            onAfterEnter: _cache[8] || (_cache[8] = ($event) => $setup.emit("after-enter")),
            onBeforeLeave: _cache[9] || (_cache[9] = ($event) => $setup.emit("before-leave")),
            onLeave: _cache[10] || (_cache[10] = ($event) => $setup.emit("leave")),
            onAfterLeave: _cache[11] || (_cache[11] = ($event) => $setup.emit("after-leave"))
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
              _ctx.closable ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-popup__close",
                name: "add",
                onClick: $setup.close
              })) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
            /* FORWARDED */
          }, 8, ["lazy-render", "custom-class", "custom-style", "duration", "show", "name", "destroy"])
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    ));
  }
  const __easycom_13 = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$B], ["__scopeId", "data-v-25a8a9f7"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-popup/wd-popup.vue"]]);
  const notifyProps = {
    /**
     * 类型，可选值为 primary success danger warning
     */
    type: makeStringProp("danger"),
    /**
     * 字体颜色
     */
    color: makeStringProp(""),
    /**
     * 将组件的 z-index 层级设置为一个固定值
     */
    zIndex: makeNumberProp(99),
    /**
     * 显示
     */
    visible: makeBooleanProp(false),
    /**
     * 展示文案，支持通过\n换行
     */
    message: makeNumericProp(""),
    /**
     * 指定唯一标识
     */
    selector: makeStringProp(""),
    /**
     * 展示时长(ms)，值为 0 时，notify 不会消失
     */
    duration: makeNumberProp(3e3),
    /**
     * 弹出位置，可选值为 top bottom
     */
    position: makeStringProp("top"),
    /**
     * 顶部安全高度（
     */
    safeHeight: Number,
    /**
     * 背景颜色
     */
    background: makeStringProp(""),
    /**
     * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
     */
    rootPortal: makeBooleanProp(false)
  };
  let timer;
  let currentOptions = getDefaultOptions();
  const notifyDefaultOptionKey = "__NOTIFY_OPTION__";
  const None$1 = Symbol("None");
  const useNotify = (selector = "") => {
    const notifyOptionKey = getNotifyOptionKey(selector);
    const notifyOption = vue.inject(notifyOptionKey, vue.ref(None$1));
    if (notifyOption.value === None$1) {
      notifyOption.value = currentOptions;
      vue.provide(notifyOptionKey, notifyOption);
    }
    const showNotify = (option) => {
      const options = deepMerge(currentOptions, isString(option) ? { message: option } : option);
      notifyOption.value = deepMerge(options, { visible: true });
      if (notifyOption.value.duration && notifyOption.value.duration > 0) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => closeNotify(), options.duration);
      }
    };
    const closeNotify = () => {
      timer && clearTimeout(timer);
      if (notifyOption.value !== None$1) {
        notifyOption.value.visible = false;
      }
    };
    return {
      showNotify,
      closeNotify
    };
  };
  const getNotifyOptionKey = (selector) => {
    return selector ? `${notifyDefaultOptionKey}${selector}` : notifyDefaultOptionKey;
  };
  function getDefaultOptions() {
    return {
      type: "danger",
      color: void 0,
      zIndex: 99,
      message: "",
      duration: 3e3,
      position: "top",
      safeHeight: void 0,
      background: void 0,
      onClick: void 0,
      onClosed: void 0,
      onOpened: void 0
    };
  }
  const __default__$n = {
    name: "wd-notify",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$B = /* @__PURE__ */ vue.defineComponent({
    ...__default__$n,
    props: notifyProps,
    emits: ["update:visible", "click", "closed", "opened"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emits = __emit;
      const state = vue.inject(getNotifyOptionKey(props.selector), vue.ref(props));
      const customStyle = vue.computed(() => {
        const { safeHeight, position } = state.value;
        let customStyle2 = "";
        switch (position) {
          case "top":
            customStyle2 = `top: calc(var(--window-top) + ${addUnit(safeHeight || 0)})`;
            break;
          case "bottom":
            customStyle2 = "bottom: var(--window-bottom)";
            break;
        }
        return customStyle2;
      });
      const onClick = (event) => {
        if (isFunction(state.value.onClick))
          return state.value.onClick(event);
        emits("click", event);
      };
      const onClosed = () => {
        if (isFunction(state.value.onClosed))
          return state.value.onClosed();
        emits("closed");
      };
      const onOpened = () => {
        if (isFunction(state.value.onOpened))
          return state.value.onOpened();
        emits("opened");
      };
      vue.watch(
        () => state.value.visible,
        (visible) => {
          emits("update:visible", visible);
        },
        { deep: true }
      );
      const __returned__ = { props, emits, state, customStyle, onClick, onClosed, onOpened, wdPopup: __easycom_13 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock($setup["wdPopup"], {
      modelValue: $setup.state.visible,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.visible = $event),
      "custom-style": $setup.customStyle,
      position: $setup.state.position,
      "z-index": $setup.state.zIndex,
      duration: 250,
      modal: false,
      "root-portal": $setup.state.rootPortal,
      onLeave: $setup.onClosed,
      onEnter: $setup.onOpened
    }, {
      default: vue.withCtx(() => [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["wd-notify", [`wd-notify--${$setup.state.type}`]]),
            style: vue.normalizeStyle({ color: $setup.state.color, background: $setup.state.background }),
            onClick: $setup.onClick
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(
                vue.toDisplayString($setup.state.message),
                1
                /* TEXT */
              )
            ], true)
          ],
          6
          /* CLASS, STYLE */
        )
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["modelValue", "custom-style", "position", "z-index", "root-portal"]);
  }
  const __easycom_4$1 = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$A], ["__scopeId", "data-v-a92d61e2"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-notify/wd-notify.vue"]]);
  const messageDefaultOptionKey = "__MESSAGE_OPTION__";
  const None = Symbol("None");
  const defaultOptions = {
    title: "",
    showCancelButton: false,
    show: false,
    closeOnClickModal: true,
    msg: "",
    type: "alert",
    inputType: "text",
    inputValue: "",
    showErr: false,
    zIndex: 99,
    lazyRender: true,
    inputError: ""
  };
  function useMessage(selector = "") {
    const messageOptionKey = selector ? messageDefaultOptionKey + selector : messageDefaultOptionKey;
    const messageOption = vue.inject(messageOptionKey, vue.ref(None));
    if (messageOption.value === None) {
      messageOption.value = defaultOptions;
      vue.provide(messageOptionKey, messageOption);
    }
    const createMethod = (type) => {
      return (options) => {
        const messageOptions = deepMerge({ type }, typeof options === "string" ? { title: options } : options);
        if (messageOptions.type === "confirm" || messageOptions.type === "prompt") {
          messageOptions.showCancelButton = true;
        } else {
          messageOptions.showCancelButton = false;
        }
        return show(messageOptions);
      };
    };
    const show = (option) => {
      return new Promise((resolve, reject) => {
        const options = deepMerge(defaultOptions, typeof option === "string" ? { title: option } : option);
        messageOption.value = deepMerge(options, {
          show: true,
          success: (res) => {
            close();
            resolve(res);
          },
          fail: (res) => {
            close();
            reject(res);
          }
        });
      });
    };
    const alert = createMethod("alert");
    const confirm = createMethod("confirm");
    const prompt = createMethod("prompt");
    const close = () => {
      if (messageOption.value !== None) {
        messageOption.value.show = false;
      }
    };
    return {
      show,
      alert,
      confirm,
      prompt,
      close
    };
  }
  const getMessageDefaultOptionKey = (selector) => {
    return selector ? `${messageDefaultOptionKey}${selector}` : messageDefaultOptionKey;
  };
  const UPLOAD_STATUS = {
    PENDING: "pending",
    LOADING: "loading",
    SUCCESS: "success",
    FAIL: "fail"
  };
  function useUpload() {
    let currentTask = null;
    const abort = (task) => {
      if (task) {
        task.abort();
      } else if (currentTask) {
        currentTask.abort();
        currentTask = null;
      }
    };
    const defaultUpload = (file, formData, options) => {
      if (options.abortPrevious) {
        abort();
      }
      const uploadTask = uni.uploadFile({
        url: options.action,
        header: options.header,
        name: options.name,
        fileName: options.name,
        fileType: options.fileType,
        formData,
        filePath: file.url,
        success(res) {
          if (res.statusCode === options.statusCode) {
            options.onSuccess(res, file, formData);
          } else {
            options.onError({ ...res, errMsg: res.errMsg || "" }, file, formData);
          }
        },
        fail(err) {
          options.onError(err, file, formData);
        }
      });
      currentTask = uploadTask;
      uploadTask.onProgressUpdate((res) => {
        options.onProgress(res, file);
      });
      return uploadTask;
    };
    const startUpload = (file, options) => {
      const {
        uploadMethod,
        formData = {},
        action,
        name = "file",
        header = {},
        fileType = "image",
        statusCode = 200,
        statusKey = "status",
        abortPrevious = false
      } = options;
      file[statusKey] = UPLOAD_STATUS.LOADING;
      const uploadOptions = {
        action,
        header,
        name,
        fileName: name,
        fileType,
        statusCode,
        abortPrevious,
        onSuccess: (res, file2, formData2) => {
          var _a;
          file2[statusKey] = UPLOAD_STATUS.SUCCESS;
          currentTask = null;
          (_a = options.onSuccess) == null ? void 0 : _a.call(options, res, file2, formData2);
        },
        onError: (error, file2, formData2) => {
          var _a;
          file2[statusKey] = UPLOAD_STATUS.FAIL;
          file2.error = error.errMsg;
          currentTask = null;
          (_a = options.onError) == null ? void 0 : _a.call(options, error, file2, formData2);
        },
        onProgress: (res, file2) => {
          var _a;
          file2.percent = res.progress;
          (_a = options.onProgress) == null ? void 0 : _a.call(options, res, file2);
        }
      };
      if (isFunction(uploadMethod)) {
        return uploadMethod(file, formData, uploadOptions);
      } else {
        return defaultUpload(file, formData, uploadOptions);
      }
    };
    function formatImage(res) {
      if (isArray(res.tempFiles)) {
        return res.tempFiles.map((item) => ({
          path: item.path || "",
          name: item.name || "",
          size: item.size,
          type: "image",
          thumb: item.path || ""
        }));
      }
      return [
        {
          path: res.tempFiles.path || "",
          name: res.tempFiles.name || "",
          size: res.tempFiles.size,
          type: "image",
          thumb: res.tempFiles.path || ""
        }
      ];
    }
    function formatVideo(res) {
      return [
        {
          path: res.tempFilePath || res.filePath || "",
          name: res.name || "",
          size: res.size,
          type: "video",
          thumb: res.thumbTempFilePath || "",
          duration: res.duration
        }
      ];
    }
    function chooseFile({
      multiple,
      sizeType,
      sourceType,
      maxCount,
      accept,
      compressed,
      maxDuration,
      camera,
      extension
    }) {
      return new Promise((resolve, reject) => {
        switch (accept) {
          case "image":
            uni.chooseImage({
              count: multiple ? maxCount : 1,
              sizeType,
              sourceType,
              success: (res) => resolve(formatImage(res)),
              fail: reject
            });
            break;
          case "video":
            uni.chooseVideo({
              sourceType,
              compressed,
              maxDuration,
              camera,
              success: (res) => resolve(formatVideo(res)),
              fail: reject
            });
            break;
          case "all":
            break;
          default:
            uni.chooseImage({
              count: multiple ? maxCount : 1,
              sizeType,
              sourceType,
              success: (res) => resolve(formatImage(res)),
              fail: reject
            });
            break;
        }
      });
    }
    return {
      startUpload,
      abort,
      UPLOAD_STATUS,
      chooseFile
    };
  }
  var SECONDS_A_MINUTE = 60;
  var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
  var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
  var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
  var MILLISECONDS_A_SECOND = 1e3;
  var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
  var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;
  var MS = "millisecond";
  var S = "second";
  var MIN = "minute";
  var H = "hour";
  var D = "day";
  var W = "week";
  var M = "month";
  var Q = "quarter";
  var Y = "year";
  var DATE = "date";
  var FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ";
  var INVALID_DATE_STRING = "Invalid Date";
  var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
  var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
  const en = {
    name: "en",
    weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    ordinal: function ordinal(n) {
      var s = ["th", "st", "nd", "rd"];
      var v = n % 100;
      return "[" + n + (s[(v - 20) % 10] || s[v] || s[0]) + "]";
    }
  };
  var padStart = function padStart2(string, length, pad) {
    var s = String(string);
    if (!s || s.length >= length)
      return string;
    return "" + Array(length + 1 - s.length).join(pad) + string;
  };
  var padZoneStr = function padZoneStr2(instance) {
    var negMinutes = -instance.utcOffset();
    var minutes = Math.abs(negMinutes);
    var hourOffset = Math.floor(minutes / 60);
    var minuteOffset = minutes % 60;
    return (negMinutes <= 0 ? "+" : "-") + padStart(hourOffset, 2, "0") + ":" + padStart(minuteOffset, 2, "0");
  };
  var monthDiff = function monthDiff2(a, b) {
    if (a.date() < b.date())
      return -monthDiff2(b, a);
    var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
    var anchor = a.clone().add(wholeMonthDiff, M);
    var c = b - anchor < 0;
    var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M);
    return +(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)) || 0);
  };
  var absFloor = function absFloor2(n) {
    return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
  };
  var prettyUnit = function prettyUnit2(u) {
    var special = {
      M,
      y: Y,
      w: W,
      d: D,
      D: DATE,
      h: H,
      m: MIN,
      s: S,
      ms: MS,
      Q
    };
    return special[u] || String(u || "").toLowerCase().replace(/s$/, "");
  };
  var isUndefined = function isUndefined2(s) {
    return s === void 0;
  };
  const U = {
    s: padStart,
    z: padZoneStr,
    m: monthDiff,
    a: absFloor,
    p: prettyUnit,
    u: isUndefined
  };
  var L = "en";
  var Ls = {};
  Ls[L] = en;
  var IS_DAYJS = "$isDayjsObject";
  var isDayjs = function isDayjs2(d) {
    return d instanceof Dayjs || !!(d && d[IS_DAYJS]);
  };
  var parseLocale = function parseLocale2(preset, object, isLocal) {
    var l;
    if (!preset)
      return L;
    if (typeof preset === "string") {
      var presetLower = preset.toLowerCase();
      if (Ls[presetLower]) {
        l = presetLower;
      }
      if (object) {
        Ls[presetLower] = object;
        l = presetLower;
      }
      var presetSplit = preset.split("-");
      if (!l && presetSplit.length > 1) {
        return parseLocale2(presetSplit[0]);
      }
    } else {
      var name = preset.name;
      Ls[name] = preset;
      l = name;
    }
    if (!isLocal && l)
      L = l;
    return l || !isLocal && L;
  };
  var dayjs = function dayjs2(date, c) {
    if (isDayjs(date)) {
      return date.clone();
    }
    var cfg = typeof c === "object" ? c : {};
    cfg.date = date;
    cfg.args = arguments;
    return new Dayjs(cfg);
  };
  var wrapper = function wrapper2(date, instance) {
    return dayjs(date, {
      locale: instance.$L,
      utc: instance.$u,
      x: instance.$x,
      $offset: instance.$offset
      // todo: refactor; do not use this.$offset in you code
    });
  };
  var Utils = U;
  Utils.l = parseLocale;
  Utils.i = isDayjs;
  Utils.w = wrapper;
  var parseDate = function parseDate2(cfg) {
    var date = cfg.date, utc = cfg.utc;
    if (date === null)
      return /* @__PURE__ */ new Date(NaN);
    if (Utils.u(date))
      return /* @__PURE__ */ new Date();
    if (date instanceof Date)
      return new Date(date);
    if (typeof date === "string" && !/Z$/i.test(date)) {
      var d = date.match(REGEX_PARSE);
      if (d) {
        var m = d[2] - 1 || 0;
        var ms = (d[7] || "0").substring(0, 3);
        if (utc) {
          return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
        }
        return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
      }
    }
    return new Date(date);
  };
  var Dayjs = /* @__PURE__ */ function() {
    function Dayjs2(cfg) {
      this.$L = parseLocale(cfg.locale, null, true);
      this.parse(cfg);
      this.$x = this.$x || cfg.x || {};
      this[IS_DAYJS] = true;
    }
    var _proto = Dayjs2.prototype;
    _proto.parse = function parse(cfg) {
      this.$d = parseDate(cfg);
      this.init();
    };
    _proto.init = function init() {
      var $d = this.$d;
      this.$y = $d.getFullYear();
      this.$M = $d.getMonth();
      this.$D = $d.getDate();
      this.$W = $d.getDay();
      this.$H = $d.getHours();
      this.$m = $d.getMinutes();
      this.$s = $d.getSeconds();
      this.$ms = $d.getMilliseconds();
    };
    _proto.$utils = function $utils() {
      return Utils;
    };
    _proto.isValid = function isValid() {
      return !(this.$d.toString() === INVALID_DATE_STRING);
    };
    _proto.isSame = function isSame(that, units) {
      var other = dayjs(that);
      return this.startOf(units) <= other && other <= this.endOf(units);
    };
    _proto.isAfter = function isAfter(that, units) {
      return dayjs(that) < this.startOf(units);
    };
    _proto.isBefore = function isBefore(that, units) {
      return this.endOf(units) < dayjs(that);
    };
    _proto.$g = function $g(input, get, set) {
      if (Utils.u(input))
        return this[get];
      return this.set(set, input);
    };
    _proto.unix = function unix() {
      return Math.floor(this.valueOf() / 1e3);
    };
    _proto.valueOf = function valueOf() {
      return this.$d.getTime();
    };
    _proto.startOf = function startOf(units, _startOf) {
      var _this = this;
      var isStartOf = !Utils.u(_startOf) ? _startOf : true;
      var unit = Utils.p(units);
      var instanceFactory = function instanceFactory2(d, m) {
        var ins = Utils.w(_this.$u ? Date.UTC(_this.$y, m, d) : new Date(_this.$y, m, d), _this);
        return isStartOf ? ins : ins.endOf(D);
      };
      var instanceFactorySet = function instanceFactorySet2(method, slice) {
        var argumentStart = [0, 0, 0, 0];
        var argumentEnd = [23, 59, 59, 999];
        return Utils.w(_this.toDate()[method].apply(
          // eslint-disable-line prefer-spread
          _this.toDate("s"),
          (isStartOf ? argumentStart : argumentEnd).slice(slice)
        ), _this);
      };
      var $W = this.$W, $M = this.$M, $D = this.$D;
      var utcPad = "set" + (this.$u ? "UTC" : "");
      switch (unit) {
        case Y:
          return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
        case M:
          return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
        case W: {
          var weekStart = this.$locale().weekStart || 0;
          var gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
          return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
        }
        case D:
        case DATE:
          return instanceFactorySet(utcPad + "Hours", 0);
        case H:
          return instanceFactorySet(utcPad + "Minutes", 1);
        case MIN:
          return instanceFactorySet(utcPad + "Seconds", 2);
        case S:
          return instanceFactorySet(utcPad + "Milliseconds", 3);
        default:
          return this.clone();
      }
    };
    _proto.endOf = function endOf(arg) {
      return this.startOf(arg, false);
    };
    _proto.$set = function $set(units, _int) {
      var _C$D$C$DATE$C$M$C$Y$C;
      var unit = Utils.p(units);
      var utcPad = "set" + (this.$u ? "UTC" : "");
      var name = (_C$D$C$DATE$C$M$C$Y$C = {}, _C$D$C$DATE$C$M$C$Y$C[D] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[DATE] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[M] = utcPad + "Month", _C$D$C$DATE$C$M$C$Y$C[Y] = utcPad + "FullYear", _C$D$C$DATE$C$M$C$Y$C[H] = utcPad + "Hours", _C$D$C$DATE$C$M$C$Y$C[MIN] = utcPad + "Minutes", _C$D$C$DATE$C$M$C$Y$C[S] = utcPad + "Seconds", _C$D$C$DATE$C$M$C$Y$C[MS] = utcPad + "Milliseconds", _C$D$C$DATE$C$M$C$Y$C)[unit];
      var arg = unit === D ? this.$D + (_int - this.$W) : _int;
      if (unit === M || unit === Y) {
        var date = this.clone().set(DATE, 1);
        date.$d[name](arg);
        date.init();
        this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
      } else if (name)
        this.$d[name](arg);
      this.init();
      return this;
    };
    _proto.set = function set(string, _int2) {
      return this.clone().$set(string, _int2);
    };
    _proto.get = function get(unit) {
      return this[Utils.p(unit)]();
    };
    _proto.add = function add(number, units) {
      var _this2 = this, _C$MIN$C$H$C$S$unit;
      number = Number(number);
      var unit = Utils.p(units);
      var instanceFactorySet = function instanceFactorySet2(n) {
        var d = dayjs(_this2);
        return Utils.w(d.date(d.date() + Math.round(n * number)), _this2);
      };
      if (unit === M) {
        return this.set(M, this.$M + number);
      }
      if (unit === Y) {
        return this.set(Y, this.$y + number);
      }
      if (unit === D) {
        return instanceFactorySet(1);
      }
      if (unit === W) {
        return instanceFactorySet(7);
      }
      var step = (_C$MIN$C$H$C$S$unit = {}, _C$MIN$C$H$C$S$unit[MIN] = MILLISECONDS_A_MINUTE, _C$MIN$C$H$C$S$unit[H] = MILLISECONDS_A_HOUR, _C$MIN$C$H$C$S$unit[S] = MILLISECONDS_A_SECOND, _C$MIN$C$H$C$S$unit)[unit] || 1;
      var nextTimeStamp = this.$d.getTime() + number * step;
      return Utils.w(nextTimeStamp, this);
    };
    _proto.subtract = function subtract(number, string) {
      return this.add(number * -1, string);
    };
    _proto.format = function format(formatStr) {
      var _this3 = this;
      var locale = this.$locale();
      if (!this.isValid())
        return locale.invalidDate || INVALID_DATE_STRING;
      var str = formatStr || FORMAT_DEFAULT;
      var zoneStr = Utils.z(this);
      var $H = this.$H, $m = this.$m, $M = this.$M;
      var weekdays = locale.weekdays, months = locale.months, meridiem = locale.meridiem;
      var getShort = function getShort2(arr, index, full, length) {
        return arr && (arr[index] || arr(_this3, str)) || full[index].slice(0, length);
      };
      var get$H = function get$H2(num) {
        return Utils.s($H % 12 || 12, num, "0");
      };
      var meridiemFunc = meridiem || function(hour, minute, isLowercase) {
        var m = hour < 12 ? "AM" : "PM";
        return isLowercase ? m.toLowerCase() : m;
      };
      var matches = function matches2(match) {
        switch (match) {
          case "YY":
            return String(_this3.$y).slice(-2);
          case "YYYY":
            return Utils.s(_this3.$y, 4, "0");
          case "M":
            return $M + 1;
          case "MM":
            return Utils.s($M + 1, 2, "0");
          case "MMM":
            return getShort(locale.monthsShort, $M, months, 3);
          case "MMMM":
            return getShort(months, $M);
          case "D":
            return _this3.$D;
          case "DD":
            return Utils.s(_this3.$D, 2, "0");
          case "d":
            return String(_this3.$W);
          case "dd":
            return getShort(locale.weekdaysMin, _this3.$W, weekdays, 2);
          case "ddd":
            return getShort(locale.weekdaysShort, _this3.$W, weekdays, 3);
          case "dddd":
            return weekdays[_this3.$W];
          case "H":
            return String($H);
          case "HH":
            return Utils.s($H, 2, "0");
          case "h":
            return get$H(1);
          case "hh":
            return get$H(2);
          case "a":
            return meridiemFunc($H, $m, true);
          case "A":
            return meridiemFunc($H, $m, false);
          case "m":
            return String($m);
          case "mm":
            return Utils.s($m, 2, "0");
          case "s":
            return String(_this3.$s);
          case "ss":
            return Utils.s(_this3.$s, 2, "0");
          case "SSS":
            return Utils.s(_this3.$ms, 3, "0");
          case "Z":
            return zoneStr;
        }
        return null;
      };
      return str.replace(REGEX_FORMAT, function(match, $1) {
        return $1 || matches(match) || zoneStr.replace(":", "");
      });
    };
    _proto.utcOffset = function utcOffset() {
      return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
    };
    _proto.diff = function diff(input, units, _float) {
      var _this4 = this;
      var unit = Utils.p(units);
      var that = dayjs(input);
      var zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
      var diff2 = this - that;
      var getMonth = function getMonth2() {
        return Utils.m(_this4, that);
      };
      var result;
      switch (unit) {
        case Y:
          result = getMonth() / 12;
          break;
        case M:
          result = getMonth();
          break;
        case Q:
          result = getMonth() / 3;
          break;
        case W:
          result = (diff2 - zoneDelta) / MILLISECONDS_A_WEEK;
          break;
        case D:
          result = (diff2 - zoneDelta) / MILLISECONDS_A_DAY;
          break;
        case H:
          result = diff2 / MILLISECONDS_A_HOUR;
          break;
        case MIN:
          result = diff2 / MILLISECONDS_A_MINUTE;
          break;
        case S:
          result = diff2 / MILLISECONDS_A_SECOND;
          break;
        default:
          result = diff2;
          break;
      }
      return _float ? result : Utils.a(result);
    };
    _proto.daysInMonth = function daysInMonth() {
      return this.endOf(M).$D;
    };
    _proto.$locale = function $locale() {
      return Ls[this.$L];
    };
    _proto.locale = function locale(preset, object) {
      if (!preset)
        return this.$L;
      var that = this.clone();
      var nextLocaleName = parseLocale(preset, object, true);
      if (nextLocaleName)
        that.$L = nextLocaleName;
      return that;
    };
    _proto.clone = function clone() {
      return Utils.w(this.$d, this);
    };
    _proto.toDate = function toDate() {
      return new Date(this.valueOf());
    };
    _proto.toJSON = function toJSON() {
      return this.isValid() ? this.toISOString() : null;
    };
    _proto.toISOString = function toISOString() {
      return this.$d.toISOString();
    };
    _proto.toString = function toString() {
      return this.$d.toUTCString();
    };
    return Dayjs2;
  }();
  var proto = Dayjs.prototype;
  dayjs.prototype = proto;
  [["$ms", MS], ["$s", S], ["$m", MIN], ["$H", H], ["$W", D], ["$M", M], ["$y", Y], ["$D", DATE]].forEach(function(g) {
    proto[g[1]] = function(input) {
      return this.$g(input, g[0], g[1]);
    };
  });
  dayjs.extend = function(plugin, option) {
    if (!plugin.$i) {
      plugin(option, Dayjs, dayjs);
      plugin.$i = true;
    }
    return dayjs;
  };
  dayjs.locale = parseLocale;
  dayjs.isDayjs = isDayjs;
  dayjs.unix = function(timestamp) {
    return dayjs(timestamp * 1e3);
  };
  dayjs.en = Ls[L];
  dayjs.Ls = Ls;
  dayjs.p = {};
  const MESSAGE_TYPE = {
    SUCCESS: "success",
    ERROR: "error",
    WARNING: "warning",
    INFO: "info"
  };
  function showToast(message, type = MESSAGE_TYPE.INFO, duration = 2e3) {
    let icon = "none";
    if (type === MESSAGE_TYPE.SUCCESS) {
      icon = "success";
    } else if (type === MESSAGE_TYPE.ERROR) {
      icon = "none";
    } else if (type === MESSAGE_TYPE.WARNING) {
      icon = "none";
    }
    return new Promise((resolve) => {
      uni.showToast({
        title: message,
        icon,
        duration,
        mask: true,
        success: () => {
          setTimeout(() => {
            resolve();
          }, duration);
        }
      });
    });
  }
  function showSuccess(message, duration = 2e3) {
    return showToast(message, MESSAGE_TYPE.SUCCESS, duration);
  }
  function showLoading(message = "加载中...") {
    uni.showLoading({
      title: message,
      mask: true
    });
  }
  function hideLoading() {
    uni.hideLoading();
  }
  const config = {
    baseURL: "http://540qgmj80458.vicp.fun",
    mesUser: "hzsmt-user",
    mesFile: "mes-file",
    mesMessage: "mes-message",
    mesMain: "mes-main",
    mesMonitor: "wqmes-equipment-monitor",
    kanbanSystem: "mes-kanban"
  };
  const TOKEN_KEY = "auth_token";
  function getToken() {
    return uni.getStorageSync(TOKEN_KEY);
  }
  function setToken(token) {
    uni.setStorageSync(TOKEN_KEY, token);
  }
  function removeToken() {
    uni.removeStorageSync(TOKEN_KEY);
  }
  function isLoggedIn() {
    return !!getToken();
  }
  function navigateToLogin() {
    removeToken();
    uni.navigateTo({
      url: "/pages/login/login"
    });
  }
  function request(options) {
    return new Promise((resolve, reject) => {
      if (options.needAuth && !isLoggedIn()) {
        navigateToLogin();
        return reject(new Error("未登录"));
      }
      if (options.loading) {
        showLoading(options.loadingText || "加载中...");
      }
      const defaultOptions2 = {
        url: "",
        method: "GET",
        data: {},
        header: {
          "Content-Type": "application/json",
          From: "web"
        },
        needAuth: true,
        loading: true,
        showError: true,
        timeout: 3e4,
        // 默认超时时间10秒
        baseURL: config.baseURL
        // 使用配置中的基础URL
      };
      const mergedOptions = {
        ...defaultOptions2,
        ...options,
        url: options.baseURL || defaultOptions2.baseURL + options.url
      };
      if (mergedOptions.needAuth) {
        mergedOptions.header["Authorization"] = getToken();
      }
      uni.request({
        ...mergedOptions,
        success: (res) => {
          if (mergedOptions.loading) {
            hideLoading();
          }
          if (res.statusCode === 200) {
            if (res.data.code === 200) {
              resolve(res.data.data);
            } else if (res.data.code === 401) {
              navigateToLogin();
              reject(new Error(res.data.message || "请先登录"));
            } else {
              if (mergedOptions.showError) {
                showToast(res.data.message || "操作失败", "error");
              }
              reject(new Error(res.data.message || "请求失败"));
            }
          } else {
            formatAppLog("log", "at utils/request.js:96", res);
            formatAppLog("log", "at utils/request.js:97", defaultOptions2.baseURL + options.url);
            if (mergedOptions.showError) {
              showToast(`请求错误 ${res.statusCode}`, "error");
            }
            reject(new Error(`请求错误 ${res.statusCode}`));
          }
        },
        fail: (err) => {
          formatAppLog("log", "at utils/request.js:105", err);
          if (mergedOptions.loading) {
            hideLoading();
          }
          let errorMsg = "网络连接失败";
          if (err.errMsg.includes("timeout")) {
            errorMsg = "请求超时，请重试";
          }
          if (mergedOptions.showError) {
            showToast(errorMsg, "error");
          }
          reject(err);
        }
      });
    });
  }
  function flattenTree(nodes, childrenKey = "children") {
    const result = [];
    function processNode(node) {
      const { [childrenKey]: _, ...flatNode } = node;
      result.push(flatNode);
      if (node[childrenKey] && Array.isArray(node[childrenKey])) {
        node[childrenKey].forEach(processNode);
      }
    }
    if (Array.isArray(nodes)) {
      nodes.forEach(processNode);
    } else if (nodes) {
      processNode(nodes);
    }
    return result;
  }
  const USER_INFO_KEY = "user_info";
  function getUserInfo() {
    const info = uni.getStorageSync(USER_INFO_KEY);
    return info ? JSON.parse(info) : null;
  }
  function setUserInfo(userInfo) {
    uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
  }
  function clearUserInfo() {
    uni.removeStorageSync(USER_INFO_KEY);
  }
  function formatDate(date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  function base64ToFile(base64Data, filename) {
    const byteString = atob(base64Data.split(",")[1]);
    const mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], filename, { type: mimeString });
    return file;
  }
  const _sfc_main$A = /* @__PURE__ */ vue.defineComponent({
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const { showNotify, closeNotify } = useNotify();
      const model = vue.reactive({
        loginName: "",
        password: ""
      });
      const form = vue.ref();
      const loading = vue.ref(false);
      function handleSubmit() {
        form.value.validate().then(({ valid, errors }) => {
          if (valid) {
            loading.value = true;
            request({
              url: `/${config.mesUser}/sys/user/authenticate`,
              // 拼接URL: /mes-main/api/data
              data: model,
              needAuth: false,
              method: "POST"
            }).then(({ user, Authorization }) => {
              showNotify({ type: "success", message: "登录成功" });
              setUserInfo(user);
              setToken(Authorization);
              uni.redirectTo({
                url: "/pages/inspectionTask/inspectionTask"
              });
            }).finally(() => {
              loading.value = false;
            });
          }
        }).catch((error) => {
          formatAppLog("log", "at pages/login/login.vue:66", error, "error");
        });
      }
      const __returned__ = { showNotify, closeNotify, model, form, loading, handleSubmit };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_input = resolveEasycom(vue.resolveDynamicComponent("wd-input"), __easycom_2$1);
    const _component_wd_cell_group = resolveEasycom(vue.resolveDynamicComponent("wd-cell-group"), __easycom_3$1);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_6);
    const _component_wd_form = resolveEasycom(vue.resolveDynamicComponent("wd-form"), __easycom_7);
    const _component_wd_notify = resolveEasycom(vue.resolveDynamicComponent("wd-notify"), __easycom_4$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-view" }, [
      vue.createVNode(_component_wd_form, {
        ref: "form",
        model: $setup.model
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_wd_cell_group, { border: "" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_wd_input, {
                label: "用户名",
                "label-width": "100px",
                prop: "loginName",
                clearable: "",
                modelValue: $setup.model.loginName,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.model.loginName = $event),
                placeholder: "请输入用户名",
                rules: [{ required: true, message: "请填写用户名" }]
              }, null, 8, ["modelValue"]),
              vue.createVNode(_component_wd_input, {
                label: "密码",
                "label-width": "100px",
                prop: "password",
                "show-password": "",
                clearable: "",
                modelValue: $setup.model.password,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.model.password = $event),
                placeholder: "请输入密码",
                rules: [{ required: true, message: "请填写密码" }]
              }, null, 8, ["modelValue"])
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createElementVNode("view", { class: "footer" }, [
            vue.createVNode(_component_wd_button, {
              type: "primary",
              size: "large",
              loading: $setup.loading,
              onClick: $setup.handleSubmit,
              block: ""
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("登录")
              ]),
              _: 1
              /* STABLE */
            }, 8, ["loading"])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["model"]),
      vue.createVNode(_component_wd_notify)
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$z], ["__file", "E:/开发/app/security-environment/pages/login/login.vue"]]);
  const pickerViewProps = {
    ...baseProps,
    /**
     * 加载状态
     */
    loading: makeBooleanProp(false),
    /**
     * 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写
     */
    loadingColor: makeStringProp("#4D80F0"),
    /**
     * picker内部滚筒高
     */
    columnsHeight: makeNumberProp(217),
    /**
     * 选项对象中，value对应的 key
     */
    valueKey: makeStringProp("value"),
    /**
     * 选项对象中，展示的文本对应的 key
     */
    labelKey: makeStringProp("label"),
    /**
     * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
     */
    immediateChange: makeBooleanProp(false),
    /**
     * 选中项，如果为多列选择器，则其类型应为数组
     */
    modelValue: {
      type: [String, Number, Boolean, Array, Array, Array],
      default: "",
      required: true
    },
    /**
     * 选择器数据，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多列选择器
     */
    columns: makeArrayProp(),
    /**
     * 接收 pickerView 实例、选中项、当前修改列的下标、resolve 作为入参，根据选中项和列下标进行判断，通过 pickerView 实例暴露出来的 setColumnData 方法修改其他列的数据源。
     */
    columnChange: Function
  };
  function formatArray(array, valueKey, labelKey) {
    let tempArray = isArray(array) ? array : [array];
    const firstLevelTypeList = new Set(array.map(getType));
    if (firstLevelTypeList.size !== 1 && firstLevelTypeList.has("object")) {
      throw Error("The columns are correct");
    }
    if (!isArray(array[0])) {
      tempArray = [tempArray];
    }
    const result = tempArray.map((col) => {
      return col.map((row) => {
        if (!isObj(row)) {
          return {
            [valueKey]: row,
            [labelKey]: row
          };
        }
        if (!row.hasOwnProperty(valueKey) && !row.hasOwnProperty(labelKey)) {
          throw Error("Can't find valueKey and labelKey in columns");
        }
        if (!row.hasOwnProperty(labelKey)) {
          row[labelKey] = row[valueKey];
        }
        if (!row.hasOwnProperty(valueKey)) {
          row[valueKey] = row[labelKey];
        }
        return row;
      });
    });
    return result;
  }
  const __default__$m = {
    name: "wd-picker-view",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$z = /* @__PURE__ */ vue.defineComponent({
    ...__default__$m,
    props: pickerViewProps,
    emits: ["change", "pickstart", "pickend", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const formatColumns = vue.ref([]);
      const itemHeight = vue.ref(35);
      const selectedIndex = vue.ref([]);
      vue.watch(
        [() => props.modelValue, () => props.columns],
        (newValue, oldValue) => {
          if (!isEqual(oldValue[1], newValue[1])) {
            if (isArray(newValue[1]) && newValue[1].length > 0) {
              formatColumns.value = formatArray(newValue[1], props.valueKey, props.labelKey);
            } else {
              formatColumns.value = [];
              selectedIndex.value = [];
            }
          }
          if (isDef(newValue[0])) {
            selectWithValue(newValue[0]);
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      const { proxy } = vue.getCurrentInstance();
      function selectWithValue(value) {
        if (formatColumns.value.length === 0) {
          selectedIndex.value = [];
          return;
        }
        if (value === "" || !isDef(value) || isArray(value) && value.length === 0) {
          value = formatColumns.value.map((col) => {
            return col[0][props.valueKey];
          });
        }
        const valueType = getType(value);
        const type = ["string", "number", "boolean", "array"];
        if (type.indexOf(valueType) === -1)
          formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-picker-view/wd-picker-view.vue:100", `value must be one of ${type.toString()}`);
        value = isArray(value) ? value : [value];
        value = value.slice(0, formatColumns.value.length);
        let selected = deepClone(selectedIndex.value);
        value.forEach((target, col) => {
          let row = formatColumns.value[col].findIndex((row2) => {
            return row2[props.valueKey].toString() === target.toString();
          });
          row = row === -1 ? 0 : row;
          selected = correctSelectedIndex(col, row, selected);
        });
        selectedIndex.value = selected.slice(0, value.length);
      }
      function correctSelected(value) {
        let selected = deepClone(value);
        value.forEach((row, col) => {
          row = range(row, 0, formatColumns.value[col].length - 1);
          selected = correctSelectedIndex(col, row, selected);
        });
        return selected;
      }
      function correctSelectedIndex(columnIndex, rowIndex, selected) {
        const col = formatColumns.value[columnIndex];
        if (!col || !col[rowIndex]) {
          throw Error(`The value to select with Col:${columnIndex} Row:${rowIndex} is incorrect`);
        }
        const select = deepClone(selected);
        select[columnIndex] = rowIndex;
        if (col[rowIndex].disabled) {
          const prev = col.slice(0, rowIndex).reverse().findIndex((s) => !s.disabled);
          const next = col.slice(rowIndex + 1).findIndex((s) => !s.disabled);
          if (prev !== -1) {
            select[columnIndex] = rowIndex - 1 - prev;
          } else if (next !== -1) {
            select[columnIndex] = rowIndex + 1 + next;
          } else if (select[columnIndex] === void 0) {
            select[columnIndex] = 0;
          }
        }
        return select;
      }
      function onChange({ detail: { value } }) {
        value = value.map((v) => {
          return Number(v || 0);
        });
        const index = getChangeDiff(value);
        selectedIndex.value = deepClone(value);
        vue.nextTick(() => {
          selectedIndex.value = correctSelected(value);
          if (props.columnChange) {
            if (props.columnChange.length < 4) {
              props.columnChange(proxy.$.exposed, getSelects(), index || 0, () => {
              });
              handleChange(index || 0);
            } else {
              props.columnChange(proxy.$.exposed, getSelects(), index || 0, () => {
                handleChange(index || 0);
              });
            }
          } else {
            handleChange(index || 0);
          }
        });
      }
      function getChangeColumn(now, origin) {
        if (!now || !origin)
          return -1;
        const index = now.findIndex((row, index2) => row !== origin[index2]);
        return index;
      }
      function getChangeDiff(value) {
        value = value.slice(0, formatColumns.value.length);
        const origin = deepClone(selectedIndex.value);
        let selected = deepClone(selectedIndex.value);
        value.forEach((row, col) => {
          row = range(row, 0, formatColumns.value[col].length - 1);
          if (row === origin[col])
            return;
          selected = correctSelectedIndex(col, row, selected);
        });
        const diffCol = getChangeColumn(selected, origin);
        if (diffCol === -1)
          return;
        const diffRow = selected[diffCol];
        return selected.length === 1 ? diffRow : diffCol;
      }
      function handleChange(index) {
        const value = getValues();
        if (isEqual(value, props.modelValue))
          return;
        emit("update:modelValue", value);
        setTimeout(() => {
          emit("change", {
            picker: proxy.$.exposed,
            value,
            index
          });
        }, 0);
      }
      function getSelects() {
        const selects = selectedIndex.value.map((row, col) => formatColumns.value[col][row]);
        if (selects.length === 1) {
          return selects[0];
        }
        return selects;
      }
      function getValues() {
        const { valueKey } = props;
        const values = selectedIndex.value.map((row, col) => {
          return formatColumns.value[col][row][valueKey];
        });
        if (values.length === 1) {
          return values[0];
        }
        return values;
      }
      function getLabels() {
        const { labelKey } = props;
        return selectedIndex.value.map((row, col) => formatColumns.value[col][row][labelKey]);
      }
      function getColumnIndex(columnIndex) {
        return selectedIndex.value[columnIndex];
      }
      function getColumnData(columnIndex) {
        return formatColumns.value[columnIndex];
      }
      function setColumnData(columnIndex, data, rowIndex = 0) {
        formatColumns.value[columnIndex] = formatArray(data, props.valueKey, props.labelKey).reduce((acc, val) => acc.concat(val), []);
        selectedIndex.value = correctSelectedIndex(columnIndex, rowIndex, selectedIndex.value);
      }
      function getColumnsData() {
        return deepClone(formatColumns.value);
      }
      function getSelectedIndex() {
        return selectedIndex.value;
      }
      function resetColumns(columns) {
        if (isArray(columns) && columns.length) {
          formatColumns.value = formatArray(columns, props.valueKey, props.labelKey);
        }
      }
      function onPickStart() {
        emit("pickstart");
      }
      function onPickEnd() {
        emit("pickend");
      }
      __expose({
        getSelects,
        getValues,
        setColumnData,
        getColumnsData,
        getColumnData,
        getColumnIndex,
        getLabels,
        getSelectedIndex,
        resetColumns
      });
      const __returned__ = { props, emit, formatColumns, itemHeight, selectedIndex, proxy, selectWithValue, correctSelected, correctSelectedIndex, onChange, getChangeColumn, getChangeDiff, handleChange, getSelects, getValues, getLabels, getColumnIndex, getColumnData, setColumnData, getColumnsData, getSelectedIndex, resetColumns, onPickStart, onPickEnd, wdLoading };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-picker-view ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "wd-picker-view__loading"
        }, [
          vue.createVNode($setup["wdLoading"], { color: _ctx.loadingColor }, null, 8, ["color"])
        ])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            style: vue.normalizeStyle(`height: ${_ctx.columnsHeight - 20}px;`)
          },
          [
            vue.createElementVNode("picker-view", {
              "mask-class": "wd-picker-view__mask",
              "indicator-class": "wd-picker-view__roller",
              "indicator-style": `height: ${$setup.itemHeight}px;`,
              style: vue.normalizeStyle(`height: ${_ctx.columnsHeight - 20}px;`),
              value: $setup.selectedIndex,
              "immediate-change": _ctx.immediateChange,
              onChange: $setup.onChange,
              onPickstart: $setup.onPickStart,
              onPickend: $setup.onPickEnd
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.formatColumns, (col, colIndex) => {
                  return vue.openBlock(), vue.createElementBlock("picker-view-column", {
                    key: colIndex,
                    class: "wd-picker-view-column"
                  }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(col, (row, rowIndex) => {
                        return vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: rowIndex,
                            class: vue.normalizeClass(`wd-picker-view-column__item ${row["disabled"] ? "wd-picker-view-column__item--disabled" : ""}  ${$setup.selectedIndex[colIndex] == rowIndex ? "wd-picker-view-column__item--active" : ""}`),
                            style: vue.normalizeStyle(`line-height: ${$setup.itemHeight}px;`)
                          },
                          vue.toDisplayString(row[_ctx.labelKey]),
                          7
                          /* TEXT, CLASS, STYLE */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ], 44, ["indicator-style", "value", "immediate-change"])
          ],
          4
          /* STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const wdPickerView = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__scopeId", "data-v-c3bc94ff"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-picker-view/wd-picker-view.vue"]]);
  const cellProps = {
    ...baseProps,
    /**
     * 标题
     */
    title: String,
    /**
     * 右侧内容
     */
    value: makeNumericProp(""),
    /**
     * 图标类名
     */
    icon: String,
    /**
     * 描述信息
     */
    label: String,
    /**
     * 是否为跳转链接
     */
    isLink: makeBooleanProp(false),
    /**
     * 跳转地址
     */
    to: String,
    /**
     * 跳转时是否替换栈顶页面
     */
    replace: makeBooleanProp(false),
    /**
     * 开启点击反馈，is-link 默认开启
     */
    clickable: makeBooleanProp(false),
    /**
     * 设置单元格大小，可选值：large
     */
    size: String,
    /**
     * 是否展示边框线
     */
    border: makeBooleanProp(void 0),
    /**
     * 设置左侧标题宽度
     */
    titleWidth: String,
    /**
     * 是否垂直居中，默认顶部居中
     */
    center: makeBooleanProp(false),
    /**
     * 是否必填
     */
    required: makeBooleanProp(false),
    /**
     * 表单属性，上下结构
     */
    vertical: makeBooleanProp(false),
    /**
     * 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的
     */
    prop: String,
    /**
     * 表单验证规则，结合wd-form组件使用
     */
    rules: makeArrayProp(),
    /**
     * icon 使用 slot 时的自定义样式
     */
    customIconClass: makeStringProp(""),
    /**
     * label 使用 slot 时的自定义样式
     */
    customLabelClass: makeStringProp(""),
    /**
     * value 使用 slot 时的自定义样式
     */
    customValueClass: makeStringProp(""),
    /**
     * title 使用 slot 时的自定义样式
     */
    customTitleClass: makeStringProp(""),
    /**
     * value 文字对齐方式，可选值：left、right、center
     */
    valueAlign: makeStringProp("right"),
    /**
     * 是否超出隐藏，显示省略号
     */
    ellipsis: makeBooleanProp(false),
    /**
     * 是否启用title插槽，默认启用，用来解决插槽传递时v-slot和v-if冲突问题。
     * 问题见：https://github.com/dcloudio/uni-app/issues/4847
     */
    useTitleSlot: makeBooleanProp(true),
    /**
     * 必填标记位置，可选值：before（标签前）、after（标签后）
     */
    markerSide: makeStringProp("before")
  };
  const __default__$l = {
    name: "wd-cell",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$y = /* @__PURE__ */ vue.defineComponent({
    ...__default__$l,
    props: cellProps,
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const slots = vue.useSlots();
      const cell = useCell();
      const isBorder = vue.computed(() => {
        return Boolean(isDef(props.border) ? props.border : cell.border.value);
      });
      const { parent: form } = useParent(FORM_KEY);
      const errorMessage = vue.computed(() => {
        if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
          return form.errorMessages[props.prop];
        } else {
          return "";
        }
      });
      const isRequired = vue.computed(() => {
        let formRequired = false;
        if (form && form.props.rules) {
          const rules = form.props.rules;
          for (const key in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key])) {
              formRequired = rules[key].some((rule) => rule.required);
            }
          }
        }
        return props.required || props.rules.some((rule) => rule.required) || formRequired;
      });
      const showLeft = vue.computed(() => {
        const hasIcon = slots.icon || props.icon;
        const hasTitle = slots.title && props.useTitleSlot || props.title;
        const hasLabel = slots.label || props.label;
        return hasIcon || hasTitle || hasLabel;
      });
      function onClick() {
        const url = props.to;
        if (props.clickable || props.isLink) {
          emit("click");
        }
        if (url && props.isLink) {
          if (props.replace) {
            uni.redirectTo({ url });
          } else {
            uni.navigateTo({ url });
          }
        }
      }
      const __returned__ = { props, emit, slots, cell, isBorder, form, errorMessage, isRequired, showLeft, onClick, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass(["wd-cell", $setup.isBorder ? "is-border" : "", _ctx.size ? "is-" + _ctx.size : "", _ctx.center ? "is-center" : "", _ctx.customClass]),
      style: vue.normalizeStyle(_ctx.customStyle),
      "hover-class": _ctx.isLink || _ctx.clickable ? "is-hover" : "none",
      "hover-stay-time": 70,
      onClick: $setup.onClick
    }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["wd-cell__wrapper", _ctx.vertical ? "is-vertical" : ""])
        },
        [
          $setup.showLeft ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "wd-cell__left",
              style: vue.normalizeStyle(_ctx.titleWidth ? "min-width:" + _ctx.titleWidth + ";max-width:" + _ctx.titleWidth + ";" : "")
            },
            [
              $setup.isRequired && _ctx.markerSide === "before" ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "wd-cell__required wd-cell__required--left"
              }, "*")) : vue.createCommentVNode("v-if", true),
              vue.createCommentVNode("左侧icon部位"),
              vue.renderSlot(_ctx.$slots, "icon", {}, () => [
                _ctx.icon ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                  key: 0,
                  name: _ctx.icon,
                  "custom-class": `wd-cell__icon  ${_ctx.customIconClass}`
                }, null, 8, ["name", "custom-class"])) : vue.createCommentVNode("v-if", true)
              ], true),
              vue.createElementVNode("view", { class: "wd-cell__title" }, [
                vue.createCommentVNode("title BEGIN"),
                _ctx.useTitleSlot && _ctx.$slots.title ? vue.renderSlot(_ctx.$slots, "title", { key: 0 }, void 0, true) : _ctx.title ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 1,
                    class: vue.normalizeClass(_ctx.customTitleClass)
                  },
                  vue.toDisplayString(_ctx.title),
                  3
                  /* TEXT, CLASS */
                )) : vue.createCommentVNode("v-if", true),
                vue.createCommentVNode("title END"),
                vue.createCommentVNode("label BEGIN"),
                vue.renderSlot(_ctx.$slots, "label", {}, () => [
                  _ctx.label ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: vue.normalizeClass(`wd-cell__label ${_ctx.customLabelClass}`)
                    },
                    vue.toDisplayString(_ctx.label),
                    3
                    /* TEXT, CLASS */
                  )) : vue.createCommentVNode("v-if", true)
                ], true),
                vue.createCommentVNode("label END")
              ]),
              $setup.isRequired && _ctx.markerSide === "after" ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 1,
                class: "wd-cell__required"
              }, "*")) : vue.createCommentVNode("v-if", true)
            ],
            4
            /* STYLE */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode("right content BEGIN"),
          vue.createElementVNode("view", { class: "wd-cell__right" }, [
            vue.createElementVNode("view", { class: "wd-cell__body" }, [
              vue.createCommentVNode("文案内容"),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(`wd-cell__value ${_ctx.customValueClass} wd-cell__value--${_ctx.valueAlign} ${_ctx.ellipsis ? "wd-cell__value--ellipsis" : ""}`)
                },
                [
                  vue.renderSlot(_ctx.$slots, "default", {}, () => [
                    vue.createTextVNode(
                      vue.toDisplayString(_ctx.value),
                      1
                      /* TEXT */
                    )
                  ], true)
                ],
                2
                /* CLASS */
              ),
              vue.createCommentVNode("箭头"),
              _ctx.isLink ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-cell__arrow-right",
                name: "arrow-right"
              })) : vue.renderSlot(_ctx.$slots, "right-icon", { key: 1 }, void 0, true)
            ]),
            $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "wd-cell__error-message"
              },
              vue.toDisplayString($setup.errorMessage),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode("right content END")
        ],
        2
        /* CLASS */
      )
    ], 14, ["hover-class"]);
  }
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-f1c5bbe2"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-cell/wd-cell.vue"]]);
  const pickerProps = {
    ...baseProps,
    /**
     * label 外部自定义样式
     */
    customLabelClass: makeStringProp(""),
    /**
     * value 外部自定义样式
     */
    customValueClass: makeStringProp(""),
    /**
     * pickerView 外部自定义样式
     */
    customViewClass: makeStringProp(""),
    /**
     * 选择器左侧文案
     */
    label: String,
    /**
     * 选择器占位符
     */
    placeholder: String,
    /**
     * 是否禁用
     */
    disabled: makeBooleanProp(false),
    /**
     * 是否只读
     */
    readonly: makeBooleanProp(false),
    /**
     * 加载中
     */
    loading: makeBooleanProp(false),
    /**
     * 加载中颜色
     */
    loadingColor: makeStringProp("#4D80F0"),
    /* popup */
    /**
     * 弹出层标题
     */
    title: String,
    /**
     * 取消按钮文案
     */
    cancelButtonText: String,
    /**
     * 确认按钮文案
     */
    confirmButtonText: String,
    /**
     * 是否必填
     */
    required: makeBooleanProp(false),
    /**
     * 尺寸
     */
    size: String,
    /**
     * 设置左侧标题宽度
     */
    labelWidth: makeStringProp("33%"),
    /**
     * 使用默认插槽
     * @deprecated 可以直接使用默认插槽，无需配置此选项
     */
    useDefaultSlot: makeBooleanProp(false),
    /**
     * 使用标签插槽
     * @deprecated 可以直接使用标签插槽，无需配置此选项
     */
    useLabelSlot: makeBooleanProp(false),
    /**
     * 错误状态
     */
    error: makeBooleanProp(false),
    /**
     * 右对齐
     */
    alignRight: makeBooleanProp(false),
    /**
     * 确定前校验函数，接收 (value, resolve, picker) 参数，通过 resolve 继续执行 picker，resolve 接收1个boolean参数
     */
    beforeConfirm: Function,
    /**
     * 点击蒙层关闭
     */
    closeOnClickModal: makeBooleanProp(true),
    /**
     * 底部安全区域内
     */
    safeAreaInsetBottom: makeBooleanProp(true),
    /**
     * 文本溢出显示省略号
     */
    ellipsis: makeBooleanProp(false),
    /**
     * 选项总高度
     */
    columnsHeight: makeNumberProp(217),
    /**
     * 选项值对应的键名
     */
    valueKey: makeStringProp("value"),
    /**
     * 选项文本对应的键名
     */
    labelKey: makeStringProp("label"),
    /**
     * 选中项，如果为多列选择器，则其类型应为数组
     */
    modelValue: {
      type: [String, Number, Array],
      default: ""
    },
    /**
     * 选择器数据，可以为字符串数组，也可以为对象数组，如果为二维数组，则为多列选择器
     */
    columns: {
      type: Array,
      default: () => []
    },
    /**
     * 接收 pickerView 实例、选中项、当前修改列的下标、resolve 作为入参，根据选中项和列下标进行判断，通过 pickerView 实例暴露出来的 setColumnData 方法修改其他列的数据源。
     */
    columnChange: Function,
    /**
     * 自定义展示文案的格式化函数，返回一个字符串
     */
    displayFormat: Function,
    /**
     * 自定义层级
     */
    zIndex: makeNumberProp(15),
    /**
     * 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的
     */
    prop: String,
    /**
     * 表单验证规则，结合wd-form组件使用
     */
    rules: makeArrayProp(),
    /**
     * 是否在手指松开时立即触发 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
     */
    immediateChange: makeBooleanProp(false),
    /**
     * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
     */
    rootPortal: makeBooleanProp(false),
    /**
     * 显示清空按钮
     */
    clearable: makeBooleanProp(false),
    /**
     * 必填标记位置，可选值：before、after
     */
    markerSide: makeStringProp("before")
  };
  const __default__$k = {
    name: "wd-picker",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$x = /* @__PURE__ */ vue.defineComponent({
    ...__default__$k,
    props: pickerProps,
    emits: ["confirm", "open", "cancel", "clear", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const { translate } = useTranslate("picker");
      const props = __props;
      const emit = __emit;
      const pickerViewWd = vue.ref(null);
      const innerLoading = vue.ref(false);
      const popupShow = vue.ref(false);
      const showValue = vue.ref("");
      const pickerValue = vue.ref("");
      const displayColumns = vue.ref([]);
      const resetColumns = vue.ref([]);
      const isPicking = vue.ref(false);
      const hasConfirmed = vue.ref(false);
      const isLoading = vue.computed(() => {
        return props.loading || innerLoading.value;
      });
      vue.watch(
        () => props.displayFormat,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-picker/wd-picker.vue:133", "The type of displayFormat must be Function");
          }
          if (pickerViewWd.value && pickerViewWd.value.getSelectedIndex().length !== 0) {
            handleShowValueUpdate(props.modelValue);
          }
        },
        {
          immediate: true,
          deep: true
        }
      );
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          pickerValue.value = newValue;
          handleShowValueUpdate(newValue);
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.columns,
        (newValue) => {
          displayColumns.value = deepClone(newValue);
          resetColumns.value = deepClone(newValue);
          if (newValue.length === 0) {
            pickerValue.value = isArray(props.modelValue) ? [] : "";
            showValue.value = "";
          } else {
            handleShowValueUpdate(props.modelValue);
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.columnChange,
        (newValue) => {
          if (newValue && !isFunction(newValue)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-picker/wd-picker.vue:182", "The type of columnChange must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      const showClear = vue.computed(() => {
        return props.clearable && !props.disabled && !props.readonly && showValue.value.length > 0;
      });
      const showArrow = vue.computed(() => {
        return !props.disabled && !props.readonly && !showClear.value;
      });
      const cellClass = vue.computed(() => {
        const classes = ["wd-picker__cell"];
        if (props.disabled)
          classes.push("is-disabled");
        if (props.readonly)
          classes.push("is-readonly");
        if (props.error)
          classes.push("is-error");
        if (!showValue.value)
          classes.push("wd-picker__cell--placeholder");
        return classes.join(" ");
      });
      const { proxy } = vue.getCurrentInstance();
      vue.onMounted(() => {
        handleShowValueUpdate(props.modelValue);
      });
      vue.onBeforeMount(() => {
        displayColumns.value = deepClone(props.columns);
        resetColumns.value = deepClone(props.columns);
      });
      function handleShowValueUpdate(value) {
        if (isArray(value) && value.length > 0 || isDef(value) && !isArray(value) && value !== "") {
          if (pickerViewWd.value) {
            vue.nextTick(() => {
              setShowValue(pickerViewWd.value.getSelects());
            });
          } else {
            setShowValue(getSelects(value));
          }
        } else {
          showValue.value = "";
        }
      }
      function getSelects(value) {
        const formatColumns = formatArray(props.columns, props.valueKey, props.labelKey);
        if (props.columns.length === 0)
          return;
        if (value === "" || !isDef(value) || isArray(value) && value.length === 0) {
          return;
        }
        const valueType = getType(value);
        const type = ["string", "number", "boolean", "array"];
        if (type.indexOf(valueType) === -1)
          return [];
        value = isArray(value) ? value : [value];
        value = value.slice(0, formatColumns.length);
        if (value.length === 0) {
          value = formatColumns.map(() => 0);
        }
        let selected = [];
        value.forEach((target, col) => {
          let row = formatColumns[col].findIndex((row2) => {
            return row2[props.valueKey].toString() === target.toString();
          });
          row = row === -1 ? 0 : row;
          selected.push(row);
        });
        const selects = selected.map((row, col) => formatColumns[col][row]);
        if (selects.length === 1) {
          return selects[0];
        }
        return selects;
      }
      function open() {
        showPopup();
      }
      function close() {
        onCancel();
      }
      function showPopup() {
        if (props.disabled || props.readonly)
          return;
        emit("open");
        popupShow.value = true;
        pickerValue.value = props.modelValue;
        displayColumns.value = resetColumns.value;
      }
      function onCancel() {
        popupShow.value = false;
        emit("cancel");
        let timmer = setTimeout(() => {
          clearTimeout(timmer);
          isDef(pickerViewWd.value) && pickerViewWd.value.resetColumns(resetColumns.value);
        }, 300);
      }
      function onConfirm() {
        if (isLoading.value)
          return;
        if (isPicking.value) {
          hasConfirmed.value = true;
          return;
        }
        const { beforeConfirm } = props;
        if (beforeConfirm && isFunction(beforeConfirm)) {
          beforeConfirm(
            pickerValue.value,
            (isPass) => {
              isPass && handleConfirm();
            },
            proxy.$.exposed
          );
        } else {
          handleConfirm();
        }
      }
      function handleConfirm() {
        if (isLoading.value || props.disabled) {
          popupShow.value = false;
          return;
        }
        const selects = pickerViewWd.value.getSelects();
        const values = pickerViewWd.value.getValues();
        const columns = pickerViewWd.value.getColumnsData();
        popupShow.value = false;
        resetColumns.value = deepClone(columns);
        emit("update:modelValue", values);
        setShowValue(selects);
        emit("confirm", {
          value: values,
          selectedItems: selects
        });
      }
      function pickerViewChange({ value }) {
        pickerValue.value = value;
      }
      function setShowValue(items) {
        if (isArray(items) && !items.length || !items)
          return;
        const { valueKey, labelKey } = props;
        showValue.value = (props.displayFormat || defaultDisplayFormat)(items, { valueKey, labelKey });
      }
      function noop() {
      }
      function onPickStart() {
        isPicking.value = true;
      }
      function onPickEnd() {
        isPicking.value = false;
        if (hasConfirmed.value) {
          hasConfirmed.value = false;
          onConfirm();
        }
      }
      function setLoading(loading) {
        innerLoading.value = loading;
      }
      function handleClear() {
        const clearValue = isArray(pickerValue.value) ? [] : "";
        emit("update:modelValue", clearValue);
        emit("clear");
      }
      __expose({
        close,
        open,
        setLoading
      });
      const __returned__ = { translate, props, emit, pickerViewWd, innerLoading, popupShow, showValue, pickerValue, displayColumns, resetColumns, isPicking, hasConfirmed, isLoading, showClear, showArrow, cellClass, proxy, handleShowValueUpdate, getSelects, open, close, showPopup, onCancel, onConfirm, handleConfirm, pickerViewChange, setShowValue, noop, onPickStart, onPickEnd, setLoading, handleClear, wdIcon: __easycom_1$3, wdPopup: __easycom_13, wdPickerView, wdCell: __easycom_5 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-picker ${_ctx.disabled ? "is-disabled" : ""} ${_ctx.size ? "is-" + _ctx.size : ""} ${_ctx.alignRight ? "is-align-right" : ""} ${_ctx.error ? "is-error" : ""} ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        !_ctx.$slots.default ? (vue.openBlock(), vue.createBlock($setup["wdCell"], {
          key: 0,
          title: _ctx.label,
          value: $setup.showValue ? $setup.showValue : _ctx.placeholder || $setup.translate("placeholder"),
          required: _ctx.required,
          size: _ctx.size,
          "title-width": _ctx.labelWidth,
          prop: _ctx.prop,
          rules: _ctx.rules,
          clickable: !_ctx.disabled && !_ctx.readonly,
          "value-align": _ctx.alignRight ? "right" : "left",
          "custom-class": $setup.cellClass,
          "custom-style": _ctx.customStyle,
          "custom-title-class": _ctx.customLabelClass,
          "custom-value-class": _ctx.customValueClass,
          ellipsis: _ctx.ellipsis,
          "use-title-slot": !!_ctx.$slots.label,
          "marker-side": _ctx.markerSide,
          onClick: $setup.showPopup
        }, vue.createSlots({
          "right-icon": vue.withCtx(() => [
            $setup.showArrow ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
              key: 0,
              "custom-class": "wd-picker__arrow",
              name: "arrow-right"
            })) : $setup.showClear ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              onClick: vue.withModifiers($setup.handleClear, ["stop"])
            }, [
              vue.createVNode($setup["wdIcon"], {
                "custom-class": "wd-picker__clear",
                name: "error-fill"
              })
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          _: 2
          /* DYNAMIC */
        }, [
          _ctx.$slots.label ? {
            name: "title",
            fn: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "label", {}, void 0, true)
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "value", "required", "size", "title-width", "prop", "rules", "clickable", "value-align", "custom-class", "custom-style", "custom-title-class", "custom-value-class", "ellipsis", "use-title-slot", "marker-side"])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          onClick: $setup.showPopup
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])),
        vue.createVNode($setup["wdPopup"], {
          modelValue: $setup.popupShow,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.popupShow = $event),
          position: "bottom",
          "hide-when-close": false,
          "close-on-click-modal": _ctx.closeOnClickModal,
          "z-index": _ctx.zIndex,
          "safe-area-inset-bottom": _ctx.safeAreaInsetBottom,
          "root-portal": _ctx.rootPortal,
          onClose: $setup.onCancel,
          "custom-class": "wd-picker__popup"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "wd-picker__wraper" }, [
              vue.createElementVNode(
                "view",
                {
                  class: "wd-picker__toolbar",
                  onTouchmove: $setup.noop
                },
                [
                  vue.createElementVNode(
                    "view",
                    {
                      class: "wd-picker__action wd-picker__action--cancel",
                      onClick: $setup.onCancel
                    },
                    vue.toDisplayString(_ctx.cancelButtonText || $setup.translate("cancel")),
                    1
                    /* TEXT */
                  ),
                  _ctx.title ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: "wd-picker__title"
                    },
                    vue.toDisplayString(_ctx.title),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(`wd-picker__action ${$setup.isLoading ? "is-loading" : ""}`),
                      onClick: $setup.onConfirm
                    },
                    vue.toDisplayString(_ctx.confirmButtonText || $setup.translate("done")),
                    3
                    /* TEXT, CLASS */
                  )
                ],
                32
                /* NEED_HYDRATION */
              ),
              vue.createVNode($setup["wdPickerView"], {
                ref: "pickerViewWd",
                "custom-class": _ctx.customViewClass,
                modelValue: $setup.pickerValue,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.pickerValue = $event),
                columns: $setup.displayColumns,
                loading: $setup.isLoading,
                "loading-color": _ctx.loadingColor,
                "columns-height": _ctx.columnsHeight,
                "value-key": _ctx.valueKey,
                "label-key": _ctx.labelKey,
                "immediate-change": _ctx.immediateChange,
                onChange: $setup.pickerViewChange,
                onPickstart: $setup.onPickStart,
                onPickend: $setup.onPickEnd,
                "column-change": _ctx.columnChange
              }, null, 8, ["custom-class", "modelValue", "columns", "loading", "loading-color", "columns-height", "value-key", "label-key", "immediate-change", "column-change"])
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue", "close-on-click-modal", "z-index", "safe-area-inset-bottom", "root-portal"])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__scopeId", "data-v-e228acd5"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-picker/wd-picker.vue"]]);
  const datetimePickerViewProps = {
    ...baseProps,
    /**
     * 选中项，当 type 为 time 时，类型为字符串，否则为 时间戳
     */
    modelValue: makeRequiredProp([String, Number]),
    /**
     * 加载中
     */
    loading: makeBooleanProp(false),
    /**
     * 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写
     */
    loadingColor: makeStringProp("#4D80F0"),
    /**
     * picker内部滚筒高
     */
    columnsHeight: makeNumberProp(217),
    /**
     * 选项的key
     */
    valueKey: makeStringProp("value"),
    /**
     * 选项的label
     */
    labelKey: makeStringProp("label"),
    /**
     * 选择器类型，可选值：date / year-month / time
     */
    type: makeStringProp("datetime"),
    /**
     * 自定义过滤选项的函数，返回列的选项数组
     */
    filter: Function,
    /**
     * 自定义弹出层选项文案的格式化函数，返回一个字符串
     */
    formatter: Function,
    /**
     * 自定义列的格式化函数
     */
    columnFormatter: Function,
    /**
     * 最小日期
     */
    minDate: makeNumberProp(new Date((/* @__PURE__ */ new Date()).getFullYear() - 10, 0, 1).getTime()),
    /**
     * 最大日期
     */
    maxDate: makeNumberProp(new Date((/* @__PURE__ */ new Date()).getFullYear() + 10, 11, 31).getTime()),
    /**
     * 最小小时，time类型时生效
     */
    minHour: makeNumberProp(0),
    /**
     * 最大小时，time类型时生效
     */
    maxHour: makeNumberProp(23),
    /**
     * 最小分钟，time类型时生效
     */
    minMinute: makeNumberProp(0),
    /**
     * 最大分钟，time类型时生效
     */
    maxMinute: makeNumberProp(59),
    /**
     * 是否显示秒选择，仅在 time 和 datetime 类型下生效
     */
    useSecond: makeBooleanProp(false),
    /**
     * 最小秒数，仅在 time 和 datetime 类型下生效
     */
    minSecond: makeNumberProp(0),
    /**
     * 最大秒数，仅在 time 和 datetime 类型下生效
     */
    maxSecond: makeNumberProp(59),
    /**
     * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
     */
    immediateChange: makeBooleanProp(false)
  };
  function getPickerValue(value, type, useSecond = false) {
    const values = [];
    const date = new Date(value);
    if (type === "time") {
      const pair = String(value).split(":");
      values.push(parseInt(pair[0]), parseInt(pair[1]));
      if (useSecond && pair[2]) {
        values.push(parseInt(pair[2]));
      }
    } else {
      values.push(date.getFullYear(), date.getMonth() + 1);
      if (type === "date") {
        values.push(date.getDate());
      } else if (type === "datetime") {
        values.push(date.getDate(), date.getHours(), date.getMinutes());
        if (useSecond) {
          values.push(date.getSeconds());
        }
      }
    }
    return values;
  }
  const __default__$j = {
    name: "wd-datetime-picker-view",
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  };
  const _sfc_main$w = /* @__PURE__ */ vue.defineComponent({
    ...__default__$j,
    props: datetimePickerViewProps,
    emits: ["change", "pickstart", "pickend", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const isValidDate = (date) => isDef(date) && !Number.isNaN(date);
      const times = (n, iteratee) => {
        let index = -1;
        const length = n < 0 ? 0 : n;
        const result = Array(length);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      };
      const getMonthEndDay = (year, month) => {
        return 32 - new Date(year, month - 1, 32).getDate();
      };
      const props = __props;
      const emit = __emit;
      const datePickerview = vue.ref();
      const innerValue = vue.ref(null);
      const columns = vue.ref([]);
      const pickerValue = vue.ref([]);
      const created = vue.ref(false);
      const { proxy } = vue.getCurrentInstance();
      const updateValue = debounce(() => {
        if (!created.value)
          return;
        const val = correctValue(props.modelValue);
        const isEqual2 = val === innerValue.value;
        if (!isEqual2) {
          updateColumnValue(val);
        } else {
          columns.value = updateColumns();
        }
      }, 50);
      vue.watch(
        () => props.modelValue,
        (val, oldVal) => {
          if (val === oldVal)
            return;
          const value = correctValue(val);
          updateColumnValue(value);
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => props.type,
        (target) => {
          const type = ["date", "year-month", "time", "datetime", "year"];
          if (type.indexOf(target) === -1) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-datetime-picker-view/wd-datetime-picker-view.vue:109", `type must be one of ${type}`);
          }
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        [
          () => props.type,
          () => props.filter,
          () => props.formatter,
          () => props.columnFormatter,
          () => props.minDate,
          () => props.maxDate,
          () => props.minHour,
          () => props.maxHour,
          () => props.minMinute,
          () => props.maxMinute,
          () => props.minSecond,
          () => props.maxSecond,
          () => props.useSecond
        ],
        () => {
          updateValue();
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.onBeforeMount(() => {
        created.value = true;
        const innerValue2 = correctValue(props.modelValue);
        updateColumnValue(innerValue2);
      });
      function onChange({ value }) {
        pickerValue.value = value;
        const result = updateInnerValue();
        emit("update:modelValue", result);
        emit("change", {
          value: result,
          picker: proxy.$.exposed
        });
      }
      function updateColumns() {
        const { formatter, columnFormatter } = props;
        if (columnFormatter) {
          return columnFormatter(proxy.$.exposed);
        } else {
          return getOriginColumns().map((column) => {
            return column.values.map((value) => {
              return {
                label: formatter ? formatter(column.type, padZero(value)) : padZero(value),
                value
              };
            });
          });
        }
      }
      function setColumns(columnList) {
        columns.value = columnList;
      }
      function getOriginColumns() {
        const { filter } = props;
        return getRanges().map(({ type, range: range2 }) => {
          let values = times(range2[1] - range2[0] + 1, (index) => {
            return range2[0] + index;
          });
          if (filter) {
            values = filter(type, values);
          }
          return {
            type,
            values
          };
        });
      }
      function getRanges() {
        if (props.type === "time") {
          const result2 = [
            {
              type: "hour",
              range: [props.minHour, props.maxHour]
            },
            {
              type: "minute",
              range: [props.minMinute, props.maxMinute]
            }
          ];
          if (props.useSecond) {
            result2.push({
              type: "second",
              range: [props.minSecond, props.maxSecond]
            });
          }
          return result2;
        }
        const { maxYear, maxDate, maxMonth, maxHour, maxMinute, maxSecond } = getBoundary("max", innerValue.value);
        const { minYear, minDate, minMonth, minHour, minMinute, minSecond } = getBoundary("min", innerValue.value);
        const result = [
          {
            type: "year",
            range: [minYear, maxYear]
          },
          {
            type: "month",
            range: [minMonth, maxMonth]
          },
          {
            type: "date",
            range: [minDate, maxDate]
          },
          {
            type: "hour",
            range: [minHour, maxHour]
          },
          {
            type: "minute",
            range: [minMinute, maxMinute]
          }
        ];
        if (props.type === "datetime" && props.useSecond) {
          result.push({
            type: "second",
            range: [minSecond, maxSecond]
          });
        }
        if (props.type === "date")
          result.splice(3, 2);
        if (props.type === "year-month")
          result.splice(2, 3);
        if (props.type === "year")
          result.splice(1, 4);
        return result;
      }
      function correctValue(value) {
        const isDateType = props.type !== "time";
        if (isDateType && !isValidDate(value)) {
          value = props.minDate;
        } else if (!isDateType && !value) {
          value = props.useSecond ? `${padZero(props.minHour)}:00:00` : `${padZero(props.minHour)}:00`;
        }
        if (!isDateType) {
          let [hour, minute, second = "00"] = (isString(value) ? value : value.toString()).split(":");
          hour = padZero(range(Number(hour), props.minHour, props.maxHour));
          minute = padZero(range(Number(minute), props.minMinute, props.maxMinute));
          if (props.useSecond) {
            second = padZero(range(Number(second), props.minSecond, props.maxSecond));
            return `${hour}:${minute}:${second}`;
          }
          return `${hour}:${minute}`;
        }
        value = Math.min(Math.max(Number(value), props.minDate), props.maxDate);
        return value;
      }
      function getBoundary(type, innerValue2) {
        const value = new Date(innerValue2);
        const boundary = new Date(props[`${type}Date`]);
        const year = boundary.getFullYear();
        let month = 1;
        let date = 1;
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (type === "max") {
          month = 12;
          date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
          hour = 23;
          minute = 59;
          second = 59;
        }
        if (value.getFullYear() === year) {
          month = boundary.getMonth() + 1;
          if (value.getMonth() + 1 === month) {
            date = boundary.getDate();
            if (value.getDate() === date) {
              hour = boundary.getHours();
              if (value.getHours() === hour) {
                minute = boundary.getMinutes();
                if (value.getMinutes() === minute) {
                  second = boundary.getSeconds();
                }
              }
            }
          }
        }
        return {
          [`${type}Year`]: year,
          [`${type}Month`]: month,
          [`${type}Date`]: date,
          [`${type}Hour`]: hour,
          [`${type}Minute`]: minute,
          [`${type}Second`]: second
        };
      }
      function updateColumnValue(value) {
        const values = getPickerValue(value, props.type, props.useSecond);
        if (props.modelValue !== value) {
          emit("update:modelValue", value);
          emit("change", {
            value,
            picker: proxy.$.exposed
          });
        }
        innerValue.value = value;
        columns.value = updateColumns();
        pickerValue.value = values;
      }
      function updateInnerValue() {
        var _a;
        const { type, useSecond } = props;
        let innerValue2 = "";
        const pickerVal = ((_a = datePickerview.value) == null ? void 0 : _a.getValues()) || [];
        const values = isArray(pickerVal) ? pickerVal : [pickerVal];
        if (type === "time") {
          if (useSecond) {
            innerValue2 = `${padZero(values[0])}:${padZero(values[1])}:${padZero(values[2])}`;
          } else {
            innerValue2 = `${padZero(values[0])}:${padZero(values[1])}`;
          }
          return innerValue2;
        }
        const year = values[0] && parseInt(values[0]);
        const month = type === "year" ? 1 : values[1] && parseInt(values[1]);
        const maxDate = getMonthEndDay(Number(year), Number(month));
        let date = 1;
        if (type !== "year-month" && type !== "year") {
          date = (Number(values[2]) && parseInt(String(values[2]))) > maxDate ? maxDate : values[2] && parseInt(String(values[2]));
        }
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (type === "datetime") {
          hour = Number(values[3]) && parseInt(values[3]);
          minute = Number(values[4]) && parseInt(values[4]);
          if (useSecond) {
            second = Number(values[5]) && parseInt(values[5]);
          }
        }
        const value = new Date(Number(year), Number(month) - 1, Number(date), hour, minute, second).getTime();
        innerValue2 = correctValue(value);
        return innerValue2;
      }
      function columnChange(picker) {
        if (props.type === "time" || props.type === "year-month" || props.type === "year") {
          return;
        }
        const values = picker.getValues();
        const year = Number(values[0]);
        const month = Number(values[1]);
        const maxDate = getMonthEndDay(year, month);
        let date = Number(values[2]);
        date = date > maxDate ? maxDate : date;
        let hour = 0;
        let minute = 0;
        let second = 0;
        if (props.type === "datetime") {
          hour = Number(values[3]);
          minute = Number(values[4]);
          if (props.useSecond) {
            second = Number(values[5]);
          }
        }
        const value = new Date(year, month - 1, date, hour, minute, second).getTime();
        innerValue.value = correctValue(value);
        const newColumns = updateColumns();
        const selectedIndex = picker.getSelectedIndex().slice(0);
        newColumns.forEach((_columns, index) => {
          const nextColumnIndex = index + 1;
          const nextColumnData = newColumns[nextColumnIndex];
          if (nextColumnIndex > newColumns.length - 1)
            return;
          picker.setColumnData(
            nextColumnIndex,
            nextColumnData,
            selectedIndex[nextColumnIndex] <= nextColumnData.length - 1 ? selectedIndex[nextColumnIndex] : 0
          );
        });
      }
      function onPickStart() {
        emit("pickstart");
      }
      function onPickEnd() {
        emit("pickend");
      }
      function getSelects() {
        var _a;
        const pickerVal = (_a = datePickerview.value) == null ? void 0 : _a.getSelects();
        if (pickerVal == null)
          return void 0;
        if (isArray(pickerVal))
          return pickerVal;
        return [pickerVal];
      }
      __expose({
        updateColumns,
        setColumns,
        getSelects,
        correctValue,
        getOriginColumns
      });
      const __returned__ = { isValidDate, times, getMonthEndDay, props, emit, datePickerview, innerValue, columns, pickerValue, created, proxy, updateValue, onChange, updateColumns, setColumns, getOriginColumns, getRanges, correctValue, getBoundary, updateColumnValue, updateInnerValue, columnChange, onPickStart, onPickEnd, getSelects, wdPickerView };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createBlock($setup["wdPickerView"], {
      ref: "datePickerview",
      "custom-class": _ctx.customClass,
      "custom-style": _ctx.customStyle,
      "immediate-change": _ctx.immediateChange,
      modelValue: $setup.pickerValue,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.pickerValue = $event),
      columns: $setup.columns,
      "columns-height": _ctx.columnsHeight,
      columnChange: $setup.columnChange,
      loading: _ctx.loading,
      "loading-color": _ctx.loadingColor,
      onChange: $setup.onChange,
      onPickstart: $setup.onPickStart,
      onPickend: $setup.onPickEnd
    }, null, 8, ["custom-class", "custom-style", "immediate-change", "modelValue", "columns", "columns-height", "loading", "loading-color"]);
  }
  const wdDatetimePickerView = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-datetime-picker-view/wd-datetime-picker-view.vue"]]);
  const datetimePickerProps = {
    ...baseProps,
    /**
     * 选择器左侧文案，label可以不传
     */
    label: String,
    /**
     * 选择器占位符
     */
    placeholder: String,
    /**
     * 禁用
     */
    disabled: makeBooleanProp(false),
    /**
     * 只读
     */
    readonly: makeBooleanProp(false),
    /**
     * 加载中
     */
    loading: makeBooleanProp(false),
    /**
     * 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写
     */
    loadingColor: makeStringProp("#4D80F0"),
    /**
     * 弹出层标题
     */
    title: String,
    /**
     * 取消按钮文案
     */
    cancelButtonText: String,
    /**
     * 确认按钮文案
     */
    confirmButtonText: String,
    /**
     * 是否必填
     */
    required: makeBooleanProp(false),
    /**
     * 设置选择器大小，可选值：large
     */
    size: String,
    /**
     * 设置左侧标题宽度
     */
    labelWidth: makeStringProp("33%"),
    /**
     * 是否为错误状态，错误状态时右侧内容为红色
     */
    error: makeBooleanProp(false),
    /**
     * 选择器的值靠右展示
     */
    alignRight: makeBooleanProp(false),
    /**
     * 点击遮罩是否关闭
     */
    closeOnClickModal: makeBooleanProp(true),
    /**
     * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
     */
    safeAreaInsetBottom: makeBooleanProp(true),
    /**
     * 是否超出隐藏
     */
    ellipsis: makeBooleanProp(false),
    /**
     * picker内部滚筒高
     */
    columnsHeight: makeNumberProp(217),
    /**
     * 选项的key
     */
    valueKey: makeStringProp("value"),
    /**
     * 选项的label
     */
    labelKey: makeStringProp("label"),
    /**
     * 选中项，当 type 为 time 时，类型为字符串；当 type 为 Array 时，类型为范围选择；否则为 时间戳
     */
    modelValue: makeRequiredProp([String, Number, Array]),
    /**
     * 选择器类型，可选值为：date / year-month / time
     */
    type: makeStringProp("datetime"),
    /**
     * 最小日期
     */
    minDate: makeNumberProp(new Date((/* @__PURE__ */ new Date()).getFullYear() - 10, 0, 1).getTime()),
    /**
     * 最大日期
     */
    maxDate: makeNumberProp(new Date((/* @__PURE__ */ new Date()).getFullYear() + 10, 11, 31, 23, 59, 59).getTime()),
    /**
     * 最小小时，time类型时生效
     */
    minHour: makeNumberProp(0),
    /**
     * 最大小时，time类型时生效
     */
    maxHour: makeNumberProp(23),
    /**
     * 最小分钟，time类型时生效
     */
    minMinute: makeNumberProp(0),
    /**
     * 最大分钟，time类型时生效
     */
    maxMinute: makeNumberProp(59),
    /**
     * 是否启用秒选择，仅在 time 和 datetime 类型下生效
     */
    useSecond: makeBooleanProp(false),
    /**
     * 最小秒数，仅在 time 和 datetime 类型下生效
     */
    minSecond: makeNumberProp(0),
    /**
     * 最大秒数，仅在 time 和 datetime 类型下生效
     */
    maxSecond: makeNumberProp(59),
    /**
     * 自定义过滤选项的函数，返回列的选项数组
     */
    filter: Function,
    /**
     * 自定义弹出层选项文案的格式化函数，返回一个字符串
     */
    formatter: Function,
    /**
     * 自定义展示文案的格式化函数，返回一个字符串
     */
    displayFormat: Function,
    /**
     * 确定前校验函数，接收 (value, resolve, picker) 参数，通过 resolve 继续执行 picker，resolve 接收1个boolean参数
     */
    beforeConfirm: Function,
    /**
     * 在区域选择模式下，自定义展示tab标签文案的格式化函数，返回一个字符串
     */
    displayFormatTabLabel: Function,
    /**
     * 默认日期，类型保持与 value 一致，打开面板时面板自动选到默认日期
     */
    defaultValue: [String, Number, Array],
    /**
     * 弹窗层级
     */
    zIndex: makeNumberProp(15),
    /**
     * 表单域 model 字段名，在使用表单校验功能的情况下，该属性是必填的
     */
    prop: String,
    /**
     * 表单验证规则，结合wd-form组件使用
     */
    rules: makeArrayProp(),
    /**
     * picker cell 外部自定义样式
     */
    customCellClass: makeStringProp(""),
    /**
     * pickerView 外部自定义样式
     */
    customViewClass: makeStringProp(""),
    /**
     * label 外部自定义样式
     */
    customLabelClass: makeStringProp(""),
    /**
     * value 外部自定义样式
     */
    customValueClass: makeStringProp(""),
    /**
     * 是否在手指松开时立即触发picker-view的 change 事件。若不开启则会在滚动动画结束后触发 change 事件，1.2.25版本起提供，仅微信小程序和支付宝小程序支持。
     */
    immediateChange: makeBooleanProp(false),
    /**
     * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
     */
    rootPortal: makeBooleanProp(false),
    /**
     * 显示清空按钮
     */
    clearable: makeBooleanProp(false),
    /**
     * 必填标记位置，可选值：before、after
     */
    markerSide: makeStringProp("before")
  };
  const __default__$i = {
    name: "wd-datetime-picker",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$v = /* @__PURE__ */ vue.defineComponent({
    ...__default__$i,
    props: datetimePickerProps,
    emits: ["change", "open", "toggle", "cancel", "confirm", "clear", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("datetime-picker");
      const datetimePickerView = vue.ref();
      const datetimePickerView1 = vue.ref();
      const showValue = vue.ref("");
      const popupShow = vue.ref(false);
      const showStart = vue.ref(true);
      const region = vue.ref(false);
      const showTabLabel = vue.ref([]);
      const innerValue = vue.ref("");
      const endInnerValue = vue.ref("");
      const isPicking = vue.ref(false);
      const hasConfirmed = vue.ref(false);
      const isLoading = vue.ref(false);
      const { proxy } = vue.getCurrentInstance();
      const cellClass = vue.computed(() => {
        const classes = ["wd-datetime-picker__cell"];
        if (props.disabled)
          classes.push("is-disabled");
        if (props.readonly)
          classes.push("is-readonly");
        if (props.error)
          classes.push("is-error");
        return classes.join(" ");
      });
      vue.watch(
        () => props.modelValue,
        (val, oldVal) => {
          if (isEqual(val, oldVal))
            return;
          if (isArray(val)) {
            region.value = true;
            innerValue.value = deepClone(getDefaultInnerValue(true));
            endInnerValue.value = deepClone(getDefaultInnerValue(true, true));
          } else {
            innerValue.value = deepClone(getDefaultInnerValue());
          }
          vue.nextTick(() => {
            setShowValue(false, false, true);
          });
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.displayFormat,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.vue:235", "The type of displayFormat must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.filter,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.vue:247", "The type of filter must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.formatter,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.vue:259", "The type of formatter must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.beforeConfirm,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.vue:271", "The type of beforeConfirm must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.displayFormatTabLabel,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.vue:283", "The type of displayFormatTabLabel must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.defaultValue,
        (val) => {
          if (isArray(val) || region.value) {
            innerValue.value = deepClone(getDefaultInnerValue(true));
            endInnerValue.value = deepClone(getDefaultInnerValue(true, true));
          } else {
            innerValue.value = deepClone(getDefaultInnerValue());
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      const showClear = vue.computed(() => {
        return props.clearable && !props.disabled && !props.readonly && (!isArray(showValue.value) && showValue.value || isArray(showValue.value) && (showValue.value[0] || showValue.value[1]));
      });
      const showArrow = vue.computed(() => {
        return !props.disabled && !props.readonly && !showClear.value;
      });
      function handleBoundaryValue(isStart, columnType, value, currentArray, boundary) {
        const { type, useSecond } = props;
        switch (type) {
          case "datetime": {
            const [year, month, date, hour, minute, second] = boundary;
            if (columnType === "year") {
              return isStart ? value > year : value < year;
            }
            if (columnType === "month" && currentArray[0] === year) {
              return isStart ? value > month : value < month;
            }
            if (columnType === "date" && currentArray[0] === year && currentArray[1] === month) {
              return isStart ? value > date : value < date;
            }
            if (columnType === "hour" && currentArray[0] === year && currentArray[1] === month && currentArray[2] === date) {
              return isStart ? value > hour : value < hour;
            }
            if (columnType === "minute" && currentArray[0] === year && currentArray[1] === month && currentArray[2] === date && currentArray[3] === hour) {
              return isStart ? value > minute : value < minute;
            }
            if (useSecond && columnType === "second" && currentArray[0] === year && currentArray[1] === month && currentArray[2] === date && currentArray[3] === hour && currentArray[4] === minute) {
              return isStart ? value > second : value < second;
            }
            break;
          }
          case "year-month": {
            const [year, month] = boundary;
            if (columnType === "year") {
              return isStart ? value > year : value < year;
            }
            if (columnType === "month" && currentArray[0] === year) {
              return isStart ? value > month : value < month;
            }
            break;
          }
          case "year": {
            const [year] = boundary;
            if (columnType === "year") {
              return isStart ? value > year : value < year;
            }
            break;
          }
          case "date": {
            const [year, month, date] = boundary;
            if (columnType === "year") {
              return isStart ? value > year : value < year;
            }
            if (columnType === "month" && currentArray[0] === year) {
              return isStart ? value > month : value < month;
            }
            if (columnType === "date" && currentArray[0] === year && currentArray[1] === month) {
              return isStart ? value > date : value < date;
            }
            break;
          }
          case "time": {
            const [hour, minute, second] = boundary;
            if (columnType === "hour") {
              return isStart ? value > hour : value < hour;
            }
            if (columnType === "minute" && currentArray[0] === hour) {
              return isStart ? value > minute : value < minute;
            }
            if (useSecond && columnType === "second" && currentArray[0] === hour && currentArray[1] === minute) {
              return isStart ? value > second : value < second;
            }
            break;
          }
        }
        return false;
      }
      function startColumnFormatter(picker) {
        return customColumnFormatter(picker, "start");
      }
      function endColumnFormatter(picker) {
        return customColumnFormatter(picker, "end");
      }
      const customColumnFormatter = (picker, pickerType) => {
        if (!picker)
          return [];
        const { type } = props;
        const startSymbol = pickerType === "start";
        const { formatter } = props;
        const start = picker.correctValue(innerValue.value);
        const end = picker.correctValue(endInnerValue.value);
        const currentValue = startSymbol ? getPickerValue(start, type, props.useSecond) : getPickerValue(end, type, props.useSecond);
        const boundary = startSymbol ? getPickerValue(end, type, props.useSecond) : getPickerValue(start, type, props.useSecond);
        const columns = picker.getOriginColumns();
        return columns.map((column, _) => {
          return column.values.map((value) => {
            const disabled = handleBoundaryValue(startSymbol, column.type, value, currentValue, boundary);
            return {
              label: formatter ? formatter(column.type, padZero(value)) : padZero(value),
              value,
              disabled
            };
          });
        });
      };
      vue.onBeforeMount(() => {
        const { modelValue: value } = props;
        if (isArray(value)) {
          region.value = true;
          innerValue.value = deepClone(getDefaultInnerValue(true));
          endInnerValue.value = deepClone(getDefaultInnerValue(true, true));
        } else {
          innerValue.value = deepClone(getDefaultInnerValue());
        }
      });
      vue.onMounted(() => {
        setShowValue(false, false, true);
      });
      function getSelects(picker) {
        let value = picker === "before" ? innerValue.value : endInnerValue.value;
        let selected = [];
        if (value) {
          selected = getPickerValue(value, props.type, props.useSecond);
        }
        let selects = selected.map((value2) => {
          return {
            [props.labelKey]: padZero(value2),
            [props.valueKey]: value2
          };
        });
        return selects;
      }
      function noop() {
      }
      function getDefaultInnerValue(isRegion, isEnd) {
        const { modelValue: value, defaultValue, maxDate, minDate, type } = props;
        if (isRegion) {
          const index = isEnd ? 1 : 0;
          const targetValue = isArray(value) ? value[index] : "";
          const targetDefault = isArray(defaultValue) ? defaultValue[index] : "";
          const maxValue = type === "time" ? dayjs(maxDate).format("HH:mm") : maxDate;
          const minValue = type === "time" ? dayjs(minDate).format("HH:mm") : minDate;
          return targetValue || targetDefault || (isEnd ? maxValue : minValue);
        } else {
          return isDef(value || defaultValue) ? value || defaultValue : "";
        }
      }
      function open() {
        showPopup();
      }
      function close() {
        onCancel();
      }
      function showPopup() {
        if (props.disabled || props.readonly)
          return;
        emit("open");
        if (region.value) {
          popupShow.value = true;
          showStart.value = true;
          innerValue.value = deepClone(getDefaultInnerValue(true, false));
          endInnerValue.value = deepClone(getDefaultInnerValue(true, true));
        } else {
          popupShow.value = true;
          innerValue.value = deepClone(getDefaultInnerValue());
        }
        setShowValue(true, false, true);
      }
      function tabChange() {
        showStart.value = !showStart.value;
        const picker = showStart.value ? datetimePickerView.value : datetimePickerView1.value;
        picker.setColumns(picker.updateColumns());
        emit("toggle", showStart.value ? innerValue.value : endInnerValue.value);
      }
      function onChangeStart({ value }) {
        if (!datetimePickerView.value)
          return;
        if (region.value && !datetimePickerView1.value)
          return;
        if (region.value) {
          const currentArray = getPickerValue(value, props.type, props.useSecond);
          const boundaryArray = getPickerValue(endInnerValue.value, props.type, props.useSecond);
          const columns = datetimePickerView.value.getOriginColumns();
          const needsAdjust = columns.some((column, index) => {
            return handleBoundaryValue(true, column.type, currentArray[index], currentArray, boundaryArray);
          });
          innerValue.value = deepClone(needsAdjust ? endInnerValue.value : value);
          vue.nextTick(() => {
            showTabLabel.value = [setTabLabel(), deepClone(showTabLabel.value[1])];
            emit("change", {
              value: [innerValue.value, endInnerValue.value]
            });
            datetimePickerView.value && datetimePickerView.value.setColumns(datetimePickerView.value.updateColumns());
            datetimePickerView1.value && datetimePickerView1.value.setColumns(datetimePickerView1.value.updateColumns());
          });
        } else {
          innerValue.value = deepClone(value);
          emit("change", {
            value: innerValue.value
          });
        }
      }
      function onChangeEnd({ value }) {
        if (!datetimePickerView.value || !datetimePickerView1.value)
          return;
        const currentArray = getPickerValue(value, props.type);
        const boundaryArray = getPickerValue(innerValue.value, props.type);
        const columns = datetimePickerView1.value.getOriginColumns();
        const needsAdjust = columns.some((column, index) => {
          return handleBoundaryValue(false, column.type, currentArray[index], currentArray, boundaryArray);
        });
        endInnerValue.value = deepClone(needsAdjust ? innerValue.value : value);
        vue.nextTick(() => {
          showTabLabel.value = [deepClone(showTabLabel.value[0]), setTabLabel(1)];
          emit("change", {
            value: [innerValue.value, endInnerValue.value]
          });
          datetimePickerView.value && datetimePickerView.value.setColumns(datetimePickerView.value.updateColumns());
          datetimePickerView1.value && datetimePickerView1.value.setColumns(datetimePickerView1.value.updateColumns());
        });
      }
      function onCancel() {
        popupShow.value = false;
        setTimeout(() => {
          if (region.value) {
            innerValue.value = deepClone(getDefaultInnerValue(true));
            endInnerValue.value = deepClone(getDefaultInnerValue(true, true));
          } else {
            innerValue.value = deepClone(getDefaultInnerValue());
          }
        }, 200);
        emit("cancel");
      }
      function onConfirm() {
        if (props.loading || isLoading.value)
          return;
        if (isPicking.value) {
          hasConfirmed.value = true;
          return;
        }
        const { beforeConfirm } = props;
        if (beforeConfirm) {
          beforeConfirm(
            region.value ? [innerValue.value, endInnerValue.value] : innerValue.value,
            (isPass) => {
              isPass && handleConfirm();
            },
            proxy.$.exposed
          );
        } else {
          handleConfirm();
        }
      }
      function onPickStart() {
        isPicking.value = true;
      }
      function onPickEnd() {
        isPicking.value = false;
        setTimeout(() => {
          if (hasConfirmed.value) {
            hasConfirmed.value = false;
            onConfirm();
          }
        }, 50);
      }
      function handleConfirm() {
        if (props.loading || isLoading.value || props.disabled) {
          popupShow.value = false;
          return;
        }
        const value = region.value ? [innerValue.value, endInnerValue.value] : innerValue.value;
        popupShow.value = false;
        emit("update:modelValue", value);
        emit("confirm", {
          value
        });
        setShowValue(false, true);
      }
      function setTabLabel(index = 0) {
        if (region.value) {
          let items = [];
          if (index === 0) {
            items = (datetimePickerView.value ? datetimePickerView.value.getSelects() : void 0) || innerValue.value && getSelects("before");
          } else {
            items = (datetimePickerView1.value ? datetimePickerView1.value.getSelects() : void 0) || endInnerValue.value && getSelects("after");
          }
          return defaultDisplayFormat2(items, true);
        } else {
          return "";
        }
      }
      function setShowValue(tab = false, isConfirm = false, beforeMount = false) {
        if (region.value) {
          const items = beforeMount ? innerValue.value && getSelects("before") || [] : datetimePickerView.value && datetimePickerView.value.getSelects && datetimePickerView.value.getSelects() || [];
          const endItems = beforeMount ? endInnerValue.value && getSelects("after") || [] : datetimePickerView1.value && datetimePickerView1.value.getSelects && datetimePickerView1.value.getSelects() || [];
          showValue.value = tab ? showValue.value : [
            props.modelValue[0] || isConfirm ? defaultDisplayFormat2(items) : "",
            props.modelValue[1] || isConfirm ? defaultDisplayFormat2(endItems) : ""
          ];
          showTabLabel.value = [defaultDisplayFormat2(items, true), defaultDisplayFormat2(endItems, true)];
        } else {
          const items = beforeMount ? innerValue.value && getSelects("before") || [] : datetimePickerView.value && datetimePickerView.value.getSelects && datetimePickerView.value.getSelects() || [];
          showValue.value = deepClone(props.modelValue || isConfirm ? defaultDisplayFormat2(items) : "");
        }
      }
      function defaultDisplayFormat2(items, tabLabel = false) {
        if (items.length === 0)
          return "";
        if (tabLabel && props.displayFormatTabLabel) {
          return props.displayFormatTabLabel(items);
        }
        if (props.displayFormat) {
          return props.displayFormat(items);
        }
        if (props.formatter) {
          const typeMaps = {
            year: ["year"],
            datetime: props.useSecond ? ["year", "month", "date", "hour", "minute", "second"] : ["year", "month", "date", "hour", "minute"],
            date: ["year", "month", "date"],
            time: props.useSecond ? ["hour", "minute", "second"] : ["hour", "minute"],
            "year-month": ["year", "month"]
          };
          return items.map((item, index) => {
            return props.formatter(typeMaps[props.type][index], item.value);
          }).join("");
        }
        switch (props.type) {
          case "year":
            return items[0].label;
          case "date":
            return `${items[0].label}-${items[1].label}-${items[2].label}`;
          case "year-month":
            return `${items[0].label}-${items[1].label}`;
          case "time":
            return props.useSecond ? `${items[0].label}:${items[1].label}:${items[2].label}` : `${items[0].label}:${items[1].label}`;
          case "datetime":
            return props.useSecond ? `${items[0].label}-${items[1].label}-${items[2].label} ${items[3].label}:${items[4].label}:${items[5].label}` : `${items[0].label}-${items[1].label}-${items[2].label} ${items[3].label}:${items[4].label}`;
        }
      }
      function setLoading(loading) {
        isLoading.value = loading;
      }
      function handleClear() {
        emit("clear");
        emit("update:modelValue", "");
        setShowValue(false, true);
      }
      __expose({
        open,
        close,
        setLoading
      });
      const __returned__ = { props, emit, translate, datetimePickerView, datetimePickerView1, showValue, popupShow, showStart, region, showTabLabel, innerValue, endInnerValue, isPicking, hasConfirmed, isLoading, proxy, cellClass, showClear, showArrow, handleBoundaryValue, startColumnFormatter, endColumnFormatter, customColumnFormatter, getSelects, noop, getDefaultInnerValue, open, close, showPopup, tabChange, onChangeStart, onChangeEnd, onCancel, onConfirm, onPickStart, onPickEnd, handleConfirm, setTabLabel, setShowValue, defaultDisplayFormat: defaultDisplayFormat2, setLoading, handleClear, wdPopup: __easycom_13, wdDatetimePickerView, wdCell: __easycom_5, get isArray() {
        return isArray;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$3);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-datetime-picker ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        !_ctx.$slots.default ? (vue.openBlock(), vue.createBlock($setup["wdCell"], {
          key: 0,
          title: _ctx.label,
          required: _ctx.required,
          size: _ctx.size,
          "title-width": _ctx.labelWidth,
          prop: _ctx.prop,
          rules: _ctx.rules,
          clickable: !_ctx.disabled && !_ctx.readonly,
          "value-align": _ctx.alignRight ? "right" : "left",
          "custom-class": $setup.cellClass,
          "custom-style": _ctx.customStyle,
          "custom-title-class": _ctx.customLabelClass,
          "custom-value-class": _ctx.customValueClass,
          ellipsis: _ctx.ellipsis,
          "use-title-slot": !!_ctx.$slots.label,
          "marker-side": _ctx.markerSide,
          onClick: $setup.showPopup
        }, vue.createSlots({
          default: vue.withCtx(() => [
            $setup.region ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              [
                $setup.isArray($setup.showValue) ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass($setup.showValue[0] ? "" : "wd-datetime-picker__placeholder")
                    },
                    vue.toDisplayString($setup.showValue[0] ? $setup.showValue[0] : _ctx.placeholder || $setup.translate("placeholder")),
                    3
                    /* TEXT, CLASS */
                  ),
                  vue.createTextVNode(
                    " " + vue.toDisplayString($setup.translate("to")) + " ",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass($setup.showValue[1] ? "" : "wd-datetime-picker__placeholder")
                    },
                    vue.toDisplayString($setup.showValue[1] ? $setup.showValue[1] : _ctx.placeholder || $setup.translate("placeholder")),
                    3
                    /* TEXT, CLASS */
                  )
                ])) : (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 1,
                    class: "wd-datetime-picker__cell-placeholder"
                  },
                  vue.toDisplayString(_ctx.placeholder || $setup.translate("placeholder")),
                  1
                  /* TEXT */
                ))
              ],
              64
              /* STABLE_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 1,
                class: vue.normalizeClass($setup.showValue ? "" : "wd-datetime-picker__placeholder")
              },
              vue.toDisplayString($setup.showValue ? $setup.showValue : _ctx.placeholder || $setup.translate("placeholder")),
              3
              /* TEXT, CLASS */
            ))
          ]),
          "right-icon": vue.withCtx(() => [
            $setup.showArrow ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
              key: 0,
              "custom-class": "wd-datetime-picker__arrow",
              name: "arrow-right"
            })) : $setup.showClear ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              onClick: vue.withModifiers($setup.handleClear, ["stop"])
            }, [
              vue.createVNode(_component_wd_icon, {
                "custom-class": "wd-datetime-picker__clear",
                name: "error-fill"
              })
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          _: 2
          /* DYNAMIC */
        }, [
          _ctx.$slots.label ? {
            name: "title",
            fn: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "label", {}, void 0, true)
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "required", "size", "title-width", "prop", "rules", "clickable", "value-align", "custom-class", "custom-style", "custom-title-class", "custom-value-class", "ellipsis", "use-title-slot", "marker-side"])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          onClick: $setup.showPopup
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])),
        vue.createCommentVNode("弹出层，picker-view 在隐藏时修改值，会触发多次change事件，从而导致所有列选中第一项，因此picker在关闭时不隐藏 "),
        vue.createVNode($setup["wdPopup"], {
          modelValue: $setup.popupShow,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.popupShow = $event),
          position: "bottom",
          "hide-when-close": false,
          "close-on-click-modal": _ctx.closeOnClickModal,
          "safe-area-inset-bottom": _ctx.safeAreaInsetBottom,
          "z-index": _ctx.zIndex,
          "root-portal": _ctx.rootPortal,
          onClose: $setup.onCancel,
          "custom-class": "wd-datetime-picker__popup"
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { class: "wd-datetime-picker__wraper" }, [
              vue.createCommentVNode("toolBar"),
              vue.createElementVNode(
                "view",
                {
                  class: "wd-datetime-picker__toolbar",
                  onTouchmove: $setup.noop
                },
                [
                  vue.createCommentVNode("取消按钮"),
                  vue.createElementVNode(
                    "view",
                    {
                      class: "wd-datetime-picker__action wd-datetime-picker__action--cancel",
                      onClick: $setup.onCancel
                    },
                    vue.toDisplayString(_ctx.cancelButtonText || $setup.translate("cancel")),
                    1
                    /* TEXT */
                  ),
                  vue.createCommentVNode("标题"),
                  _ctx.title ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: "wd-datetime-picker__title"
                    },
                    vue.toDisplayString(_ctx.title),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createCommentVNode("确定按钮"),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(`wd-datetime-picker__action ${_ctx.loading || $setup.isLoading ? "is-loading" : ""}`),
                      onClick: $setup.onConfirm
                    },
                    vue.toDisplayString(_ctx.confirmButtonText || $setup.translate("confirm")),
                    3
                    /* TEXT, CLASS */
                  )
                ],
                32
                /* NEED_HYDRATION */
              ),
              vue.createCommentVNode(" 区域选择tab展示 "),
              $setup.region ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "wd-datetime-picker__region-tabs"
              }, [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(`wd-datetime-picker__region ${$setup.showStart ? "is-active" : ""} `),
                    onClick: $setup.tabChange
                  },
                  [
                    vue.createElementVNode(
                      "view",
                      null,
                      vue.toDisplayString($setup.translate("start")),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "wd-datetime-picker__region-time" },
                      vue.toDisplayString($setup.showTabLabel[0]),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(`wd-datetime-picker__region ${$setup.showStart ? "" : "is-active"}`),
                    onClick: $setup.tabChange
                  },
                  [
                    vue.createElementVNode(
                      "view",
                      null,
                      vue.toDisplayString($setup.translate("end")),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "wd-datetime-picker__region-time" },
                      vue.toDisplayString($setup.showTabLabel[1]),
                      1
                      /* TEXT */
                    )
                  ],
                  2
                  /* CLASS */
                )
              ])) : vue.createCommentVNode("v-if", true),
              vue.createCommentVNode("datetimePickerView"),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass($setup.showStart ? "wd-datetime-picker__show" : "wd-datetime-picker__hidden")
                },
                [
                  vue.createVNode($setup["wdDatetimePickerView"], {
                    "custom-class": _ctx.customViewClass,
                    ref: "datetimePickerView",
                    type: _ctx.type,
                    modelValue: $setup.innerValue,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.innerValue = $event),
                    loading: _ctx.loading || $setup.isLoading,
                    "loading-color": _ctx.loadingColor,
                    "columns-height": _ctx.columnsHeight,
                    "value-key": _ctx.valueKey,
                    "label-key": _ctx.labelKey,
                    formatter: _ctx.formatter,
                    filter: _ctx.filter,
                    "column-formatter": $setup.isArray(_ctx.modelValue) ? $setup.startColumnFormatter : void 0,
                    "max-hour": _ctx.maxHour,
                    "min-hour": _ctx.minHour,
                    "max-date": _ctx.maxDate,
                    "min-date": _ctx.minDate,
                    "max-minute": _ctx.maxMinute,
                    "min-minute": _ctx.minMinute,
                    "use-second": _ctx.useSecond,
                    "min-second": _ctx.minSecond,
                    "max-second": _ctx.maxSecond,
                    "immediate-change": _ctx.immediateChange,
                    onChange: $setup.onChangeStart,
                    onPickstart: $setup.onPickStart,
                    onPickend: $setup.onPickEnd
                  }, null, 8, ["custom-class", "type", "modelValue", "loading", "loading-color", "columns-height", "value-key", "label-key", "formatter", "filter", "column-formatter", "max-hour", "min-hour", "max-date", "min-date", "max-minute", "min-minute", "use-second", "min-second", "max-second", "immediate-change"])
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass($setup.showStart ? "wd-datetime-picker__hidden" : "wd-datetime-picker__show")
                },
                [
                  vue.createVNode($setup["wdDatetimePickerView"], {
                    "custom-class": _ctx.customViewClass,
                    ref: "datetimePickerView1",
                    type: _ctx.type,
                    modelValue: $setup.endInnerValue,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.endInnerValue = $event),
                    loading: _ctx.loading || $setup.isLoading,
                    "loading-color": _ctx.loadingColor,
                    "columns-height": _ctx.columnsHeight,
                    "value-key": _ctx.valueKey,
                    "label-key": _ctx.labelKey,
                    formatter: _ctx.formatter,
                    filter: _ctx.filter,
                    "column-formatter": $setup.isArray(_ctx.modelValue) ? $setup.endColumnFormatter : void 0,
                    "max-hour": _ctx.maxHour,
                    "min-hour": _ctx.minHour,
                    "max-date": _ctx.maxDate,
                    "min-date": _ctx.minDate,
                    "max-minute": _ctx.maxMinute,
                    "min-minute": _ctx.minMinute,
                    "use-second": _ctx.useSecond,
                    "min-second": _ctx.minSecond,
                    "max-second": _ctx.maxSecond,
                    "immediate-change": _ctx.immediateChange,
                    onChange: $setup.onChangeEnd,
                    onPickstart: $setup.onPickStart,
                    onPickend: $setup.onPickEnd
                  }, null, 8, ["custom-class", "type", "modelValue", "loading", "loading-color", "columns-height", "value-key", "label-key", "formatter", "filter", "column-formatter", "max-hour", "min-hour", "max-date", "min-date", "max-minute", "min-minute", "use-second", "min-second", "max-second", "immediate-change"])
                ],
                2
                /* CLASS */
              )
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue", "close-on-click-modal", "safe-area-inset-bottom", "z-index", "root-portal"])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1$2 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-2a8ca3bd"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-datetime-picker/wd-datetime-picker.vue"]]);
  const textareaProps = {
    ...baseProps,
    /**
     * * 自定义文本域容器class名称。
     * 类型：string
     */
    customTextareaContainerClass: makeStringProp(""),
    /**
     * * 自定义文本域class名称。
     * 类型：string
     */
    customTextareaClass: makeStringProp(""),
    /**
     * * 自定义标签class名称。
     * 类型：string
     */
    customLabelClass: makeStringProp(""),
    // 原生属性
    /**
     * * 绑定值。
     * 类型：string | number
     */
    modelValue: makeNumericProp(""),
    /**
     * * 占位文本。
     * 类型：string
     * 默认值：'请输入...'
     */
    placeholder: String,
    /**
     * 指定placeholder的样式。
     * 类型：string
     */
    placeholderStyle: String,
    /**
     * * 指定placeholder的样式类。
     * 类型：string
     * 默认值：空字符串
     */
    placeholderClass: makeStringProp(""),
    /**
     * * 禁用输入框。
     * 类型：boolean
     * 默认值：false
     */
    disabled: makeBooleanProp(false),
    /**
     * * 最大输入长度，设置为-1表示不限制最大长度。
     * 类型：number
     * 默认值：-1
     */
    maxlength: makeNumberProp(-1),
    /**
     * * 自动聚焦并拉起键盘。
     * 类型：boolean
     * 默认值：false
     */
    autoFocus: makeBooleanProp(false),
    /**
     * * 获取焦点。
     * 类型：boolean
     * 默认值：false
     */
    focus: makeBooleanProp(false),
    /**
     * * 是否自动增高输入框高度，style.height属性在auto-height生效时不生效。
     * 类型：boolean
     * 默认值：false
     */
    autoHeight: makeBooleanProp(false),
    /**
     * * 如果textarea处于position:fixed区域，需要设置此属性为true。
     * 类型：boolean
     * 默认值：false
     */
    fixed: makeBooleanProp(false),
    /**
     * * 指定光标与键盘的距离，取textarea距离底部的距离和cursor-spacing指定的距离的最小值作为实际距离。
     * 类型：number
     * 默认值：0
     */
    cursorSpacing: makeNumberProp(0),
    /**
     * * 指定focus时的光标位置。
     * 类型：number
     * 默认值：-1
     */
    cursor: makeNumberProp(-1),
    /**
     * * 设置键盘右下角按钮的文字。
     * 类型：string
     * 默认值：'done'
     * 可选值有'done', 'go', 'next', 'search', 'send'
     */
    confirmType: String,
    /**
     * * 点击键盘右下角按钮时是否保持键盘不收起。
     * 类型：boolean
     * 默认值：false
     */
    confirmHold: makeBooleanProp(false),
    /**
     * * 是否显示键盘上方带有“完成”按钮那一栏。
     * 类型：boolean
     * 默认值：true
     */
    showConfirmBar: makeBooleanProp(true),
    /**
     * * 光标起始位置，自动聚集时有效，需与selection-end搭配使用。
     * 类型：number
     * 默认值：-1
     */
    selectionStart: makeNumberProp(-1),
    /**
     * * 光标结束位置，自动聚集时有效，需与selection-start搭配使用。
     * 类型：number
     * 默认值：-1
     */
    selectionEnd: makeNumberProp(-1),
    /**
     * * 键盘弹起时是否自动上推页面。
     * 类型：boolean
     * 默认值：true
     */
    adjustPosition: makeBooleanProp(true),
    /**
     * * 是否去掉iOS下的默认内边距。
     * 类型：boolean
     * 默认值：false
     */
    disableDefaultPadding: makeBooleanProp(false),
    /**
     * * focus状态下点击页面时是否不收起键盘。
     * 类型：boolean
     * 默认值：false
     */
    holdKeyboard: makeBooleanProp(false),
    // 非原生属性
    /**
     * * 显示为密码框。
     * 类型：boolean
     * 默认值：false
     */
    showPassword: makeBooleanProp(false),
    /**
     * * 是否显示清空按钮。
     * 类型：boolean
     * 默认值：false
     */
    clearable: makeBooleanProp(false),
    /**
     * * 输入框只读状态。
     * 类型：boolean
     * 默认值：false
     */
    readonly: makeBooleanProp(false),
    /**
     * * 前置图标，icon组件中的图标类名。
     * 类型：string
     */
    prefixIcon: String,
    /**
     * * 是否显示字数限制，需要同时设置maxlength。
     * 类型：boolean
     * 默认值：false
     */
    showWordLimit: makeBooleanProp(false),
    /**
     * 设置左侧标题。
     * 类型：string
     */
    label: String,
    /**
     * 设置左侧标题宽度。
     * 类型：string
     */
    labelWidth: makeStringProp(""),
    /**
     * * 设置输入框大小。
     * 类型：string
     */
    size: String,
    /**
     * * 设置输入框错误状态（红色）。
     * 类型：boolean
     * 默认值：false
     */
    error: makeBooleanProp(false),
    /**
     * * 当存在label属性时，设置标题和输入框垂直居中，默认为顶部居中。
     * 类型：boolean
     * 默认值：false
     */
    center: makeBooleanProp(false),
    /**
     * * 非cell类型下是否隐藏下划线。
     * 类型：boolean
     * 默认值：false
     */
    noBorder: makeBooleanProp(false),
    /**
     * * cell类型下必填样式。
     * 类型：boolean
     * 默认值：false
     */
    required: makeBooleanProp(false),
    /**
     * * 表单域model字段名，在使用表单校验功能的情况下，该属性是必填的。
     * 类型：string
     */
    prop: makeStringProp(""),
    /**
     * * 表单验证规则。
     * 类型：FormItemRule[]
     * 默认值：[]
     */
    rules: makeArrayProp(),
    /**
     * 显示清除图标的时机，always 表示输入框不为空时展示，focus 表示输入框聚焦且不为空时展示
     * 类型: "focus" | "always"
     * 默认值: "always"
     */
    clearTrigger: makeStringProp("always"),
    /**
     * 是否在点击清除按钮时聚焦输入框
     * 类型: boolean
     * 默认值: true
     */
    focusWhenClear: makeBooleanProp(true),
    /**
     * 是否忽略组件内对文本合成系统事件的处理。为 false 时将触发 compositionstart、compositionend、compositionupdate 事件，且在文本合成期间会触发 input 事件
     * 类型: boolean
     * 默认值: true
     */
    ignoreCompositionEvent: makeBooleanProp(true),
    /**
     * 它提供了用户在编辑元素或其内容时可能输入的数据类型的提示。在符合条件的高版本webview里，uni-app的web和app-vue平台中可使用本属性。
     * 类型: InputMode
     * 可选值: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | "password"
     * 默认值: "text"
     */
    inputmode: makeStringProp("text"),
    /**
     * 必填标记位置，可选值：before（标签前）、after（标签后）
     */
    markerSide: makeStringProp("before")
  };
  const __default__$h = {
    name: "wd-textarea",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$u = /* @__PURE__ */ vue.defineComponent({
    ...__default__$h,
    props: textareaProps,
    emits: [
      "update:modelValue",
      "clear",
      "blur",
      "focus",
      "input",
      "keyboardheightchange",
      "confirm",
      "linechange",
      "clickprefixicon",
      "click"
    ],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const { translate } = useTranslate("textarea");
      const props = __props;
      const emit = __emit;
      const slots = vue.useSlots();
      const placeholderValue = vue.computed(() => {
        return isDef(props.placeholder) ? props.placeholder : translate("placeholder");
      });
      const clearing = vue.ref(false);
      const focused = vue.ref(false);
      const focusing = vue.ref(false);
      const inputValue = vue.ref("");
      const cell = useCell();
      vue.watch(
        () => props.focus,
        (newValue) => {
          focused.value = newValue;
        },
        { immediate: true, deep: true }
      );
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          inputValue.value = isDef(newValue) ? String(newValue) : "";
        },
        { immediate: true, deep: true }
      );
      const { parent: form } = useParent(FORM_KEY);
      const showClear = vue.computed(() => {
        const { disabled, readonly, clearable, clearTrigger } = props;
        if (clearable && !readonly && !disabled && inputValue.value && (clearTrigger === "always" || props.clearTrigger === "focus" && focusing.value)) {
          return true;
        } else {
          return false;
        }
      });
      const showWordCount = vue.computed(() => {
        const { disabled, readonly, maxlength, showWordLimit } = props;
        return Boolean(!disabled && !readonly && isDef(maxlength) && maxlength > -1 && showWordLimit);
      });
      const errorMessage = vue.computed(() => {
        if (form && props.prop && form.errorMessages && form.errorMessages[props.prop]) {
          return form.errorMessages[props.prop];
        } else {
          return "";
        }
      });
      const isRequired = vue.computed(() => {
        let formRequired = false;
        if (form && form.props.rules) {
          const rules = form.props.rules;
          for (const key in rules) {
            if (Object.prototype.hasOwnProperty.call(rules, key) && key === props.prop && Array.isArray(rules[key])) {
              formRequired = rules[key].some((rule) => rule.required);
            }
          }
        }
        return props.required || props.rules.some((rule) => rule.required) || formRequired;
      });
      const currentLength = vue.computed(() => {
        return Array.from(String(formatValue(props.modelValue))).length;
      });
      const rootClass = vue.computed(() => {
        return `wd-textarea   ${props.label || slots.label ? "is-cell" : ""} ${props.center ? "is-center" : ""} ${cell.border.value ? "is-border" : ""} ${props.size ? "is-" + props.size : ""} ${props.error ? "is-error" : ""} ${props.disabled ? "is-disabled" : ""} ${props.autoHeight ? "is-auto-height" : ""} ${currentLength.value > 0 ? "is-not-empty" : ""}  ${props.noBorder ? "is-no-border" : ""} ${props.customClass}`;
      });
      const labelClass = vue.computed(() => {
        return `wd-textarea__label ${props.customLabelClass}`;
      });
      const inputPlaceholderClass = vue.computed(() => {
        return `wd-textarea__placeholder  ${props.placeholderClass}`;
      });
      const countClass = vue.computed(() => {
        return `${currentLength.value > 0 ? "wd-textarea__count-current" : ""} ${currentLength.value > props.maxlength ? "is-error" : ""}`;
      });
      const labelStyle = vue.computed(() => {
        return props.labelWidth ? objToStyle({
          "min-width": props.labelWidth,
          "max-width": props.labelWidth
        }) : "";
      });
      vue.onBeforeMount(() => {
        initState();
      });
      function initState() {
        inputValue.value = formatValue(inputValue.value);
        emit("update:modelValue", inputValue.value);
      }
      function formatValue(value) {
        if (value === null || value === void 0)
          return "";
        const { maxlength, showWordLimit } = props;
        if (showWordLimit && maxlength !== -1 && String(value).length > maxlength) {
          return value.toString().substring(0, maxlength);
        }
        return `${value}`;
      }
      async function handleClear() {
        focusing.value = false;
        inputValue.value = "";
        if (props.focusWhenClear) {
          clearing.value = true;
          focused.value = false;
        }
        await pause();
        if (props.focusWhenClear) {
          focused.value = true;
          focusing.value = true;
        }
        emit("update:modelValue", inputValue.value);
        emit("clear");
      }
      async function handleBlur({ detail }) {
        await pause(150);
        if (clearing.value) {
          clearing.value = false;
          return;
        }
        focusing.value = false;
        emit("blur", {
          value: inputValue.value,
          cursor: detail.cursor ? detail.cursor : null
        });
      }
      function handleFocus({ detail }) {
        focusing.value = true;
        emit("focus", detail);
      }
      function handleInput({ detail }) {
        inputValue.value = formatValue(inputValue.value);
        emit("update:modelValue", inputValue.value);
        emit("input", detail);
      }
      function handleKeyboardheightchange({ detail }) {
        emit("keyboardheightchange", detail);
      }
      function handleConfirm({ detail }) {
        emit("confirm", detail);
      }
      function handleLineChange({ detail }) {
        emit("linechange", detail);
      }
      function onClickPrefixIcon() {
        emit("clickprefixicon");
      }
      const __returned__ = { translate, props, emit, slots, placeholderValue, clearing, focused, focusing, inputValue, cell, form, showClear, showWordCount, errorMessage, isRequired, currentLength, rootClass, labelClass, inputPlaceholderClass, countClass, labelStyle, initState, formatValue, handleClear, handleBlur, handleFocus, handleInput, handleKeyboardheightchange, handleConfirm, handleLineChange, onClickPrefixIcon, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        _ctx.label || _ctx.$slots.label ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: "wd-textarea__label",
            style: vue.normalizeStyle($setup.labelStyle)
          },
          [
            $setup.isRequired && _ctx.markerSide === "before" ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 0,
              class: "wd-textarea__required wd-textarea__required--left"
            }, "*")) : vue.createCommentVNode("v-if", true),
            _ctx.prefixIcon || _ctx.$slots.prefix ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "wd-textarea__prefix"
            }, [
              _ctx.prefixIcon && !_ctx.$slots.prefix ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-textarea__icon",
                name: _ctx.prefixIcon,
                onClick: $setup.onClickPrefixIcon
              }, null, 8, ["name"])) : vue.renderSlot(_ctx.$slots, "prefix", { key: 1 }, void 0, true)
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "wd-textarea__label-inner" }, [
              _ctx.label && !_ctx.$slots.label ? (vue.openBlock(), vue.createElementBlock(
                "text",
                { key: 0 },
                vue.toDisplayString(_ctx.label),
                1
                /* TEXT */
              )) : _ctx.$slots.label ? vue.renderSlot(_ctx.$slots, "label", { key: 1 }, void 0, true) : vue.createCommentVNode("v-if", true)
            ]),
            $setup.isRequired && _ctx.markerSide === "after" ? (vue.openBlock(), vue.createElementBlock("text", {
              key: 2,
              class: "wd-textarea__required"
            }, "*")) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode(" 文本域 "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(`wd-textarea__value ${$setup.showClear ? "is-suffix" : ""} ${_ctx.customTextareaContainerClass} ${$setup.showWordCount ? "is-show-limit" : ""}`)
          },
          [
            vue.withDirectives(vue.createElementVNode("textarea", {
              class: vue.normalizeClass(`wd-textarea__inner ${_ctx.customTextareaClass}`),
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
              "show-count": false,
              placeholder: $setup.placeholderValue,
              disabled: _ctx.disabled || _ctx.readonly,
              maxlength: _ctx.maxlength,
              focus: $setup.focused,
              "auto-focus": _ctx.autoFocus,
              "placeholder-style": _ctx.placeholderStyle,
              "placeholder-class": $setup.inputPlaceholderClass,
              "auto-height": _ctx.autoHeight,
              "cursor-spacing": _ctx.cursorSpacing,
              fixed: _ctx.fixed,
              cursor: _ctx.cursor,
              "show-confirm-bar": _ctx.showConfirmBar,
              "selection-start": _ctx.selectionStart,
              "selection-end": _ctx.selectionEnd,
              "adjust-position": _ctx.adjustPosition,
              "hold-keyboard": _ctx.holdKeyboard,
              "confirm-type": _ctx.confirmType,
              "confirm-hold": _ctx.confirmHold,
              "disable-default-padding": _ctx.disableDefaultPadding,
              ignoreCompositionEvent: _ctx.ignoreCompositionEvent,
              inputmode: _ctx.inputmode,
              onInput: $setup.handleInput,
              onFocus: $setup.handleFocus,
              onBlur: $setup.handleBlur,
              onConfirm: $setup.handleConfirm,
              onLinechange: $setup.handleLineChange,
              onKeyboardheightchange: $setup.handleKeyboardheightchange
            }, null, 42, ["placeholder", "disabled", "maxlength", "focus", "auto-focus", "placeholder-style", "placeholder-class", "auto-height", "cursor-spacing", "fixed", "cursor", "show-confirm-bar", "selection-start", "selection-end", "adjust-position", "hold-keyboard", "confirm-type", "confirm-hold", "disable-default-padding", "ignoreCompositionEvent", "inputmode"]), [
              [vue.vModelText, $setup.inputValue]
            ]),
            $setup.errorMessage ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "wd-textarea__error-message"
              },
              vue.toDisplayString($setup.errorMessage),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            $setup.props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "wd-textarea__readonly-mask"
            })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "wd-textarea__suffix" }, [
              $setup.showClear ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                key: 0,
                "custom-class": "wd-textarea__clear",
                name: "error-fill",
                onClick: $setup.handleClear
              })) : vue.createCommentVNode("v-if", true),
              $setup.showWordCount ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "wd-textarea__count"
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass($setup.countClass)
                  },
                  vue.toDisplayString($setup.currentLength),
                  3
                  /* TEXT, CLASS */
                ),
                vue.createTextVNode(
                  " /" + vue.toDisplayString(_ctx.maxlength),
                  1
                  /* TEXT */
                )
              ])) : vue.createCommentVNode("v-if", true)
            ])
          ],
          2
          /* CLASS */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__scopeId", "data-v-7d71e04e"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-textarea/wd-textarea.vue"]]);
  const videoPreviewProps = {
    ...baseProps
  };
  const __default__$g = {
    name: "wd-video-preview",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$t = /* @__PURE__ */ vue.defineComponent({
    ...__default__$g,
    props: videoPreviewProps,
    setup(__props, { expose: __expose }) {
      const showPopup = vue.ref(false);
      const previdewVideo = vue.reactive({ url: "", poster: "", title: "" });
      function open(video) {
        showPopup.value = true;
        previdewVideo.url = video.url;
        previdewVideo.poster = video.poster;
        previdewVideo.title = video.title;
      }
      function close() {
        showPopup.value = false;
        vue.nextTick(() => {
          handleClosed();
        });
      }
      function handleClosed() {
        previdewVideo.url = "";
        previdewVideo.poster = "";
        previdewVideo.title = "";
      }
      __expose({
        open,
        close
      });
      const __returned__ = { showPopup, previdewVideo, open, close, handleClosed, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.showPopup ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(`wd-video-preview ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle),
        onClick: $setup.close
      },
      [
        vue.createElementVNode("view", {
          class: "wd-video-preview__video",
          onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          $setup.previdewVideo.url ? (vue.openBlock(), vue.createElementBlock("video", {
            key: 0,
            class: "wd-video-preview__video",
            controls: true,
            poster: $setup.previdewVideo.poster,
            title: $setup.previdewVideo.title,
            "play-btn-position": "center",
            enableNative: true,
            src: $setup.previdewVideo.url,
            "enable-progress-gesture": false
          }, null, 8, ["poster", "title", "src"])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createVNode($setup["wdIcon"], {
          name: "close",
          "custom-class": `wd-video-preview__close`,
          onClick: $setup.close
        })
      ],
      6
      /* CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const wdVideoPreview = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-f37e4d17"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-video-preview/wd-video-preview.vue"]]);
  const uploadProps = {
    ...baseProps,
    /**
     * 上传的文件列表,例如:[{name:'food.jpg',url:'https://xxx.cdn.com/xxx.jpg'}]
     * 类型：array
     * 默认值：[]
     */
    fileList: makeArrayProp(),
    /**
     * 必选参数，上传的地址
     * 类型：string
     * 默认值：''
     */
    action: makeStringProp(""),
    /**
     * 设置上传的请求头部
     * 类型：object
     * 默认值：{}
     */
    header: { type: Object, default: () => ({}) },
    /**
     * 是否支持多选文件
     * 类型：boolean
     * 默认值：false
     */
    multiple: makeBooleanProp(false),
    /**
     * 是否禁用
     * 类型：boolean
     * 默认值：false
     */
    disabled: makeBooleanProp(false),
    /**
     * 最大允许上传个数
     * 类型：number
     * 默认值：无
     */
    limit: Number,
    /**
     * 限制上传个数的情况下，是否展示当前上传的个数
     * 类型：boolean
     * 默认值：true
     */
    showLimitNum: makeBooleanProp(true),
    /**
     * 文件大小限制，单位为byte
     * 类型：number
     * 默认值：Number.MAX_VALUE
     */
    maxSize: makeNumberProp(Number.MAX_VALUE),
    /**
     * 选择图片的来源，chooseImage接口详细参数，查看官方手册
     * 类型：array
     * 默认值：['album','camera']
     */
    sourceType: {
      type: Array,
      default: () => ["album", "camera"]
    },
    /**
     * 所选的图片的尺寸，chooseImage接口详细参数，查看官方手册
     * 类型：array
     * 默认值：['original','compressed']
     */
    sizeType: {
      type: Array,
      default: () => ["original", "compressed"]
    },
    /**
     * 文件对应的key，开发者在服务端可以通过这个key获取文件的二进制内容，uploadFile接口详细参数，查看官方手册
     * 类型：string
     * 默认值：'file'
     */
    name: makeStringProp("file"),
    /**
     * HTTP请求中其他额外的formdata，uploadFile接口详细参数，查看官方手册
     * 类型：object
     * 默认值：{}
     */
    formData: { type: Object, default: () => ({}) },
    /**
     * 预览失败执行操作
     * 类型：function({index,imgList})
     * 默认值：-
     */
    onPreviewFail: Function,
    /**
     * 上传文件之前的钩子，参数为上传的文件和文件列表，若返回false或者返回Promise且被reject，则停止上传。
     * 类型：function({files,fileList,resolve})
     * 默认值：-
     */
    beforeUpload: Function,
    /**
     * 选择图片之前的钩子，参数为文件列表，若返回false或者返回Promise且被reject，则停止上传。
     * 类型：function({fileList,resolve})
     * 默认值：-
     */
    beforeChoose: Function,
    /**
     * 删除文件之前的钩子，参数为要删除的文件和文件列表，若返回false或者返回Promise且被reject，则停止上传。
     * 类型：function({file,fileList,resolve})
     * 默认值：-
     */
    beforeRemove: Function,
    /**
     * 图片预览前的钩子，参数为预览的图片下标和图片列表，若返回false或者返回Promise且被reject，则停止上传。
     * 类型：function({index,imgList,resolve})
     * 默认值：-
     */
    beforePreview: Function,
    /**
     * 构建上传formData的钩子，参数为上传的文件、待处理的formData，返回值为处理后的formData，若返回false或者返回Promise且被reject，则停止上传。
     * 类型：function({file,formData,resolve})
     * 默认值：-
     * 最低版本：0.1.61
     */
    buildFormData: Function,
    /**
     * 加载中图标类型
     * 类型：string
     * 默认值：'ring'
     */
    loadingType: makeStringProp("ring"),
    /**
     * 加载中图标颜色
     * 类型：string
     * 默认值：'#ffffff'
     */
    loadingColor: makeStringProp("#ffffff"),
    /**
     * 文件类型，可选值：'image' | 'video' | 'media' | 'all' | 'file'
     * 默认值：image
     * 描述：'media'表示同时支持'image'和'video'，'file'表示支持除'image'和'video'外的所有文件类型，'all'标识支持全部类型文件
     * 'media'和'file'仅微信支持，'all'仅微信和H5支持
     */
    accept: makeStringProp("image"),
    /**
     * file 数据结构中，status 对应的 key
     * 类型：string
     * 默认值：'status'
     */
    statusKey: makeStringProp("status"),
    /**
     * 加载中图标尺寸
     * 类型：string
     * 默认值：'24px'
     */
    loadingSize: makeStringProp("24px"),
    /**
     * 是否压缩视频，当 accept 为 video 时生效。
     * 类型：boolean
     * 默认值：true
     */
    compressed: makeBooleanProp(true),
    /**
     * 拍摄视频最长拍摄时间，当 accept 为 video | media 时生效，单位秒。
     * 类型：number
     * 默认值：60
     */
    maxDuration: makeNumberProp(60),
    /**
     * 使用前置或者后置相机，当 accept 为 video | media 时生效，可选值为：back｜front。
     * 类型：UploadCameraType
     * 默认值：'back'
     */
    camera: makeStringProp("back"),
    /**
     * 预览图片的mode属性
     */
    imageMode: makeStringProp("aspectFit"),
    /**
     * 接口响应的成功状态（statusCode）值
     */
    successStatus: makeNumberProp(200),
    /**
     * 自定义上传按钮样式
     * 类型：string
     */
    customEvokeClass: makeStringProp(""),
    /**
     * 自定义预览图片列表样式
     * 类型：string
     */
    customPreviewClass: makeStringProp(""),
    /**
     * 是否选择文件后自动上传
     * 类型：boolean
     */
    autoUpload: makeBooleanProp(true),
    /**
     * 点击已上传时是否可以重新上传
     * 类型：boolean
     * 默认值：false
     */
    reupload: makeBooleanProp(false),
    /**
     * 自定义上传文件的请求方法
     * 类型：UploadMethod
     * 默认值：-
     */
    uploadMethod: Function,
    /**
     * 根据文件拓展名过滤,每一项都不能是空字符串。默认不过滤。
     * H5支持全部类型过滤。
     * 微信小程序支持all和file时过滤,其余平台不支持。
     */
    extension: Array
  };
  const __default__$f = {
    name: "wd-upload",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$s = /* @__PURE__ */ vue.defineComponent({
    ...__default__$f,
    props: uploadProps,
    emits: ["fail", "change", "success", "progress", "oversize", "chooseerror", "remove", "update:fileList"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      __expose({
        submit: () => startUploadFiles(),
        abort: () => abort()
      });
      const { translate } = useTranslate("upload");
      const uploadFiles = vue.ref([]);
      const showUpload = vue.computed(() => !props.limit || uploadFiles.value.length < props.limit);
      const videoPreview = vue.ref();
      const { startUpload, abort, chooseFile, UPLOAD_STATUS: UPLOAD_STATUS2 } = useUpload();
      vue.watch(
        () => props.fileList,
        (val) => {
          const { statusKey } = props;
          if (isEqual(val, uploadFiles.value))
            return;
          const uploadFileList = val.map((item) => {
            item[statusKey] = item[statusKey] || "success";
            item.response = item.response || "";
            return { ...item, uid: context.id++ };
          });
          uploadFiles.value = uploadFileList;
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.limit,
        (val) => {
          if (val && val < uploadFiles.value.length) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue:172", "[wot-design]Error: props limit must less than fileList.length");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.beforePreview,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue:185", "The type of beforePreview must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.onPreviewFail,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue:198", "The type of onPreviewFail must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.beforeRemove,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue:211", "The type of beforeRemove must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.beforeUpload,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue:224", "The type of beforeUpload must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.beforeChoose,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue:237", "The type of beforeChoose must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.buildFormData,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue:250", "The type of buildFormData must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      function emitFileList() {
        emit("update:fileList", uploadFiles.value);
      }
      function startUploadFiles() {
        const { buildFormData, formData = {}, statusKey } = props;
        const { action, name, header = {}, accept, successStatus, uploadMethod } = props;
        const statusCode = isDef(successStatus) ? successStatus : 200;
        for (const uploadFile of uploadFiles.value) {
          if (uploadFile[statusKey] === UPLOAD_STATUS2.PENDING) {
            if (buildFormData) {
              buildFormData({
                file: uploadFile,
                formData,
                resolve: (formData2) => {
                  formData2 && startUpload(uploadFile, {
                    action,
                    header,
                    name,
                    formData: formData2,
                    fileType: accept,
                    statusCode,
                    statusKey,
                    uploadMethod,
                    onSuccess: handleSuccess,
                    onError: handleError,
                    onProgress: handleProgress
                  });
                }
              });
            } else {
              startUpload(uploadFile, {
                action,
                header,
                name,
                formData,
                fileType: accept,
                statusCode,
                statusKey,
                uploadMethod,
                onSuccess: handleSuccess,
                onError: handleError,
                onProgress: handleProgress
              });
            }
          }
        }
      }
      function getImageInfo(img) {
        return new Promise((resolve, reject) => {
          uni.getImageInfo({
            src: img,
            success: (res) => {
              resolve(res);
            },
            fail: (error) => {
              reject(error);
            }
          });
        });
      }
      function initFile(file, currentIndex) {
        const { statusKey } = props;
        const initState = {
          uid: context.id++,
          // 仅h5支持 name
          name: file.name || "",
          thumb: file.thumb || "",
          [statusKey]: "pending",
          size: file.size || 0,
          url: file.path,
          percent: 0
        };
        if (typeof currentIndex === "number") {
          uploadFiles.value.splice(currentIndex, 1, initState);
        } else {
          uploadFiles.value.push(initState);
        }
        if (props.autoUpload) {
          startUploadFiles();
        }
      }
      function handleError(err, file, formData) {
        const { statusKey } = props;
        const index = uploadFiles.value.findIndex((item) => item.uid === file.uid);
        if (index > -1) {
          uploadFiles.value[index][statusKey] = "fail";
          uploadFiles.value[index].error = err.message;
          uploadFiles.value[index].response = err;
          emit("fail", { error: err, file, formData });
          emitFileList();
        }
      }
      function handleSuccess(res, file, formData) {
        const { statusKey } = props;
        const index = uploadFiles.value.findIndex((item) => item.uid === file.uid);
        if (index > -1) {
          uploadFiles.value[index][statusKey] = "success";
          uploadFiles.value[index].response = res.data;
          emit("change", { fileList: uploadFiles.value });
          emit("success", { file, fileList: uploadFiles.value, formData });
          emitFileList();
        }
      }
      function handleProgress(res, file) {
        const index = uploadFiles.value.findIndex((item) => item.uid === file.uid);
        if (index > -1) {
          uploadFiles.value[index].percent = res.progress;
          emit("progress", { response: res, file });
        }
      }
      function onChooseFile(currentIndex) {
        const { multiple, maxSize, accept, sizeType, limit, sourceType, compressed, maxDuration, camera, beforeUpload, extension } = props;
        chooseFile({
          multiple: isDef(currentIndex) ? false : multiple,
          sizeType,
          sourceType,
          maxCount: limit ? limit - uploadFiles.value.length : limit,
          accept,
          compressed,
          maxDuration,
          camera,
          extension
        }).then((res) => {
          let files = res;
          if (!multiple) {
            files = files.slice(0, 1);
          }
          const mapFiles = async (files2) => {
            for (let index = 0; index < files2.length; index++) {
              const file = files2[index];
              if (file.type === "image" && !file.size) {
                const imageInfo = await getImageInfo(file.path);
                file.size = imageInfo.width * imageInfo.height;
              }
              Number(file.size) <= maxSize ? initFile(file, currentIndex) : emit("oversize", { file });
            }
          };
          if (beforeUpload) {
            beforeUpload({
              files,
              fileList: uploadFiles.value,
              resolve: (isPass) => {
                isPass && mapFiles(files);
              }
            });
          } else {
            mapFiles(files);
          }
        }).catch((error) => {
          emit("chooseerror", { error });
        });
      }
      function handleChoose(index) {
        if (props.disabled)
          return;
        const { beforeChoose } = props;
        if (beforeChoose) {
          beforeChoose({
            fileList: uploadFiles.value,
            resolve: (isPass) => {
              isPass && onChooseFile(index);
            }
          });
        } else {
          onChooseFile(index);
        }
      }
      function handleRemove(file) {
        uploadFiles.value.splice(
          uploadFiles.value.findIndex((item) => item.uid === file.uid),
          1
        );
        emit("change", {
          fileList: uploadFiles.value
        });
        emit("remove", { file });
        emitFileList();
      }
      function removeFile(index) {
        const { beforeRemove } = props;
        const intIndex = index;
        const file = uploadFiles.value[intIndex];
        if (beforeRemove) {
          beforeRemove({
            file,
            index: intIndex,
            fileList: uploadFiles.value,
            resolve: (isPass) => {
              isPass && handleRemove(file);
            }
          });
        } else {
          handleRemove(file);
        }
      }
      function handlePreviewFile(file) {
        uni.openDocument({
          filePath: file.url,
          showMenu: true
        });
      }
      function handlePreviewImage(index, lists) {
        const { onPreviewFail } = props;
        uni.previewImage({
          urls: lists,
          current: lists[index],
          fail() {
            if (onPreviewFail) {
              onPreviewFail({
                index,
                imgList: lists
              });
            } else {
              uni.showToast({ title: "预览图片失败", icon: "none" });
            }
          }
        });
      }
      function handlePreviewVieo(index, lists) {
        var _a;
        (_a = videoPreview.value) == null ? void 0 : _a.open({ url: lists[index].url, poster: lists[index].thumb, title: lists[index].name });
      }
      function onPreviewImage(file) {
        const { beforePreview, reupload } = props;
        const fileList = deepClone(uploadFiles.value);
        const index = fileList.findIndex((item) => item.url === file.url);
        const imgList = fileList.filter((file2) => isImage(file2)).map((file2) => file2.url);
        const imgIndex = imgList.findIndex((item) => item === file.url);
        if (reupload) {
          handleChoose(index);
        } else {
          if (beforePreview) {
            beforePreview({
              file,
              index,
              fileList,
              imgList,
              resolve: (isPass) => {
                isPass && handlePreviewImage(imgIndex, imgList);
              }
            });
          } else {
            handlePreviewImage(imgIndex, imgList);
          }
        }
      }
      function onPreviewVideo(file) {
        const { beforePreview, reupload } = props;
        const fileList = deepClone(uploadFiles.value);
        const index = fileList.findIndex((item) => item.url === file.url);
        const videoList = fileList.filter((file2) => isVideo(file2));
        const videoIndex = videoList.findIndex((item) => item.url === file.url);
        if (reupload) {
          handleChoose(index);
        } else {
          if (beforePreview) {
            beforePreview({
              file,
              index,
              imgList: [],
              fileList,
              resolve: (isPass) => {
                isPass && handlePreviewVieo(videoIndex, videoList);
              }
            });
          } else {
            handlePreviewVieo(videoIndex, videoList);
          }
        }
      }
      function onPreviewFile(file) {
        const { beforePreview, reupload } = props;
        const fileList = deepClone(uploadFiles.value);
        const index = fileList.findIndex((item) => item.url === file.url);
        if (reupload) {
          handleChoose(index);
        } else {
          if (beforePreview) {
            beforePreview({
              file,
              index,
              imgList: [],
              fileList,
              resolve: (isPass) => {
                isPass && handlePreviewFile(file);
              }
            });
          } else {
            handlePreviewFile(file);
          }
        }
      }
      function isVideo(file) {
        return file.name && isVideoUrl(file.name) || isVideoUrl(file.url);
      }
      function isImage(file) {
        return file.name && isImageUrl(file.name) || isImageUrl(file.url);
      }
      const __returned__ = { props, emit, translate, uploadFiles, showUpload, videoPreview, startUpload, abort, chooseFile, UPLOAD_STATUS: UPLOAD_STATUS2, emitFileList, startUploadFiles, getImageInfo, initFile, handleError, handleSuccess, handleProgress, onChooseFile, handleChoose, handleRemove, removeFile, handlePreviewFile, handlePreviewImage, handlePreviewVieo, onPreviewImage, onPreviewVideo, onPreviewFile, isVideo, isImage, wdIcon: __easycom_1$3, wdVideoPreview, wdLoading };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["wd-upload", _ctx.customClass]),
            style: vue.normalizeStyle(_ctx.customStyle)
          },
          [
            vue.createCommentVNode(" 预览列表 "),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.uploadFiles, (file, index) => {
                return vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    class: vue.normalizeClass(["wd-upload__preview", _ctx.customPreviewClass]),
                    key: index
                  },
                  [
                    vue.createCommentVNode(" 成功时展示图片 "),
                    vue.createElementVNode("view", { class: "wd-upload__status-content" }, [
                      $setup.isImage(file) ? (vue.openBlock(), vue.createElementBlock("image", {
                        key: 0,
                        src: file.url,
                        mode: _ctx.imageMode,
                        class: "wd-upload__picture",
                        onClick: ($event) => $setup.onPreviewImage(file)
                      }, null, 8, ["src", "mode", "onClick"])) : $setup.isVideo(file) ? (vue.openBlock(), vue.createElementBlock(
                        vue.Fragment,
                        { key: 1 },
                        [
                          file.thumb ? (vue.openBlock(), vue.createElementBlock("view", {
                            key: 0,
                            class: "wd-upload__video",
                            onClick: ($event) => $setup.onPreviewVideo(file)
                          }, [
                            vue.createElementVNode("image", {
                              src: file.thumb,
                              mode: _ctx.imageMode,
                              class: "wd-upload__picture"
                            }, null, 8, ["src", "mode"]),
                            vue.createVNode($setup["wdIcon"], {
                              name: "play-circle-filled",
                              "custom-class": "wd-upload__video-paly"
                            })
                          ], 8, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("view", {
                            key: 1,
                            class: "wd-upload__video",
                            onClick: ($event) => $setup.onPreviewVideo(file)
                          }, [
                            vue.createVNode($setup["wdIcon"], {
                              "custom-class": "wd-upload__video-icon",
                              name: "video"
                            })
                          ], 8, ["onClick"]))
                        ],
                        64
                        /* STABLE_FRAGMENT */
                      )) : (vue.openBlock(), vue.createElementBlock("view", {
                        key: 2,
                        class: "wd-upload__file",
                        onClick: ($event) => $setup.onPreviewFile(file)
                      }, [
                        vue.createVNode($setup["wdIcon"], {
                          name: "file",
                          "custom-class": "wd-upload__file-icon"
                        }),
                        vue.createElementVNode(
                          "view",
                          { class: "wd-upload__file-name" },
                          vue.toDisplayString(file.name || file.url),
                          1
                          /* TEXT */
                        )
                      ], 8, ["onClick"]))
                    ]),
                    file[$setup.props.statusKey] !== "success" ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "wd-upload__mask wd-upload__status-content"
                    }, [
                      vue.createCommentVNode(" loading时展示loading图标和进度 "),
                      file[$setup.props.statusKey] === "loading" ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "wd-upload__status-content"
                      }, [
                        vue.createVNode($setup["wdLoading"], {
                          type: _ctx.loadingType,
                          size: _ctx.loadingSize,
                          color: _ctx.loadingColor
                        }, null, 8, ["type", "size", "color"]),
                        vue.createElementVNode(
                          "text",
                          { class: "wd-upload__progress-txt" },
                          vue.toDisplayString(file.percent) + "%",
                          1
                          /* TEXT */
                        )
                      ])) : vue.createCommentVNode("v-if", true),
                      vue.createCommentVNode(" 失败时展示失败图标以及失败信息 "),
                      file[$setup.props.statusKey] === "fail" ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "wd-upload__status-content"
                      }, [
                        vue.createVNode($setup["wdIcon"], {
                          name: "close-outline",
                          "custom-class": "wd-upload__icon"
                        }),
                        vue.createElementVNode(
                          "text",
                          { class: "wd-upload__progress-txt" },
                          vue.toDisplayString(file.error || $setup.translate("error")),
                          1
                          /* TEXT */
                        )
                      ])) : vue.createCommentVNode("v-if", true)
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createCommentVNode(" 上传状态为上传中时不展示移除按钮 "),
                    file[$setup.props.statusKey] !== "loading" && !_ctx.disabled ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                      key: 1,
                      name: "error-fill",
                      "custom-class": "wd-upload__close",
                      onClick: ($event) => $setup.removeFile(index)
                    }, null, 8, ["onClick"])) : vue.createCommentVNode("v-if", true),
                    vue.createCommentVNode(" 自定义预览样式 "),
                    _ctx.$slots["preview-cover"] ? vue.renderSlot(_ctx.$slots, "preview-cover", {
                      key: 2,
                      file,
                      index
                    }, void 0, true) : vue.createCommentVNode("v-if", true)
                  ],
                  2
                  /* CLASS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            $setup.showUpload ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 0 },
              [
                _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: vue.normalizeClass(["wd-upload__evoke-slot", _ctx.customEvokeClass]),
                    onClick: $setup.handleChoose
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ],
                  2
                  /* CLASS */
                )) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  [
                    vue.createCommentVNode(" 唤起项 "),
                    vue.createElementVNode(
                      "view",
                      {
                        onClick: $setup.handleChoose,
                        class: vue.normalizeClass(["wd-upload__evoke", _ctx.disabled ? "is-disabled" : "", _ctx.customEvokeClass])
                      },
                      [
                        vue.createCommentVNode(" 唤起项图标 "),
                        vue.createVNode($setup["wdIcon"], {
                          class: "wd-upload__evoke-icon",
                          name: "fill-camera"
                        }),
                        vue.createCommentVNode(" 有限制个数时确认是否展示限制个数 "),
                        _ctx.limit && _ctx.showLimitNum ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 0,
                            class: "wd-upload__evoke-num"
                          },
                          "（" + vue.toDisplayString($setup.uploadFiles.length) + "/" + vue.toDisplayString(_ctx.limit) + "）",
                          1
                          /* TEXT */
                        )) : vue.createCommentVNode("v-if", true)
                      ],
                      2
                      /* CLASS */
                    )
                  ],
                  2112
                  /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
                ))
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true)
          ],
          6
          /* CLASS, STYLE */
        ),
        vue.createVNode(
          $setup["wdVideoPreview"],
          { ref: "videoPreview" },
          null,
          512
          /* NEED_PATCH */
        )
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-d50d9cde"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-upload/wd-upload.vue"]]);
  const messageBoxProps = {
    ...baseProps,
    /**
     * 指定唯一标识
     */
    selector: makeStringProp(""),
    /**
     * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
     */
    rootPortal: makeBooleanProp(false)
  };
  const __default__$e = {
    name: "wd-message-box",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$r = /* @__PURE__ */ vue.defineComponent({
    ...__default__$e,
    props: messageBoxProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const { translate } = useTranslate("message-box");
      const rootClass = vue.computed(() => {
        return `wd-message-box__container ${props.customClass}`;
      });
      const bodyClass = vue.computed(() => {
        return `wd-message-box__body ${!messageState.title ? "is-no-title" : ""} ${messageState.type === "prompt" ? "is-prompt" : ""}`;
      });
      const messageOptionKey = getMessageDefaultOptionKey(props.selector);
      const messageOption = vue.inject(messageOptionKey, vue.ref(defaultOptions));
      const messageState = vue.reactive({
        msg: "",
        // 消息内容
        show: false,
        // 是否显示弹框
        title: "",
        // 标题
        showCancelButton: false,
        // 是否展示取消按钮
        closeOnClickModal: true,
        // 是否支持点击蒙层关闭
        confirmButtonText: "",
        // 确定按钮文案
        cancelButtonText: "",
        // 取消按钮文案
        type: "alert",
        // 弹框类型
        inputType: "text",
        // 输入框类型
        inputValue: "",
        // 输入框初始值
        inputPlaceholder: "",
        // 输入框placeholder
        inputError: "",
        // 输入框错误提示文案
        showErr: false,
        // 是否显示错误提示
        zIndex: 99,
        // 弹窗层级
        lazyRender: true
        // 弹层内容懒渲染
      });
      const customConfirmProps = vue.computed(() => {
        const buttonProps2 = deepAssign(
          {
            block: true
          },
          isDef(messageState.confirmButtonProps) ? omitBy(messageState.confirmButtonProps, isUndefined$1) : {}
        );
        buttonProps2.customClass = `${buttonProps2.customClass || ""} wd-message-box__actions-btn`;
        return buttonProps2;
      });
      const customCancelProps = vue.computed(() => {
        const buttonProps2 = deepAssign(
          {
            block: true,
            type: "info"
          },
          isDef(messageState.cancelButtonProps) ? omitBy(messageState.cancelButtonProps, isUndefined$1) : {}
        );
        buttonProps2.customClass = `${buttonProps2.customClass || ""} wd-message-box__actions-btn`;
        return buttonProps2;
      });
      vue.watch(
        () => messageOption.value,
        (newVal) => {
          reset(newVal);
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => messageState.show,
        (newValue) => {
          resetErr(!!newValue);
        },
        {
          deep: true,
          immediate: true
        }
      );
      function toggleModal(action) {
        if (action === "modal" && !messageState.closeOnClickModal) {
          return;
        }
        if (messageState.type === "prompt" && action === "confirm" && !validate()) {
          return;
        }
        switch (action) {
          case "confirm":
            if (messageState.beforeConfirm) {
              messageState.beforeConfirm({
                resolve: (isPass) => {
                  if (isPass) {
                    handleConfirm({
                      action,
                      value: messageState.inputValue
                    });
                  }
                }
              });
            } else {
              handleConfirm({
                action,
                value: messageState.inputValue
              });
            }
            break;
          case "cancel":
            handleCancel({
              action
            });
            break;
          default:
            handleCancel({
              action: "modal"
            });
            break;
        }
      }
      function handleConfirm(result) {
        messageState.show = false;
        if (isFunction(messageState.success)) {
          messageState.success(result);
        }
      }
      function handleCancel(result) {
        messageState.show = false;
        if (isFunction(messageState.fail)) {
          messageState.fail(result);
        }
      }
      function validate() {
        if (messageState.inputPattern && !messageState.inputPattern.test(String(messageState.inputValue))) {
          messageState.showErr = true;
          return false;
        }
        if (typeof messageState.inputValidate === "function") {
          const validateResult = messageState.inputValidate(messageState.inputValue);
          if (!validateResult) {
            messageState.showErr = true;
            return false;
          }
        }
        messageState.showErr = false;
        return true;
      }
      function resetErr(val) {
        if (val === false) {
          messageState.showErr = false;
        }
      }
      function inputValChange({ value }) {
        if (value === "") {
          messageState.showErr = false;
          return;
        }
        messageState.inputValue = value;
      }
      function reset(option) {
        if (option) {
          messageState.title = isDef(option.title) ? option.title : "";
          messageState.showCancelButton = isDef(option.showCancelButton) ? option.showCancelButton : false;
          messageState.show = option.show;
          messageState.closeOnClickModal = option.closeOnClickModal;
          messageState.confirmButtonText = option.confirmButtonText;
          messageState.cancelButtonText = option.cancelButtonText;
          messageState.msg = option.msg;
          messageState.type = option.type;
          messageState.inputType = option.inputType;
          messageState.inputSize = option.inputSize;
          messageState.inputValue = option.inputValue;
          messageState.inputPlaceholder = option.inputPlaceholder;
          messageState.inputPattern = option.inputPattern;
          messageState.inputValidate = option.inputValidate;
          messageState.success = option.success;
          messageState.fail = option.fail;
          messageState.beforeConfirm = option.beforeConfirm;
          messageState.inputError = option.inputError;
          messageState.showErr = option.showErr;
          messageState.zIndex = option.zIndex;
          messageState.lazyRender = option.lazyRender;
          messageState.confirmButtonProps = option.confirmButtonProps;
          messageState.cancelButtonProps = option.cancelButtonProps;
        }
      }
      const __returned__ = { props, translate, rootClass, bodyClass, messageOptionKey, messageOption, messageState, customConfirmProps, customCancelProps, toggleModal, handleConfirm, handleCancel, validate, resetErr, inputValChange, reset, wdPopup: __easycom_13, wdButton: __easycom_6, wdInput: __easycom_2$1 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode($setup["wdPopup"], {
        transition: "zoom-in",
        modelValue: $setup.messageState.show,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.messageState.show = $event),
        "close-on-click-modal": $setup.messageState.closeOnClickModal,
        "lazy-render": $setup.messageState.lazyRender,
        "custom-class": "wd-message-box",
        onClickModal: _cache[4] || (_cache[4] = ($event) => $setup.toggleModal("modal")),
        "z-index": $setup.messageState.zIndex,
        duration: 200,
        "root-portal": _ctx.rootPortal
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass($setup.rootClass)
            },
            [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass($setup.bodyClass)
                },
                [
                  $setup.messageState.title ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 0,
                      class: "wd-message-box__title"
                    },
                    vue.toDisplayString($setup.messageState.title),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode("view", { class: "wd-message-box__content" }, [
                    $setup.messageState.type === "prompt" ? (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 0 },
                      [
                        vue.createVNode($setup["wdInput"], {
                          modelValue: $setup.messageState.inputValue,
                          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.messageState.inputValue = $event),
                          type: $setup.messageState.inputType,
                          size: $setup.messageState.inputSize,
                          placeholder: $setup.messageState.inputPlaceholder,
                          onInput: $setup.inputValChange
                        }, null, 8, ["modelValue", "type", "size", "placeholder"]),
                        $setup.messageState.showErr ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 0,
                            class: "wd-message-box__input-error"
                          },
                          vue.toDisplayString($setup.messageState.inputError || $setup.translate("inputNoValidate")),
                          1
                          /* TEXT */
                        )) : vue.createCommentVNode("v-if", true)
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : vue.createCommentVNode("v-if", true),
                    vue.renderSlot(_ctx.$slots, "default", {}, () => [
                      vue.createTextVNode(
                        vue.toDisplayString($setup.messageState.msg),
                        1
                        /* TEXT */
                      )
                    ], true)
                  ])
                ],
                2
                /* CLASS */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(`wd-message-box__actions ${$setup.messageState.showCancelButton ? "wd-message-box__flex" : "wd-message-box__block"}`)
                },
                [
                  $setup.messageState.showCancelButton ? (vue.openBlock(), vue.createBlock(
                    $setup["wdButton"],
                    vue.mergeProps({ key: 0 }, $setup.customCancelProps, {
                      onClick: _cache[1] || (_cache[1] = ($event) => $setup.toggleModal("cancel"))
                    }),
                    {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(
                          vue.toDisplayString($setup.messageState.cancelButtonText || $setup.translate("cancel")),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    },
                    16
                    /* FULL_PROPS */
                  )) : vue.createCommentVNode("v-if", true),
                  vue.createVNode(
                    $setup["wdButton"],
                    vue.mergeProps($setup.customConfirmProps, {
                      onClick: _cache[2] || (_cache[2] = ($event) => $setup.toggleModal("confirm"))
                    }),
                    {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(
                          vue.toDisplayString($setup.messageState.confirmButtonText || $setup.translate("confirm")),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    },
                    16
                    /* FULL_PROPS */
                  )
                ],
                2
                /* CLASS */
              )
            ],
            2
            /* CLASS */
          )
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["modelValue", "close-on-click-modal", "lazy-render", "z-index", "root-portal"])
    ]);
  }
  const __easycom_8 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-c8139c88"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-message-box/wd-message-box.vue"]]);
  const badgeProps = {
    ...baseProps,
    /**
     * 显示值
     */
    modelValue: numericProp,
    /** 当数值为 0 时，是否展示徽标 */
    showZero: makeBooleanProp(false),
    bgColor: String,
    /**
     * 最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型
     */
    max: Number,
    /**
     * 是否为红色点状标注
     */
    isDot: Boolean,
    /**
     * 是否隐藏 badge
     */
    hidden: Boolean,
    /**
     * badge类型，可选值primary / success / warning / danger / info
     */
    type: makeStringProp(void 0),
    /**
     * 为正时，角标向下偏移对应的像素
     */
    top: numericProp,
    /**
     * 为正时，角标向左偏移对应的像素
     */
    right: numericProp
  };
  const __default__$d = {
    name: "wd-badge",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$q = /* @__PURE__ */ vue.defineComponent({
    ...__default__$d,
    props: badgeProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const content = vue.computed(() => {
        const { modelValue, max, isDot } = props;
        if (isDot)
          return "";
        let value = modelValue;
        if (value && max && isNumber(value) && !Number.isNaN(value) && !Number.isNaN(max)) {
          value = max < value ? `${max}+` : value;
        }
        return value;
      });
      const contentStyle = vue.computed(() => {
        const style = {};
        if (isDef(props.bgColor)) {
          style.backgroundColor = props.bgColor;
        }
        if (isDef(props.top)) {
          style.top = addUnit(props.top);
        }
        if (isDef(props.right)) {
          style.right = addUnit(props.right);
        }
        return objToStyle(style);
      });
      const shouldShowBadge = vue.computed(() => !props.hidden && (content.value || content.value === 0 && props.showZero || props.isDot));
      const __returned__ = { props, content, contentStyle, shouldShowBadge };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["wd-badge", _ctx.customClass]),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
        $setup.shouldShowBadge ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["wd-badge__content", "is-fixed", _ctx.type ? "wd-badge__content--" + _ctx.type : "", _ctx.isDot ? "is-dot" : ""]),
            style: vue.normalizeStyle($setup.contentStyle)
          },
          vue.toDisplayString($setup.content),
          7
          /* TEXT, CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const wdBadge = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-6ea9b0eb"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-badge/wd-badge.vue"]]);
  const TABBAR_KEY = Symbol("wd-tabbar");
  const tabbarProps = {
    ...baseProps,
    /**
     * 选中标签的索引值或者名称
     */
    modelValue: makeNumericProp(0),
    /**
     * 是否固定在底部
     */
    fixed: makeBooleanProp(false),
    /**
     * 是否显示顶部边框
     */
    bordered: makeBooleanProp(true),
    /**
     * 是否设置底部安全距离（iPhone X 类型的机型）
     */
    safeAreaInsetBottom: makeBooleanProp(false),
    /**
     * 标签栏的形状。可选项：default/round
     */
    shape: makeStringProp("default"),
    /**
     * 激活标签的颜色
     */
    activeColor: String,
    /**
     * 未激活标签的颜色
     */
    inactiveColor: String,
    /**
     * 固定在底部时，是否在标签位置生成一个等高的占位元素
     */
    placeholder: makeBooleanProp(false),
    /**
     * 自定义组件的层级
     */
    zIndex: makeNumberProp(99)
  };
  const tabbarItemProps = {
    ...baseProps,
    /**
     * 标签页的标题
     */
    title: String,
    /**
     * 唯一标识符
     */
    name: numericProp,
    /**
     * 图标
     */
    icon: String,
    /**
     * 徽标显示值
     */
    value: {
      type: [Number, String, null],
      default: null
    },
    /**
     * 是否点状徽标
     */
    isDot: {
      type: Boolean,
      default: void 0
    },
    /**
     * 徽标最大值
     */
    max: Number,
    /**
     * 徽标属性，透传给 Badge 组件
     */
    badgeProps: Object
  };
  const __default__$c = {
    name: "wd-tabbar-item",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$p = /* @__PURE__ */ vue.defineComponent({
    ...__default__$c,
    props: tabbarItemProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const { parent: tabbar, index } = useParent(TABBAR_KEY);
      const customBadgeProps = vue.computed(() => {
        const badgeProps2 = deepAssign(
          isDef(props.badgeProps) ? omitBy(props.badgeProps, isUndefined$1) : {},
          omitBy(
            {
              max: props.max,
              isDot: props.isDot,
              modelValue: props.value
            },
            isUndefined$1
          )
        );
        if (!isDef(badgeProps2.max)) {
          badgeProps2.max = 99;
        }
        return badgeProps2;
      });
      const textStyle = vue.computed(() => {
        const style = {};
        if (tabbar) {
          if (active.value && tabbar.props.activeColor) {
            style["color"] = tabbar.props.activeColor;
          }
          if (!active.value && tabbar.props.inactiveColor) {
            style["color"] = tabbar.props.inactiveColor;
          }
        }
        return `${objToStyle(style)}`;
      });
      const active = vue.computed(() => {
        const name = isDef(props.name) ? props.name : index.value;
        if (tabbar) {
          if (tabbar.props.modelValue === name) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      function handleClick() {
        const name = isDef(props.name) ? props.name : index.value;
        tabbar && tabbar.setChange({ name });
      }
      const __returned__ = { props, tabbar, index, customBadgeProps, textStyle, active, handleClick, wdBadge, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-tabbar-item ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle),
        onClick: $setup.handleClick
      },
      [
        vue.createVNode(
          $setup["wdBadge"],
          vue.normalizeProps(vue.guardReactiveProps($setup.customBadgeProps)),
          {
            default: vue.withCtx(() => [
              vue.createElementVNode("view", { class: "wd-tabbar-item__body" }, [
                vue.renderSlot(_ctx.$slots, "icon", { active: $setup.active }, void 0, true),
                !_ctx.$slots.icon && _ctx.icon ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
                  key: 0,
                  name: _ctx.icon,
                  "custom-style": $setup.textStyle,
                  "custom-class": `wd-tabbar-item__body-icon ${$setup.active ? "is-active" : "is-inactive"}`
                }, null, 8, ["name", "custom-style", "custom-class"])) : vue.createCommentVNode("v-if", true),
                _ctx.title ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 1,
                    style: vue.normalizeStyle($setup.textStyle),
                    class: vue.normalizeClass(`wd-tabbar-item__body-title ${$setup.active ? "is-active" : "is-inactive"}`)
                  },
                  vue.toDisplayString(_ctx.title),
                  7
                  /* TEXT, CLASS, STYLE */
                )) : vue.createCommentVNode("v-if", true)
              ])
            ]),
            _: 3
            /* FORWARDED */
          },
          16
          /* FULL_PROPS */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-5b5379ae"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-tabbar-item/wd-tabbar-item.vue"]]);
  const __default__$b = {
    name: "wd-tabbar",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$o = /* @__PURE__ */ vue.defineComponent({
    ...__default__$b,
    props: tabbarProps,
    emits: ["change", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const height = vue.ref("");
      const { proxy } = vue.getCurrentInstance();
      const { linkChildren } = useChildren(TABBAR_KEY);
      linkChildren({
        props,
        setChange
      });
      const rootStyle = vue.computed(() => {
        const style = {};
        if (isDef(props.zIndex)) {
          style["z-index"] = props.zIndex;
        }
        return `${objToStyle(style)}${props.customStyle}`;
      });
      vue.watch(
        [() => props.fixed, () => props.placeholder],
        () => {
          setPlaceholderHeight();
        },
        { deep: true, immediate: false }
      );
      vue.onMounted(() => {
        if (props.fixed && props.placeholder) {
          vue.nextTick(() => {
            setPlaceholderHeight();
          });
        }
      });
      function setChange(child) {
        let active = child.name;
        emit("update:modelValue", active);
        emit("change", {
          value: active
        });
      }
      function setPlaceholderHeight() {
        if (!props.fixed || !props.placeholder) {
          return;
        }
        getRect(".wd-tabbar", false, proxy).then((res) => {
          height.value = Number(res.height);
        });
      }
      const __returned__ = { props, emit, height, proxy, linkChildren, rootStyle, setChange, setPlaceholderHeight, get addUnit() {
        return addUnit;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass({ "wd-tabbar__placeholder": _ctx.fixed && _ctx.placeholder && _ctx.safeAreaInsetBottom && _ctx.shape === "round" }),
        style: vue.normalizeStyle({ height: $setup.addUnit($setup.height) })
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(`wd-tabbar wd-tabbar--${_ctx.shape} ${_ctx.customClass} ${_ctx.fixed ? "is-fixed" : ""} ${_ctx.safeAreaInsetBottom ? "is-safe" : ""} ${_ctx.bordered ? "is-border" : ""}`),
            style: vue.normalizeStyle($setup.rootStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-70467ab8"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-tabbar/wd-tabbar.vue"]]);
  const _sfc_main$n = {
    __name: "TabBar",
    props: {
      tabbar: {
        type: String,
        default: "onSiteInspection"
      }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const tabberValue = vue.ref();
      function change() {
        switch (tabberValue.value) {
          case "onSiteInspection": {
            uni.redirectTo({
              url: "/pages/inspectionTask/inspectionTask"
            });
            return;
          }
          case "report": {
            uni.redirectTo({
              url: "/pages/report/report"
            });
            return;
          }
          case "my": {
            uni.redirectTo({
              url: "/pages/my/my"
            });
            return;
          }
        }
      }
      vue.onMounted(() => {
        tabberValue.value = props.tabbar;
      });
      const __returned__ = { props, tabberValue, change, onMounted: vue.onMounted, ref: vue.ref, watch: vue.watch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_tabbar_item = resolveEasycom(vue.resolveDynamicComponent("wd-tabbar-item"), __easycom_0$2);
    const _component_wd_tabbar = resolveEasycom(vue.resolveDynamicComponent("wd-tabbar"), __easycom_1$1);
    return vue.openBlock(), vue.createElementBlock("view", { class: "footer" }, [
      vue.createVNode(_component_wd_tabbar, {
        modelValue: $setup.tabberValue,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.tabberValue = $event),
        onChange: _cache[1] || (_cache[1] = ($event) => $setup.change())
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_wd_tabbar_item, {
            title: "巡检",
            icon: "file-unknown",
            name: "onSiteInspection"
          }),
          vue.createVNode(_component_wd_tabbar_item, {
            title: "上报",
            icon: "warning",
            name: "report"
          }),
          vue.createVNode(_component_wd_tabbar_item, {
            title: "我的",
            icon: "user",
            name: "my"
          })
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"])
    ]);
  }
  const TabBarVue = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-89ca1f91"], ["__file", "E:/开发/app/security-environment/components/TabBar.vue"]]);
  const _sfc_main$m = {
    __name: "hazardReporting",
    setup(__props, { expose: __expose }) {
      __expose();
      const formstate = vue.ref({
        discoverTime: "",
        discoverer: []
      });
      const form = vue.ref();
      const editItemId = vue.ref();
      function submit() {
        form.value.validate().then(({
          valid,
          errors
        }) => {
          if (valid) {
            const params = {
              ...formstate.value,
              executionId: editItemId.value
            };
            params.discoverTime = formatDate(params.discoverTime);
            params.discoverer = params.discoverer[1];
            fileList.value.forEach((item) => {
              params.photoList = [];
              if (item.response) {
                const urlMessage = JSON.parse(item.response);
                params.photoList.push(urlMessage.data);
              } else {
                params.photoList.push(item.url);
              }
            });
            const url = `/${config.mesMain}/hazard/report/insert`;
            request({
              url,
              data: params,
              needAuth: true,
              method: "POST"
            }).then((data) => {
              showSuccess({
                msg: "上报成功!"
              });
              uni.navigateBack({
                delta: 1
              });
            });
          }
        }).catch((error) => {
          formatAppLog("log", "at pages/hazardReporting/hazardReporting.vue:145", error, "error");
        });
      }
      const columns = vue.ref([
        [
          { label: "请选择", value: -1 }
        ],
        [
          { label: "请选择", value: -1 }
        ]
      ]);
      function onChangeDistrict(pickerView, value, columnIndex, resolve) {
        const item = value[columnIndex];
        if (columnIndex === 0) {
          listSysPerson(item.value, (arr) => {
            pickerView.setColumnData(1, arr);
          });
        }
      }
      function displayFormat() {
      }
      function queryTree() {
        request({
          url: `/${config.mesUser}/sys/organization/listTree`,
          // 拼接URL: /mes-main/api/data
          data: {},
          needAuth: true,
          method: "GET"
        }).then((data) => {
          const arr = flattenTree([data]);
          if (arr.length > 0) {
            columns.value[0] = [
              { label: "请选择", value: -1 }
            ];
            arr.forEach((item) => {
              columns.value[0].push({
                label: item.orgFullName,
                value: item.orgCode
              });
            });
          }
        });
      }
      function listSysPerson(orgCode, callback) {
        request({
          url: `/${config.mesUser}/sys/person/listSysPerson`,
          // 拼接URL: /mes-main/api/data
          data: {
            orgCode,
            pageNum: 1,
            // 当前页码。
            pageSize: 999
            // 每页显示的数据条数。
          },
          needAuth: true,
          method: "GET"
        }).then(({ list }) => {
          const arr = [
            { label: "请选择", value: -1 }
          ];
          if (list.length > 0) {
            list.forEach((item) => {
              arr.push({
                label: item.perName,
                value: item.perName
              });
            });
          }
          callback(arr);
        });
      }
      const hiddenDangerType = vue.ref([
        {
          label: "安全",
          value: "安全"
        },
        {
          label: "环境",
          value: "环境"
        },
        {
          label: "健康",
          value: "健康"
        },
        {
          label: "其他",
          value: "其他"
        }
      ]);
      const hazardLevel = vue.ref([
        {
          label: "一般隐患",
          value: 1
        },
        {
          label: "严重隐患",
          value: 2
        },
        {
          label: "较大隐患",
          value: 3
        },
        {
          label: "重大隐患",
          value: 4
        }
      ]);
      function scan() {
        uni.scanCode({
          success: function(res) {
            formatAppLog("log", "at pages/hazardReporting/hazardReporting.vue:277", "条码类型：" + res.scanType);
            formatAppLog("log", "at pages/hazardReporting/hazardReporting.vue:278", "条码内容：" + res.result);
            formstate.value.location = res.result;
          }
        });
      }
      const fileList = vue.ref([]);
      const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`;
      vue.onMounted(() => {
        formstate.value.discoverTime = (/* @__PURE__ */ new Date()).getTime();
        queryTree();
      });
      onLoad((option) => {
        formatAppLog("log", "at pages/hazardReporting/hazardReporting.vue:300", "接收到的testId参数是：", option);
        editItemId.value = option.testId;
      });
      const __returned__ = { formstate, form, editItemId, submit, columns, onChangeDistrict, displayFormat, queryTree, listSysPerson, hiddenDangerType, hazardLevel, scan, fileList, action, TabBarVue, onMounted: vue.onMounted, ref: vue.ref, get onLoad() {
        return onLoad;
      }, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get flattenTree() {
        return flattenTree;
      }, get formatDate() {
        return formatDate;
      }, get showSuccess() {
        return showSuccess;
      }, get config() {
        return config;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_picker = resolveEasycom(vue.resolveDynamicComponent("wd-picker"), __easycom_0$3);
    const _component_wd_datetime_picker = resolveEasycom(vue.resolveDynamicComponent("wd-datetime-picker"), __easycom_1$2);
    const _component_wd_input = resolveEasycom(vue.resolveDynamicComponent("wd-input"), __easycom_2$1);
    const _component_wd_textarea = resolveEasycom(vue.resolveDynamicComponent("wd-textarea"), __easycom_2);
    const _component_wd_upload = resolveEasycom(vue.resolveDynamicComponent("wd-upload"), __easycom_4);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_6);
    const _component_wd_form = resolveEasycom(vue.resolveDynamicComponent("wd-form"), __easycom_7);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" form表单 "),
      vue.createElementVNode("view", null, [
        vue.createVNode(_component_wd_form, {
          ref: "form",
          model: $setup.formstate,
          border: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              prop: "discoverer",
              columns: $setup.columns,
              label: "上报人员",
              modelValue: $setup.formstate.discoverer,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formstate.discoverer = $event),
              "column-change": $setup.onChangeDistrict,
              placeholder: "请选择上报人员",
              rules: [{ required: true, message: "请选择上报人员" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_datetime_picker, {
              label: "上报时间",
              "align-right": "",
              modelValue: $setup.formstate.discoverTime,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formstate.discoverTime = $event),
              prop: "discoverTime",
              rules: [{ required: true, message: "请填写上报时间" }],
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              columns: $setup.hiddenDangerType,
              label: "隐患类型",
              modelValue: $setup.formstate.hazardType,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formstate.hazardType = $event),
              prop: "hazardType",
              rules: [{ required: true, message: "请选择隐患类型" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.location,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formstate.location = $event),
              label: "发现区域",
              "suffix-icon": "scan",
              readonly: "",
              onClick: _cache[4] || (_cache[4] = ($event) => $setup.scan()),
              prop: "location",
              rules: [{ required: true, message: "请选择发现区域" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_textarea, {
              label: "问题描述",
              modelValue: $setup.formstate.description,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.formstate.description = $event),
              placeholder: "请填写详细的问题描述",
              maxlength: 300,
              clearable: "",
              "show-word-limit": "",
              prop: "description",
              rules: [{ required: true, message: "请填写详细的问题描述" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.hazardSource,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.formstate.hazardSource = $event),
              label: "隐患来源",
              prop: "hazardSource",
              rules: [{ required: true, message: "请输入隐患来源" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              columns: $setup.hazardLevel,
              label: "隐患等级",
              modelValue: $setup.formstate.level,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.formstate.level = $event),
              prop: "level",
              rules: [{ required: true, message: "请选择隐患等级" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_cell, {
              title: "现场图片上传",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_upload, {
                  "file-list": $setup.fileList,
                  "onUpdate:fileList": _cache[8] || (_cache[8] = ($event) => $setup.fileList = $event),
                  "image-mode": "aspectFill",
                  action: $setup.action
                }, null, 8, ["file-list"])
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createElementVNode("view", { class: "footer" }, [
              vue.createVNode(_component_wd_button, {
                type: "primary",
                size: "large",
                onClick: $setup.submit,
                block: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("提交")
                ]),
                _: 1
                /* STABLE */
              })
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["model"])
      ]),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesHazardReportingHazardReporting = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__file", "E:/开发/app/security-environment/pages/hazardReporting/hazardReporting.vue"]]);
  const searchProps = {
    ...baseProps,
    customInputClass: makeStringProp(""),
    /**
     * 输入框内容，双向绑定
     * 类型: string
     * 默认值: ''
     */
    modelValue: makeStringProp(""),
    /**
     * 是否使用输入框右侧插槽
     * 类型: boolean
     * 默认值: false
     * @deprecated 该属性已废弃，将在下一个minor版本被移除，直接使用插槽即可
     */
    useSuffixSlot: makeBooleanProp(false),
    /**
     * 搜索框占位文本
     * 类型: string
     */
    placeholder: String,
    /**
     * 搜索框右侧文本
     * 类型: string
     */
    cancelTxt: String,
    /**
     * 搜索框亮色（白色）
     * 类型: boolean
     * 默认值: false
     */
    light: makeBooleanProp(false),
    /**
     * 是否隐藏右侧文本
     * 类型: boolean
     * 默认值: false
     */
    hideCancel: makeBooleanProp(false),
    /**
     * 是否禁用搜索框
     * 类型: boolean
     * 默认值: false
     */
    disabled: makeBooleanProp(false),
    /**
     * 原生属性，设置最大长度。-1 表示无限制
     * 类型: string / number
     * 默认值: -1
     */
    maxlength: makeNumberProp(-1),
    /**
     * placeholder 居左边
     * 类型: boolean
     * 默认值: false
     */
    placeholderLeft: makeBooleanProp(false),
    /**
     * 是否自动聚焦
     * 类型: boolean
     * 默认值: false
     * 最低版本: 0.1.63
     */
    focus: makeBooleanProp(false),
    /**
     * 是否在点击清除按钮时聚焦输入框
     * 类型: boolean
     * 默认值: false
     * 最低版本: 0.1.63
     */
    focusWhenClear: makeBooleanProp(false),
    /**
     * 原生属性，指定 placeholder 的样式，目前仅支持color,font-size和font-weight
     */
    placeholderStyle: String,
    /**
     * 原生属性，指定 placeholder 的样式类
     */
    placeholderClass: makeStringProp("")
  };
  const __default__$a = {
    name: "wd-search",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$l = /* @__PURE__ */ vue.defineComponent({
    ...__default__$a,
    props: searchProps,
    emits: ["update:modelValue", "change", "clear", "search", "focus", "blur", "cancel"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("search");
      const isFocused = vue.ref(false);
      const showInput = vue.ref(false);
      const inputValue = vue.ref("");
      const showPlaceHolder = vue.ref(true);
      const clearing = vue.ref(false);
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          inputValue.value = newValue;
          if (newValue) {
            showInput.value = true;
          }
        },
        { immediate: true }
      );
      vue.watch(
        () => props.focus,
        (newValue) => {
          if (newValue) {
            if (props.disabled)
              return;
            closeCover();
          }
        }
      );
      vue.onMounted(() => {
        if (props.focus) {
          closeCover();
        }
      });
      const rootClass = vue.computed(() => {
        return `wd-search  ${props.light ? "is-light" : ""}  ${props.hideCancel ? "is-without-cancel" : ""} ${props.customClass}`;
      });
      const coverStyle = vue.computed(() => {
        const coverStyle2 = {
          display: inputValue.value === "" && showPlaceHolder.value ? "flex" : "none"
        };
        return objToStyle(coverStyle2);
      });
      async function hackFocus(focus) {
        showInput.value = focus;
        await pause();
        isFocused.value = focus;
      }
      async function closeCover() {
        if (props.disabled)
          return;
        await pause(100);
        showPlaceHolder.value = false;
        hackFocus(true);
      }
      function handleInput(event) {
        inputValue.value = event.detail.value;
        emit("update:modelValue", event.detail.value);
        emit("change", {
          value: event.detail.value
        });
      }
      async function handleClear() {
        inputValue.value = "";
        if (props.focusWhenClear) {
          clearing.value = true;
          isFocused.value = false;
        }
        await pause();
        if (props.focusWhenClear) {
          showPlaceHolder.value = false;
          hackFocus(true);
        } else {
          showPlaceHolder.value = true;
          hackFocus(false);
        }
        emit("change", {
          value: ""
        });
        emit("update:modelValue", "");
        emit("clear");
      }
      function handleConfirm({ detail: { value } }) {
        emit("search", {
          value
        });
      }
      function handleFocus() {
        showPlaceHolder.value = false;
        emit("focus", {
          value: inputValue.value
        });
      }
      async function handleBlur() {
        await pause(150);
        if (clearing.value) {
          clearing.value = false;
          return;
        }
        showPlaceHolder.value = !inputValue.value;
        showInput.value = !showPlaceHolder.value;
        isFocused.value = false;
        emit("blur", {
          value: inputValue.value
        });
      }
      function handleCancel() {
        emit("cancel", {
          value: inputValue.value
        });
      }
      const __returned__ = { props, emit, translate, isFocused, showInput, inputValue, showPlaceHolder, clearing, rootClass, coverStyle, hackFocus, closeCover, handleInput, handleClear, handleConfirm, handleFocus, handleBlur, handleCancel, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.createElementVNode("view", { class: "wd-search__block" }, [
          vue.renderSlot(_ctx.$slots, "prefix", {}, void 0, true),
          vue.createElementVNode("view", { class: "wd-search__field" }, [
            !_ctx.placeholderLeft ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                style: vue.normalizeStyle($setup.coverStyle),
                class: "wd-search__cover",
                onClick: $setup.closeCover
              },
              [
                vue.createVNode($setup["wdIcon"], {
                  name: "search",
                  "custom-class": "wd-search__search-icon"
                }),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(`wd-search__placeholder-txt ${_ctx.placeholderClass}`)
                  },
                  vue.toDisplayString(_ctx.placeholder || $setup.translate("search")),
                  3
                  /* TEXT, CLASS */
                )
              ],
              4
              /* STYLE */
            )) : vue.createCommentVNode("v-if", true),
            $setup.showInput || $setup.inputValue || _ctx.placeholderLeft ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
              key: 1,
              name: "search",
              "custom-class": "wd-search__search-left-icon"
            })) : vue.createCommentVNode("v-if", true),
            $setup.showInput || $setup.inputValue || _ctx.placeholderLeft ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
              key: 2,
              placeholder: _ctx.placeholder || $setup.translate("search"),
              "placeholder-class": `wd-search__placeholder-txt ${_ctx.placeholderClass}`,
              "placeholder-style": _ctx.placeholderStyle,
              "confirm-type": "search",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event),
              class: vue.normalizeClass(["wd-search__input", _ctx.customInputClass]),
              onFocus: $setup.handleFocus,
              onInput: $setup.handleInput,
              onBlur: $setup.handleBlur,
              onConfirm: $setup.handleConfirm,
              disabled: _ctx.disabled,
              maxlength: _ctx.maxlength,
              focus: $setup.isFocused
            }, null, 42, ["placeholder", "placeholder-class", "placeholder-style", "disabled", "maxlength", "focus"])), [
              [vue.vModelText, $setup.inputValue]
            ]) : vue.createCommentVNode("v-if", true),
            $setup.inputValue ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
              key: 3,
              "custom-class": "wd-search__clear wd-search__clear-icon",
              name: "error-fill",
              onClick: $setup.handleClear
            })) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        !_ctx.hideCancel ? vue.renderSlot(_ctx.$slots, "suffix", { key: 0 }, () => [
          vue.createElementVNode(
            "view",
            {
              class: "wd-search__cancel",
              onClick: $setup.handleCancel
            },
            vue.toDisplayString(_ctx.cancelTxt || $setup.translate("cancel")),
            1
            /* TEXT */
          )
        ], true) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-cc0202be"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-search/wd-search.vue"]]);
  const actionSheetProps = {
    ...baseProps,
    /**
     * header 头部样式
     * @default ''
     * @type {string}
     */
    customHeaderClass: makeStringProp(""),
    /**
     * 设置菜单显示隐藏
     * @default false
     * @type {boolean}
     */
    modelValue: { ...makeBooleanProp(false), ...makeRequiredProp(Boolean) },
    /**
     * 菜单选项
     * @default []
     * @type {Action[]}
     */
    actions: makeArrayProp(),
    /**
     * 自定义面板项,可以为字符串数组，也可以为对象数组，如果为二维数组，则为多行展示
     * @default []
     * @type {Array<Panel | Panel[]>}
     */
    panels: makeArrayProp(),
    /**
     * 标题
     * @type {string}
     */
    title: String,
    /**
     * 取消按钮文案
     * @type {string}
     */
    cancelText: String,
    /**
     * 点击选项后是否关闭菜单
     * @default true
     * @type {boolean}
     */
    closeOnClickAction: makeBooleanProp(true),
    /**
     * 点击遮罩是否关闭
     * @default true
     * @type {boolean}
     */
    closeOnClickModal: makeBooleanProp(true),
    /**
     * 弹框动画持续时间
     * @default 200
     * @type {number}
     */
    duration: makeNumberProp(200),
    /**
     * 菜单层级
     * @default 10
     * @type {number}
     */
    zIndex: makeNumberProp(10),
    /**
     * 弹层内容懒渲染，触发展示时才渲染内容
     * @default true
     * @type {boolean}
     */
    lazyRender: makeBooleanProp(true),
    /**
     * 弹出面板是否设置底部安全距离（iphone X 类型的机型）
     * @default true
     * @type {boolean}
     */
    safeAreaInsetBottom: makeBooleanProp(true),
    /**
     * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
     * 类型：boolean
     * 默认值：false
     */
    rootPortal: makeBooleanProp(false)
  };
  const __default__$9 = {
    name: "wd-action-sheet",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$k = /* @__PURE__ */ vue.defineComponent({
    ...__default__$9,
    props: actionSheetProps,
    emits: ["select", "click-modal", "cancel", "closed", "close", "open", "opened", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const formatPanels = vue.ref([]);
      const showPopup = vue.ref(false);
      vue.watch(() => props.panels, computedValue, { deep: true, immediate: true });
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          showPopup.value = newValue;
        },
        { deep: true, immediate: true }
      );
      function isPanelArray() {
        return props.panels.length && !isArray(props.panels[0]);
      }
      function computedValue() {
        formatPanels.value = isPanelArray() ? [props.panels] : props.panels;
      }
      function select(rowIndex, type, colIndex) {
        if (type === "action") {
          if (props.actions[rowIndex].disabled || props.actions[rowIndex].loading) {
            return;
          }
          emit("select", {
            item: props.actions[rowIndex],
            index: rowIndex
          });
        } else if (isPanelArray()) {
          emit("select", {
            item: props.panels[Number(colIndex)],
            index: colIndex
          });
        } else {
          emit("select", {
            item: props.panels[rowIndex][Number(colIndex)],
            rowIndex,
            colIndex
          });
        }
        if (props.closeOnClickAction) {
          close();
        }
      }
      function handleClickModal() {
        emit("click-modal");
      }
      function handleCancel() {
        emit("cancel");
        close();
      }
      function close() {
        emit("update:modelValue", false);
        emit("close");
      }
      function handleOpen() {
        emit("open");
      }
      function handleOpened() {
        emit("opened");
      }
      function handleClosed() {
        emit("closed");
      }
      const __returned__ = { props, emit, formatPanels, showPopup, isPanelArray, computedValue, select, handleClickModal, handleCancel, close, handleOpen, handleOpened, handleClosed, wdPopup: __easycom_13, wdIcon: __easycom_1$3, wdLoading };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode($setup["wdPopup"], {
        "custom-class": "wd-action-sheet__popup",
        "custom-style": `${_ctx.actions && _ctx.actions.length || _ctx.panels && _ctx.panels.length ? "background: transparent;" : ""}`,
        modelValue: $setup.showPopup,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showPopup = $event),
        duration: _ctx.duration,
        position: "bottom",
        "close-on-click-modal": _ctx.closeOnClickModal,
        "safe-area-inset-bottom": _ctx.safeAreaInsetBottom,
        "lazy-render": _ctx.lazyRender,
        "root-portal": _ctx.rootPortal,
        onEnter: $setup.handleOpen,
        onClose: $setup.close,
        onAfterEnter: $setup.handleOpened,
        onAfterLeave: $setup.handleClosed,
        onClickModal: $setup.handleClickModal,
        "z-index": _ctx.zIndex
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(`wd-action-sheet ${_ctx.customClass}`),
              style: vue.normalizeStyle(`${_ctx.actions && _ctx.actions.length || _ctx.panels && _ctx.panels.length ? "margin: 0 10px calc(var(--window-bottom) + 10px) 10px; border-radius: 16px;" : "margin-bottom: var(--window-bottom);"} ${_ctx.customStyle}`)
            },
            [
              _ctx.title ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: vue.normalizeClass(`wd-action-sheet__header ${_ctx.customHeaderClass}`)
                },
                [
                  vue.createTextVNode(
                    vue.toDisplayString(_ctx.title) + " ",
                    1
                    /* TEXT */
                  ),
                  vue.createVNode($setup["wdIcon"], {
                    "custom-class": "wd-action-sheet__close",
                    name: "add",
                    onClick: $setup.close
                  })
                ],
                2
                /* CLASS */
              )) : vue.createCommentVNode("v-if", true),
              _ctx.actions && _ctx.actions.length ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "wd-action-sheet__actions"
              }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList(_ctx.actions, (action, rowIndex) => {
                    return vue.openBlock(), vue.createElementBlock("button", {
                      key: rowIndex,
                      class: vue.normalizeClass(`wd-action-sheet__action ${action.disabled ? "wd-action-sheet__action--disabled" : ""}  ${action.loading ? "wd-action-sheet__action--loading" : ""}`),
                      style: vue.normalizeStyle(`color: ${action.color}`),
                      onClick: ($event) => $setup.select(rowIndex, "action")
                    }, [
                      action.loading ? (vue.openBlock(), vue.createBlock($setup["wdLoading"], {
                        key: 0,
                        "custom-class": "`wd-action-sheet__action-loading"
                      })) : (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 1,
                          class: "wd-action-sheet__name"
                        },
                        vue.toDisplayString(action.name),
                        1
                        /* TEXT */
                      )),
                      !action.loading && action.subname ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 2,
                          class: "wd-action-sheet__subname"
                        },
                        vue.toDisplayString(action.subname),
                        1
                        /* TEXT */
                      )) : vue.createCommentVNode("v-if", true)
                    ], 14, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              $setup.formatPanels && $setup.formatPanels.length ? (vue.openBlock(), vue.createElementBlock("view", { key: 2 }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($setup.formatPanels, (panel, rowIndex) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: rowIndex,
                      class: "wd-action-sheet__panels"
                    }, [
                      vue.createElementVNode("view", { class: "wd-action-sheet__panels-content" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList(panel, (col, colIndex) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              key: colIndex,
                              class: "wd-action-sheet__panel",
                              onClick: ($event) => $setup.select(rowIndex, "panels", colIndex)
                            }, [
                              vue.createElementVNode("image", {
                                class: "wd-action-sheet__panel-img",
                                src: col.iconUrl
                              }, null, 8, ["src"]),
                              vue.createElementVNode(
                                "view",
                                { class: "wd-action-sheet__panel-title" },
                                vue.toDisplayString(col.title),
                                1
                                /* TEXT */
                              )
                            ], 8, ["onClick"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])) : vue.createCommentVNode("v-if", true),
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
              _ctx.cancelText ? (vue.openBlock(), vue.createElementBlock(
                "button",
                {
                  key: 3,
                  class: "wd-action-sheet__cancel",
                  onClick: $setup.handleCancel
                },
                vue.toDisplayString(_ctx.cancelText),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ],
            6
            /* CLASS, STYLE */
          )
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["custom-style", "modelValue", "duration", "close-on-click-modal", "safe-area-inset-bottom", "lazy-render", "root-portal", "z-index"])
    ]);
  }
  const wdActionSheet = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-03619ba9"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-action-sheet/wd-action-sheet.vue"]]);
  const CHECKBOX_GROUP_KEY = Symbol("wd-checkbox-group");
  const checkboxGroupProps = {
    ...baseProps,
    /**
     * 绑定值
     */
    modelValue: {
      type: Array,
      default: () => []
    },
    /**
     * 表单模式
     */
    cell: makeBooleanProp(false),
    /**
     * 单选框形状，可选值：circle / square / button
     */
    shape: makeStringProp("circle"),
    /**
     * 选中的颜色
     */
    checkedColor: String,
    /**
     * 禁用
     */
    disabled: makeBooleanProp(false),
    /**
     * 最小选中的数量
     */
    min: makeNumberProp(0),
    /**
     * 最大选中的数量，0 为无限数量，默认为 0
     */
    max: makeNumberProp(0),
    /**
     * 同行展示
     */
    inline: makeBooleanProp(false),
    /**
     * 设置大小，可选值：large
     */
    size: String
  };
  const checkboxProps = {
    ...baseProps,
    customLabelClass: makeStringProp(""),
    customShapeClass: makeStringProp(""),
    /**
     * 单选框选中时的值
     */
    modelValue: {
      type: [String, Number, Boolean],
      required: true,
      default: false
    },
    /**
     * 单选框形状，可选值：circle / square / button
     */
    shape: {
      type: String
    },
    /**
     * 选中的颜色
     */
    checkedColor: String,
    /**
     * 禁用
     */
    disabled: {
      type: [Boolean, null],
      default: null
    },
    /**
     * 选中值，在 checkbox-group 中使用无效，需同 false-value 一块使用
     */
    trueValue: {
      type: [String, Number, Boolean],
      default: true
    },
    /**
     * 非选中时的值，在 checkbox-group 中使用无效，需同 true-value 一块使用
     */
    falseValue: {
      type: [String, Number, Boolean],
      default: false
    },
    /**
     * 设置大小，可选值：large
     */
    size: String,
    /**
     * 文字位置最大宽度
     */
    maxWidth: String
  };
  const __default__$8 = {
    name: "wd-checkbox",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$j = /* @__PURE__ */ vue.defineComponent({
    ...__default__$8,
    props: checkboxProps,
    emits: ["change", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const props = __props;
      const emit = __emit;
      __expose({
        toggle
      });
      const { parent: checkboxGroup, index } = useParent(CHECKBOX_GROUP_KEY);
      const isChecked = vue.computed(() => {
        if (checkboxGroup) {
          return checkboxGroup.props.modelValue.indexOf(props.modelValue) > -1;
        } else {
          return props.modelValue === props.trueValue;
        }
      });
      const isFirst = vue.computed(() => {
        return index.value === 0;
      });
      const isLast = vue.computed(() => {
        const children = isDef(checkboxGroup) ? checkboxGroup.children : [];
        return index.value === children.length - 1;
      });
      const { proxy } = vue.getCurrentInstance();
      vue.watch(
        () => props.modelValue,
        () => {
          if (checkboxGroup) {
            checkName();
          }
        }
      );
      vue.watch(
        () => props.shape,
        (newValue) => {
          const type = ["circle", "square", "button"];
          if (isDef(newValue) && type.indexOf(newValue) === -1)
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-checkbox/wd-checkbox.vue:94", `shape must be one of ${type.toString()}`);
        }
      );
      const innerShape = vue.computed(() => {
        return props.shape || getPropByPath(checkboxGroup, "props.shape") || "circle";
      });
      const innerCheckedColor = vue.computed(() => {
        return props.checkedColor || getPropByPath(checkboxGroup, "props.checkedColor");
      });
      const innerDisabled = vue.computed(() => {
        if (!checkboxGroup) {
          return props.disabled;
        }
        const { max, min, modelValue, disabled } = checkboxGroup.props;
        if (max && modelValue.length >= max && !isChecked.value || min && modelValue.length <= min && isChecked.value || props.disabled === true || disabled && props.disabled === null) {
          return true;
        }
        return props.disabled;
      });
      const innerInline = vue.computed(() => {
        return getPropByPath(checkboxGroup, "props.inline") || false;
      });
      const innerCell = vue.computed(() => {
        return getPropByPath(checkboxGroup, "props.cell") || false;
      });
      const innerSize = vue.computed(() => {
        return props.size || getPropByPath(checkboxGroup, "props.size");
      });
      vue.onBeforeMount(() => {
        if (props.modelValue === null)
          formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-checkbox/wd-checkbox.vue:137", "checkbox's value must be set");
      });
      function checkName() {
        checkboxGroup && checkboxGroup.children && checkboxGroup.children.forEach((child) => {
          if (child.$.uid !== proxy.$.uid && child.modelValue === props.modelValue) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-checkbox/wd-checkbox.vue:150", `The checkbox's bound value: ${props.modelValue} has been used`);
          }
        });
      }
      function toggle() {
        if (innerDisabled.value)
          return;
        if (checkboxGroup) {
          emit("change", {
            value: !isChecked.value
          });
          checkboxGroup.changeSelectState(props.modelValue);
        } else {
          const newVal = props.modelValue === props.trueValue ? props.falseValue : props.trueValue;
          emit("update:modelValue", newVal);
          emit("change", {
            value: newVal
          });
        }
      }
      const __returned__ = { props, emit, checkboxGroup, index, isChecked, isFirst, isLast, proxy, innerShape, innerCheckedColor, innerDisabled, innerInline, innerCell, innerSize, checkName, toggle, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-checkbox ${$setup.innerCell ? "is-cell-box" : ""} ${$setup.innerShape === "button" ? "is-button-box" : ""} ${$setup.isChecked ? "is-checked" : ""} ${$setup.isFirst ? "is-first-child" : ""} ${$setup.isLast ? "is-last-child" : ""} ${$setup.innerInline ? "is-inline" : ""} ${$setup.innerShape === "button" ? "is-button" : ""} ${$setup.innerDisabled ? "is-disabled" : ""} ${$setup.innerSize ? "is-" + $setup.innerSize : ""} ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle),
        onClick: $setup.toggle
      },
      [
        vue.createCommentVNode("shape为button时，移除wd-checkbox__shape，只保留wd-checkbox__label"),
        $setup.innerShape !== "button" ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(`wd-checkbox__shape ${$setup.innerShape === "square" ? "is-square" : ""} ${_ctx.customShapeClass}`),
            style: vue.normalizeStyle($setup.isChecked && !$setup.innerDisabled && $setup.innerCheckedColor ? "color :" + $setup.innerCheckedColor : "")
          },
          [
            vue.createVNode($setup["wdIcon"], {
              "custom-class": "wd-checkbox__check",
              name: "check-bold"
            })
          ],
          6
          /* CLASS, STYLE */
        )) : vue.createCommentVNode("v-if", true),
        vue.createCommentVNode("shape为button时只保留wd-checkbox__label"),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(`wd-checkbox__label ${_ctx.customLabelClass}`),
            style: vue.normalizeStyle($setup.isChecked && $setup.innerShape === "button" && !$setup.innerDisabled && $setup.innerCheckedColor ? "color:" + $setup.innerCheckedColor : "")
          },
          [
            vue.createCommentVNode("button选中时展示的icon"),
            $setup.innerShape === "button" && $setup.isChecked ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
              key: 0,
              "custom-class": "wd-checkbox__btn-check",
              name: "check-bold"
            })) : vue.createCommentVNode("v-if", true),
            vue.createCommentVNode("文案"),
            vue.createElementVNode(
              "view",
              {
                class: "wd-checkbox__txt",
                style: vue.normalizeStyle(_ctx.maxWidth ? "max-width:" + _ctx.maxWidth : "")
              },
              [
                vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ],
              4
              /* STYLE */
            )
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const wdCheckbox = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-66fc790e"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-checkbox/wd-checkbox.vue"]]);
  const __default__$7 = {
    name: "wd-checkbox-group",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$i = /* @__PURE__ */ vue.defineComponent({
    ...__default__$7,
    props: checkboxGroupProps,
    emits: ["change", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const { linkChildren } = useChildren(CHECKBOX_GROUP_KEY);
      linkChildren({ props, changeSelectState });
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          if (new Set(newValue).size !== newValue.length) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-checkbox-group/wd-checkbox-group.vue:36", "checkboxGroup's bound value includes same value");
          }
          if (newValue.length < props.min) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-checkbox-group/wd-checkbox-group.vue:40", "checkboxGroup's bound value's length can't be less than min");
          }
          if (props.max !== 0 && newValue.length > props.max) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-checkbox-group/wd-checkbox-group.vue:44", "checkboxGroup's bound value's length can't be large than max");
          }
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => props.shape,
        (newValue) => {
          const type = ["circle", "square", "button"];
          if (type.indexOf(newValue) === -1)
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-checkbox-group/wd-checkbox-group.vue:55", `shape must be one of ${type.toString()}`);
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => props.min,
        (newValue) => {
          checkNumRange(newValue, "min");
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => props.max,
        (newValue) => {
          checkNumRange(newValue, "max");
        },
        { deep: true, immediate: true }
      );
      function changeSelectState(value) {
        const temp = deepClone(props.modelValue);
        const index = temp.indexOf(value);
        if (index > -1) {
          temp.splice(index, 1);
        } else {
          temp.push(value);
        }
        emit("update:modelValue", temp);
        emit("change", {
          value: temp
        });
      }
      const __returned__ = { props, emit, linkChildren, changeSelectState };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-checkbox-group ${_ctx.shape === "button" && _ctx.cell ? "is-button" : ""} ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const wdCheckboxGroup = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-395de5f2"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-checkbox-group/wd-checkbox-group.vue"]]);
  const RADIO_GROUP_KEY = Symbol("wd-radio-group");
  const radioGroupProps = {
    ...baseProps,
    /** 会自动选中value对应的单选框 */
    modelValue: [String, Number, Boolean],
    /** 单选框形状，可选值为 dot / button / check，默认为 check */
    shape: makeStringProp("check"),
    /** 选中的颜色，默认为 #4D80F0 */
    checkedColor: String,
    /** 是否禁用，默认为 false */
    disabled: makeBooleanProp(false),
    /** 表单模式，默认为 false */
    cell: makeBooleanProp(false),
    /** 设置大小，默认为空 */
    size: makeStringProp(""),
    /** 同行展示，默认为 false */
    inline: makeBooleanProp(false),
    /** 图标位置，默认为 left */
    iconPlacement: makeStringProp("auto")
  };
  const radioProps = {
    ...baseProps,
    /** 选中时的值 */
    value: makeRequiredProp([String, Number, Boolean]),
    /** 单选框的形状 */
    shape: String,
    /** 选中的颜色 */
    checkedColor: String,
    /** 禁用 */
    disabled: {
      type: [Boolean, null],
      default: null
    },
    /** 单元格 */
    cell: {
      type: [Boolean, null],
      default: null
    },
    /** 大小 */
    size: String,
    /** 内联 */
    inline: {
      type: [Boolean, null],
      default: null
    },
    /** 最大宽度 */
    maxWidth: String,
    /**
     * 图标位置
     * 可选值: 'left' | 'right' | 'auto'
     */
    iconPlacement: {
      type: String
    }
  };
  const __default__$6 = {
    name: "wd-radio",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$h = /* @__PURE__ */ vue.defineComponent({
    ...__default__$6,
    props: radioProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const { parent: radioGroup } = useParent(RADIO_GROUP_KEY);
      const isChecked = vue.computed(() => {
        if (radioGroup) {
          return props.value === radioGroup.props.modelValue;
        } else {
          return false;
        }
      });
      const shapeValue = vue.computed(() => {
        return props.shape || getPropByPath(radioGroup, "props.shape");
      });
      const checkedColorValue = vue.computed(() => {
        return props.checkedColor || getPropByPath(radioGroup, "props.checkedColor");
      });
      const disabledValue = vue.computed(() => {
        if (isDef(props.disabled)) {
          return props.disabled;
        } else {
          return getPropByPath(radioGroup, "props.disabled");
        }
      });
      const inlineValue = vue.computed(() => {
        if (isDef(props.inline)) {
          return props.inline;
        } else {
          return getPropByPath(radioGroup, "props.inline");
        }
      });
      const sizeValue = vue.computed(() => {
        return props.size || getPropByPath(radioGroup, "props.size");
      });
      const cellValue = vue.computed(() => {
        if (isDef(props.cell)) {
          return props.cell;
        } else {
          return getPropByPath(radioGroup, "props.cell");
        }
      });
      const iconPlacement = vue.computed(() => {
        if (isDef(props.iconPlacement)) {
          return props.iconPlacement;
        } else {
          return getPropByPath(radioGroup, "props.iconPlacement");
        }
      });
      vue.watch(
        () => props.shape,
        (newValue) => {
          const type = ["check", "dot", "button"];
          if (!newValue || type.indexOf(newValue) === -1)
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-radio/wd-radio.vue:102", `shape must be one of ${type.toString()}`);
        }
      );
      function handleClick() {
        const { value } = props;
        if (!disabledValue.value && radioGroup && isDef(value)) {
          radioGroup.updateValue(value);
        }
      }
      const __returned__ = { props, radioGroup, isChecked, shapeValue, checkedColorValue, disabledValue, inlineValue, sizeValue, cellValue, iconPlacement, handleClick, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-radio ${$setup.cellValue ? "is-cell-radio" : ""} ${$setup.cellValue && $setup.shapeValue == "button" ? "is-button-radio" : ""} ${$setup.sizeValue ? "is-" + $setup.sizeValue : ""} ${$setup.inlineValue ? "is-inline" : ""} ${$setup.isChecked ? "is-checked" : ""} ${$setup.shapeValue !== "check" ? "is-" + $setup.shapeValue : ""} ${$setup.disabledValue ? "is-disabled" : ""} icon-placement-${$setup.iconPlacement} ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle),
        onClick: $setup.handleClick
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "wd-radio__label",
            style: vue.normalizeStyle(`${_ctx.maxWidth ? "max-width:" + _ctx.maxWidth : ""};  ${$setup.isChecked && $setup.shapeValue === "button" && !$setup.disabledValue ? "color :" + $setup.checkedColorValue : ""}`)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "wd-radio__shape",
            style: vue.normalizeStyle($setup.isChecked && !$setup.disabledValue ? "color: " + $setup.checkedColorValue : "")
          },
          [
            $setup.shapeValue === "check" ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
              key: 0,
              style: vue.normalizeStyle($setup.isChecked && !$setup.disabledValue ? "color: " + $setup.checkedColorValue : ""),
              name: "check"
            }, null, 8, ["style"])) : vue.createCommentVNode("v-if", true)
          ],
          4
          /* STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_11 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-a54631cc"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-radio/wd-radio.vue"]]);
  const __default__$5 = {
    name: "wd-radio-group",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$g = /* @__PURE__ */ vue.defineComponent({
    ...__default__$5,
    props: radioGroupProps,
    emits: ["change", "update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const { linkChildren, children } = useChildren(RADIO_GROUP_KEY);
      linkChildren({ props, updateValue });
      vue.watch(
        () => props.shape,
        (newValue) => {
          const type = ["check", "dot", "button"];
          if (type.indexOf(newValue) === -1)
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-radio-group/wd-radio-group.vue:34", `shape must be one of ${type.toString()}`);
        },
        { deep: true, immediate: true }
      );
      function updateValue(value) {
        emit("update:modelValue", value);
        emit("change", {
          value
        });
      }
      const __returned__ = { props, emit, linkChildren, children, updateValue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-radio-group  ${_ctx.customClass} ${_ctx.cell && _ctx.shape === "button" ? "is-button" : ""}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_12 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-1a9e9b05"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-radio-group/wd-radio-group.vue"]]);
  const selectPickerProps = {
    ...baseProps,
    /** 选择器左侧文案 */
    label: String,
    /** 设置左侧标题宽度 */
    labelWidth: makeStringProp("33%"),
    /** 禁用 */
    disabled: makeBooleanProp(false),
    /** 只读 */
    readonly: Boolean,
    /** 选择器占位符 */
    placeholder: String,
    /** 弹出层标题 */
    title: String,
    /** 选择器的值靠右展示 */
    alignRight: makeBooleanProp(false),
    /** 是否为错误状态，错误状态时右侧内容为红色 */
    error: makeBooleanProp(false),
    /** 必填样式 */
    required: makeBooleanProp(false),
    /**
     * 使用 label 插槽时设置该选项
     * @deprecated 可以直接使用标签插槽，无需配置此选项
     */
    useLabelSlot: makeBooleanProp(false),
    /**
     * 使用默认插槽时设置该选项
     * @deprecated 可以直接使用默认插槽，无需配置此选项
     */
    useDefaultSlot: makeBooleanProp(false),
    /** 设置选择器大小 */
    size: String,
    /**
     * 是否垂直居中
     */
    center: makeBooleanProp(false),
    /** 选中的颜色（单/复选框） */
    checkedColor: String,
    /** 最小选中的数量（仅在复选框类型下生效，`type`类型为`checkbox`） */
    min: makeNumberProp(0),
    /** 最大选中的数量，0 为无限数量，默认为 0（仅在复选框类型下生效，`type`类型为`checkbox`） */
    max: makeNumberProp(0),
    /** 设置 picker 内部的选项组尺寸大小 （单/复选框） */
    selectSize: String,
    /** 加载中 */
    loading: makeBooleanProp(false),
    /** 加载的颜色，只能使用十六进制的色值写法，且不能使用缩写 */
    loadingColor: makeStringProp("#4D80F0"),
    /** 点击遮罩是否关闭 */
    closeOnClickModal: makeBooleanProp(true),
    /** 选中项，`type`类型为`checkbox`时，类型为 array；`type`为`radio` 时 ，类型为 number / boolean / string */
    modelValue: makeRequiredProp([String, Number, Boolean, Array]),
    /** 选择器数据，一维数组 */
    columns: makeArrayProp(),
    /** 单复选选择器类型 */
    type: makeStringProp("checkbox"),
    /** 选项对象中，value 对应的 key */
    valueKey: makeStringProp("value"),
    /** 选项对象中，展示的文本对应的 key */
    labelKey: makeStringProp("label"),
    /** 确认按钮文案 */
    confirmButtonText: String,
    /** 自定义展示文案的格式化函数，返回一个字符串 */
    displayFormat: Function,
    /** 确定前校验函数，接收 (value, resolve) 参数，通过 resolve 继续执行 picker，resolve 接收 1 个 boolean 参数 */
    beforeConfirm: Function,
    /** 弹窗层级 */
    zIndex: makeNumberProp(15),
    /** 弹出面板是否设置底部安全距离（iphone X 类型的机型） */
    safeAreaInsetBottom: makeBooleanProp(true),
    /** 可搜索（目前只支持本地搜索） */
    filterable: makeBooleanProp(false),
    /** 搜索框占位符 */
    filterPlaceholder: String,
    /** 是否超出隐藏 */
    ellipsis: makeBooleanProp(false),
    /** 重新打开是否滚动到选中项 */
    scrollIntoView: makeBooleanProp(true),
    /** 表单域 `model` 字段名，在使用表单校验功能的情况下，该属性是必填的 */
    prop: String,
    /** 表单验证规则，结合`wd-form`组件使用 */
    rules: makeArrayProp(),
    /** 自定义内容样式类 */
    customContentClass: makeStringProp(""),
    /** 自定义标签样式类 */
    customLabelClass: makeStringProp(""),
    /** 自定义值样式类 */
    customValueClass: makeStringProp(""),
    /** 是否显示确认按钮（radio类型生效），默认值为：true */
    showConfirm: makeBooleanProp(true),
    /**
     * 显示清空按钮
     */
    clearable: makeBooleanProp(false),
    /**
     * 是否从页面中脱离出来，用于解决各种 fixed 失效问题 (H5: teleport, APP: renderjs, 小程序: root-portal)
     */
    rootPortal: makeBooleanProp(false),
    /**
     * 必填标记位置，可选值：before、after
     */
    markerSide: makeStringProp("before")
  };
  const __default__$4 = {
    name: "wd-select-picker",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$f = /* @__PURE__ */ vue.defineComponent({
    ...__default__$4,
    props: selectPickerProps,
    emits: ["change", "cancel", "confirm", "clear", "update:modelValue", "open", "close"],
    setup(__props, { expose: __expose, emit: __emit }) {
      const { translate } = useTranslate("select-picker");
      const props = __props;
      const emit = __emit;
      const pickerShow = vue.ref(false);
      const selectList = vue.ref([]);
      const isConfirm = vue.ref(false);
      const lastSelectList = vue.ref([]);
      const filterVal = vue.ref("");
      const filterColumns = vue.ref([]);
      const scrollTop = vue.ref(0);
      const showValue = vue.computed(() => {
        const value = valueFormat(props.modelValue);
        let showValueTemp = "";
        if (props.displayFormat) {
          showValueTemp = props.displayFormat(value, props.columns);
        } else {
          const { type, labelKey } = props;
          if (type === "checkbox") {
            const selectedItems = (isArray(value) ? value : []).map((item) => {
              return getSelectedItem(item);
            });
            showValueTemp = selectedItems.map((item) => {
              return item[labelKey];
            }).join(", ");
          } else if (type === "radio") {
            const selectedItem = getSelectedItem(value);
            showValueTemp = selectedItem[labelKey];
          } else {
            showValueTemp = value;
          }
        }
        return showValueTemp;
      });
      const cellClass = vue.computed(() => {
        const classes = ["wd-select-picker__cell"];
        if (props.disabled)
          classes.push("is-disabled");
        if (props.readonly)
          classes.push("is-readonly");
        if (props.error)
          classes.push("is-error");
        if (!showValue.value)
          classes.push("wd-select-picker__cell--placeholder");
        return classes.join(" ");
      });
      vue.watch(
        () => props.modelValue,
        (newValue) => {
          if (newValue === selectList.value)
            return;
          selectList.value = valueFormat(newValue);
          lastSelectList.value = valueFormat(newValue);
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.columns,
        (newValue) => {
          if (props.filterable && filterVal.value) {
            formatFilterColumns(newValue, filterVal.value);
          } else {
            filterColumns.value = newValue;
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.displayFormat,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-select-picker/wd-select-picker.vue:216", "The type of displayFormat must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.watch(
        () => props.beforeConfirm,
        (fn) => {
          if (fn && !isFunction(fn)) {
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-select-picker/wd-select-picker.vue:229", "The type of beforeConfirm must be Function");
          }
        },
        {
          deep: true,
          immediate: true
        }
      );
      vue.onBeforeMount(() => {
        selectList.value = valueFormat(props.modelValue);
        filterColumns.value = props.columns;
      });
      const { proxy } = vue.getCurrentInstance();
      async function setScrollIntoView() {
        let wraperSelector = "";
        let selectorPromise = [];
        if (isDef(selectList.value) && selectList.value !== "" && !isArray(selectList.value)) {
          wraperSelector = "#wd-radio-group";
          selectorPromise = [getRect(`#radio${selectList.value}`, false, proxy)];
        } else if (isArray(selectList.value) && selectList.value.length > 0) {
          selectList.value.forEach((value) => {
            selectorPromise.push(getRect(`#check${value}`, false, proxy));
          });
          wraperSelector = "#wd-checkbox-group";
        }
        if (wraperSelector) {
          await pause(2e3 / 30);
          Promise.all([getRect(".wd-select-picker__wrapper", false, proxy), getRect(wraperSelector, false, proxy), ...selectorPromise]).then((res) => {
            if (isDef(res) && isArray(res)) {
              const scrollView = res[0];
              const wraper = res[1];
              const target = res.slice(2) || [];
              if (isDef(wraper) && isDef(scrollView)) {
                const index = target.findIndex((item) => {
                  return item.bottom > scrollView.top && item.top < scrollView.bottom;
                });
                if (index < 0) {
                  scrollTop.value = -1;
                  vue.nextTick(() => {
                    scrollTop.value = Math.max(0, target[0].top - wraper.top - scrollView.height / 2);
                  });
                }
              }
            }
          });
        }
      }
      function noop() {
      }
      function getSelectedItem(value) {
        const { valueKey, labelKey, columns } = props;
        const selecteds = columns.filter((item) => {
          return item[valueKey] === value;
        });
        if (selecteds.length > 0) {
          return selecteds[0];
        }
        return {
          [valueKey]: value,
          [labelKey]: ""
        };
      }
      function valueFormat(value) {
        return props.type === "checkbox" ? isArray(value) ? value : [] : value;
      }
      function handleChange({ value }) {
        selectList.value = value;
        emit("change", { value });
        if (props.type === "radio" && !props.showConfirm) {
          onConfirm();
        }
      }
      function close() {
        pickerShow.value = false;
        if (!isConfirm.value) {
          selectList.value = valueFormat(lastSelectList.value);
        }
        emit("cancel");
        emit("close");
      }
      function open() {
        if (props.disabled || props.readonly)
          return;
        selectList.value = valueFormat(props.modelValue);
        pickerShow.value = true;
        isConfirm.value = false;
        emit("open");
      }
      function onConfirm() {
        if (props.loading) {
          pickerShow.value = false;
          emit("confirm");
          emit("close");
          return;
        }
        if (props.beforeConfirm) {
          props.beforeConfirm(selectList.value, (isPass) => {
            isPass && handleConfirm();
          });
        } else {
          handleConfirm();
        }
      }
      function handleConfirm() {
        isConfirm.value = true;
        pickerShow.value = false;
        lastSelectList.value = valueFormat(selectList.value);
        let selectedItems = {};
        if (props.type === "checkbox") {
          selectedItems = (isArray(lastSelectList.value) ? lastSelectList.value : []).map((item) => {
            return getSelectedItem(item);
          });
        } else {
          selectedItems = getSelectedItem(lastSelectList.value);
        }
        emit("update:modelValue", lastSelectList.value);
        emit("confirm", {
          value: lastSelectList.value,
          selectedItems
        });
        emit("close");
      }
      function getFilterText(label, filterVal2) {
        const reg = new RegExp(`(${filterVal2})`, "g");
        return label.split(reg).map((text) => {
          return {
            type: text === filterVal2 ? "active" : "normal",
            label: text
          };
        });
      }
      function handleFilterChange({ value }) {
        if (value === "") {
          filterColumns.value = [];
          filterVal.value = value;
          vue.nextTick(() => {
            filterColumns.value = props.columns;
          });
        } else {
          filterVal.value = value;
          formatFilterColumns(props.columns, value);
        }
      }
      function formatFilterColumns(columns, filterVal2) {
        const filterColumnsTemp = columns.filter((item) => {
          return item[props.labelKey].indexOf(filterVal2) > -1;
        });
        const formatFilterColumns2 = filterColumnsTemp.map((item) => {
          return {
            ...item,
            [props.labelKey]: getFilterText(item[props.labelKey], filterVal2)
          };
        });
        filterColumns.value = [];
        vue.nextTick(() => {
          filterColumns.value = formatFilterColumns2;
        });
      }
      const showConfirm = vue.computed(() => {
        return props.type === "radio" && props.showConfirm || props.type === "checkbox";
      });
      const showClear = vue.computed(() => {
        return props.clearable && !props.disabled && !props.readonly && showValue.value.length;
      });
      function handleClear() {
        emit("update:modelValue", props.type === "checkbox" ? [] : "");
        emit("clear");
      }
      const showArrow = vue.computed(() => {
        return !props.disabled && !props.readonly && !showClear.value;
      });
      __expose({
        close,
        open
      });
      const __returned__ = { translate, props, emit, pickerShow, selectList, isConfirm, lastSelectList, filterVal, filterColumns, scrollTop, showValue, cellClass, proxy, setScrollIntoView, noop, getSelectedItem, valueFormat, handleChange, close, open, onConfirm, handleConfirm, getFilterText, handleFilterChange, formatFilterColumns, showConfirm, showClear, handleClear, showArrow, wdActionSheet, wdCheckbox, wdCheckboxGroup, wdRadio: __easycom_11, wdRadioGroup: __easycom_12, wdButton: __easycom_6, wdLoading, wdCell: __easycom_5, get isArray() {
        return isArray;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$3);
    const _component_wd_search = resolveEasycom(vue.resolveDynamicComponent("wd-search"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-select-picker ${_ctx.customClass}`),
        style: vue.normalizeStyle(_ctx.customStyle)
      },
      [
        !_ctx.$slots.default ? (vue.openBlock(), vue.createBlock($setup["wdCell"], {
          key: 0,
          title: _ctx.label,
          value: $setup.showValue || _ctx.placeholder || $setup.translate("placeholder"),
          required: _ctx.required,
          size: _ctx.size,
          "title-width": _ctx.labelWidth,
          prop: _ctx.prop,
          rules: _ctx.rules,
          clickable: !_ctx.disabled && !_ctx.readonly,
          "value-align": _ctx.alignRight ? "right" : "left",
          center: _ctx.center,
          "custom-class": $setup.cellClass,
          "custom-style": _ctx.customStyle,
          "custom-title-class": _ctx.customLabelClass,
          "custom-value-class": _ctx.customValueClass,
          ellipsis: _ctx.ellipsis,
          "use-title-slot": !!_ctx.$slots.label,
          "marker-side": _ctx.markerSide,
          onClick: $setup.open
        }, vue.createSlots({
          "right-icon": vue.withCtx(() => [
            $setup.showArrow ? (vue.openBlock(), vue.createBlock(_component_wd_icon, {
              key: 0,
              "custom-class": "wd-select-picker__arrow",
              name: "arrow-right"
            })) : $setup.showClear ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              onClick: vue.withModifiers($setup.handleClear, ["stop"])
            }, [
              vue.createVNode(_component_wd_icon, {
                "custom-class": "wd-select-picker__clear",
                name: "error-fill"
              })
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          _: 2
          /* DYNAMIC */
        }, [
          _ctx.$slots.label ? {
            name: "title",
            fn: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "label", {}, void 0, true)
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["title", "value", "required", "size", "title-width", "prop", "rules", "clickable", "value-align", "center", "custom-class", "custom-style", "custom-title-class", "custom-value-class", "ellipsis", "use-title-slot", "marker-side"])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          onClick: $setup.open
        }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])),
        vue.createVNode($setup["wdActionSheet"], {
          modelValue: $setup.pickerShow,
          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.pickerShow = $event),
          duration: 250,
          title: _ctx.title || $setup.translate("title"),
          "close-on-click-modal": _ctx.closeOnClickModal,
          "z-index": _ctx.zIndex,
          "safe-area-inset-bottom": _ctx.safeAreaInsetBottom,
          "root-portal": _ctx.rootPortal,
          onClose: $setup.close,
          onOpened: _cache[4] || (_cache[4] = ($event) => _ctx.scrollIntoView ? $setup.setScrollIntoView() : ""),
          "custom-header-class": "wd-select-picker__header"
        }, {
          default: vue.withCtx(() => [
            _ctx.filterable ? (vue.openBlock(), vue.createBlock(_component_wd_search, {
              key: 0,
              modelValue: $setup.filterVal,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.filterVal = $event),
              placeholder: _ctx.filterPlaceholder || $setup.translate("filterPlaceholder"),
              "hide-cancel": "",
              "placeholder-left": "",
              onChange: $setup.handleFilterChange
            }, null, 8, ["modelValue", "placeholder"])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("scroll-view", {
              class: vue.normalizeClass(`wd-select-picker__wrapper ${_ctx.filterable ? "is-filterable" : ""} ${_ctx.loading ? "is-loading" : ""} ${_ctx.customContentClass}`),
              "scroll-y": !_ctx.loading,
              "scroll-top": $setup.scrollTop,
              "scroll-with-animation": true
            }, [
              vue.createCommentVNode(" 多选 "),
              _ctx.type === "checkbox" && $setup.isArray($setup.selectList) ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                id: "wd-checkbox-group"
              }, [
                vue.createVNode($setup["wdCheckboxGroup"], {
                  modelValue: $setup.selectList,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.selectList = $event),
                  cell: "",
                  size: _ctx.selectSize,
                  "checked-color": _ctx.checkedColor,
                  min: _ctx.min,
                  max: _ctx.max,
                  onChange: $setup.handleChange
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.filterColumns, (item) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: item[_ctx.valueKey],
                          id: "check" + item[_ctx.valueKey]
                        }, [
                          vue.createVNode($setup["wdCheckbox"], {
                            modelValue: item[_ctx.valueKey],
                            disabled: item.disabled
                          }, {
                            default: vue.withCtx(() => [
                              _ctx.filterable && $setup.filterVal ? (vue.openBlock(true), vue.createElementBlock(
                                vue.Fragment,
                                { key: 0 },
                                vue.renderList(item[_ctx.labelKey], (text) => {
                                  return vue.openBlock(), vue.createElementBlock(
                                    vue.Fragment,
                                    {
                                      key: text.label
                                    },
                                    [
                                      text.type === "active" ? (vue.openBlock(), vue.createElementBlock(
                                        "text",
                                        {
                                          key: 0,
                                          class: "wd-select-picker__text-active"
                                        },
                                        vue.toDisplayString(text.label),
                                        1
                                        /* TEXT */
                                      )) : (vue.openBlock(), vue.createElementBlock(
                                        vue.Fragment,
                                        { key: 1 },
                                        [
                                          vue.createTextVNode(
                                            vue.toDisplayString(text.label),
                                            1
                                            /* TEXT */
                                          )
                                        ],
                                        64
                                        /* STABLE_FRAGMENT */
                                      ))
                                    ],
                                    64
                                    /* STABLE_FRAGMENT */
                                  );
                                }),
                                128
                                /* KEYED_FRAGMENT */
                              )) : (vue.openBlock(), vue.createElementBlock(
                                vue.Fragment,
                                { key: 1 },
                                [
                                  vue.createTextVNode(
                                    vue.toDisplayString(item[_ctx.labelKey]),
                                    1
                                    /* TEXT */
                                  )
                                ],
                                64
                                /* STABLE_FRAGMENT */
                              ))
                            ]),
                            _: 2
                            /* DYNAMIC */
                          }, 1032, ["modelValue", "disabled"])
                        ], 8, ["id"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["modelValue", "size", "checked-color", "min", "max"])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createCommentVNode(" 单选 "),
              _ctx.type === "radio" && !$setup.isArray($setup.selectList) ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                id: "wd-radio-group"
              }, [
                vue.createVNode($setup["wdRadioGroup"], {
                  modelValue: $setup.selectList,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.selectList = $event),
                  cell: "",
                  size: _ctx.selectSize,
                  "checked-color": _ctx.checkedColor,
                  onChange: $setup.handleChange
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($setup.filterColumns, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: index,
                          id: "radio" + item[_ctx.valueKey]
                        }, [
                          vue.createVNode($setup["wdRadio"], {
                            value: item[_ctx.valueKey],
                            disabled: item.disabled
                          }, {
                            default: vue.withCtx(() => [
                              _ctx.filterable && $setup.filterVal ? (vue.openBlock(true), vue.createElementBlock(
                                vue.Fragment,
                                { key: 0 },
                                vue.renderList(item[_ctx.labelKey], (text) => {
                                  return vue.openBlock(), vue.createElementBlock(
                                    "text",
                                    {
                                      key: text.label,
                                      class: vue.normalizeClass(`${text.type === "active" ? "wd-select-picker__text-active" : ""}`)
                                    },
                                    vue.toDisplayString(text.label),
                                    3
                                    /* TEXT, CLASS */
                                  );
                                }),
                                128
                                /* KEYED_FRAGMENT */
                              )) : (vue.openBlock(), vue.createElementBlock(
                                vue.Fragment,
                                { key: 1 },
                                [
                                  vue.createTextVNode(
                                    vue.toDisplayString(item[_ctx.labelKey]),
                                    1
                                    /* TEXT */
                                  )
                                ],
                                64
                                /* STABLE_FRAGMENT */
                              ))
                            ]),
                            _: 2
                            /* DYNAMIC */
                          }, 1032, ["value", "disabled"])
                        ], 8, ["id"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["modelValue", "size", "checked-color"])
              ])) : vue.createCommentVNode("v-if", true),
              _ctx.loading ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 2,
                  class: "wd-select-picker__loading",
                  onTouchmove: $setup.noop
                },
                [
                  vue.createVNode($setup["wdLoading"], { color: _ctx.loadingColor }, null, 8, ["color"])
                ],
                32
                /* NEED_HYDRATION */
              )) : vue.createCommentVNode("v-if", true)
            ], 10, ["scroll-y", "scroll-top"]),
            vue.createCommentVNode(" 确认按钮 "),
            $setup.showConfirm ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "wd-select-picker__footer"
            }, [
              vue.createVNode($setup["wdButton"], {
                block: "",
                size: "large",
                onClick: $setup.onConfirm,
                disabled: _ctx.loading
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(
                    vue.toDisplayString(_ctx.confirmButtonText || $setup.translate("confirm")),
                    1
                    /* TEXT */
                  )
                ]),
                _: 1
                /* STABLE */
              }, 8, ["disabled"])
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue", "title", "close-on-click-modal", "z-index", "safe-area-inset-bottom", "root-portal"])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-b8ce50f5"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-select-picker/wd-select-picker.vue"]]);
  const ROW_KEY = Symbol("wd-row");
  const rowProps = {
    ...baseProps,
    /**
     * 列元素之间的间距（单位为px）
     */
    gutter: makeNumberProp(0)
  };
  const colProps = {
    ...baseProps,
    /**
     * 列元素宽度
     */
    span: makeNumberProp(24),
    /**
     * 列元素偏移距离
     */
    offset: makeNumberProp(0)
  };
  const __default__$3 = {
    name: "wd-col",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$e = /* @__PURE__ */ vue.defineComponent({
    ...__default__$3,
    props: colProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const { parent: row } = useParent(ROW_KEY);
      const rootStyle = vue.computed(() => {
        const gutter = isDef(row) ? row.props.gutter || 0 : 0;
        const padding = `${gutter / 2}px`;
        const style = gutter > 0 ? `padding-left: ${padding}; padding-right: ${padding};background-clip: content-box;` : "";
        return `${style}${props.customStyle}`;
      });
      vue.watch([() => props.span, () => props.offset], () => {
        check();
      });
      function check() {
        const { span, offset } = props;
        if (span < 0 || offset < 0) {
          formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-col/wd-col.vue:42", "[wot-design] warning(wd-col): attribute span/offset must be greater than or equal to 0");
        }
      }
      const __returned__ = { props, row, rootStyle, check };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["wd-col", _ctx.span && "wd-col__" + _ctx.span, _ctx.offset && "wd-col__offset-" + _ctx.offset, _ctx.customClass]),
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        vue.createCommentVNode(" 每一列 "),
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_9 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-2afa91f2"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-col/wd-col.vue"]]);
  const __default__$2 = {
    name: "wd-row",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$d = /* @__PURE__ */ vue.defineComponent({
    ...__default__$2,
    props: rowProps,
    setup(__props, { expose: __expose }) {
      __expose();
      const props = __props;
      const { linkChildren } = useChildren(ROW_KEY);
      linkChildren({ props });
      const rowStyle = vue.computed(() => {
        const style = {};
        const { gutter } = props;
        if (gutter < 0) {
          formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-row/wd-row.vue:32", "[wot ui] warning(wd-row): attribute gutter must be greater than or equal to 0");
        } else if (gutter) {
          style.marginLeft = addUnit(gutter / 2);
          style.marginRight = addUnit(gutter / 2);
        }
        return `${objToStyle(style)}${props.customStyle}`;
      });
      const __returned__ = { props, linkChildren, rowStyle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(`wd-row ${_ctx.customClass}`),
        style: vue.normalizeStyle($setup.rowStyle)
      },
      [
        vue.createCommentVNode(" 每一行 "),
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_10 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-88acc730"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-row/wd-row.vue"]]);
  const _sfc_main$c = {
    __name: "hotWork",
    setup(__props, { expose: __expose }) {
      __expose();
      const formstate = vue.ref({
        dateTime: [Date.now(), ""],
        hazardsourceIdentificationList: ["其他"],
        hazardIdentificationList: ["其他"],
        type: ""
      });
      const form = vue.ref();
      const submitLoading = vue.ref(false);
      function submit() {
        form.value.validate().then(() => {
          const params = {
            ...formstate.value
          };
          if (params.hazardsourceIdentificationList && params.hazardsourceIdentificationList.includes("其他") && params.hazardsourceIdentificationList_other) {
            params.hazardsourceIdentificationList = [
              ...params.hazardsourceIdentificationList,
              ...params.hazardsourceIdentificationList_other.split(",")
            ];
          }
          if (params.hazardIdentificationList && params.hazardIdentificationList.includes("其他") && params.hazardIdentificationList_other) {
            params.hazardIdentificationList = [
              ...params.hazardIdentificationList,
              ...params.hazardIdentificationList_other.split(",")
            ];
          }
          if (params.dateTime && params.dateTime.length === 2) {
            params.startTime = formatDate(params.dateTime[0]);
            params.endTime = formatDate(params.dateTime[1]);
          }
          fileList.value.forEach((item) => {
            params.fileList = [];
            if (item.response) {
              const urlMessage = JSON.parse(item.response);
              params.fileList.push(urlMessage.data);
            }
          });
          photoList.value.forEach((item) => {
            params.photoList = [];
            if (item.response) {
              const urlMessage = JSON.parse(item.response);
              params.photoList.push(urlMessage.data);
            }
          });
          submitLoading.value = true;
          request({
            url: `/${config.mesMain}/hotwork/apply/insert`,
            data: params,
            needAuth: false,
            method: "POST"
          }).then(() => {
            showSuccess("操作成功");
            setTimeout(() => {
              location.reload();
            }, 500);
          }).finally(() => {
            submitLoading.value = false;
          });
        });
      }
      const hotWorkLocations = vue.ref([
        { label: "请先选择申请部门", value: -1 }
      ]);
      function queryLocations({ value, selectedItems: { charge } }) {
        formatAppLog("log", "at pages/hotWork/hotWork.vue:303", charge, value);
        formstate.value.departSupervisor = charge;
        request({
          url: `/${config.mesMain}/basic/area/getByDepart/${value}`,
          data: {},
          needAuth: false,
          method: "GET"
        }).then((data) => {
          hotWorkLocations.value = [];
          data.forEach((item) => {
            hotWorkLocations.value.push({
              label: item,
              valueu: item
            });
          });
        });
      }
      const applyDepartments = vue.ref([]);
      function queryApplyDepartment() {
        request({
          url: `/${config.mesUser}/sys/organization/listByName`,
          // 拼接URL: /mes-main/api/data
          data: {
            orgName: ""
          },
          needAuth: false,
          method: "GET"
        }).then((data) => {
          if (data) {
            applyDepartments.value = [];
            data.forEach((item) => {
              applyDepartments.value.push({
                label: item.orgFullName,
                value: item.orgFullName,
                charge: item.charge
              });
            });
          }
        }).finally(() => {
        });
      }
      const level = vue.ref([
        {
          label: "一级",
          value: 1
        },
        {
          label: "二级",
          value: 2
        },
        {
          label: "三级",
          value: 3
        }
      ]);
      const hazardSources = vue.ref([
        {
          label: "易燃易爆危险品",
          value: "易燃易爆危险品"
        },
        {
          label: "油漆",
          value: "油漆"
        },
        {
          label: "油类",
          value: "油类"
        },
        {
          label: "电器设备",
          value: "电器设备"
        },
        {
          label: "压力容器",
          value: "压力容器"
        },
        {
          label: "彩钢板",
          value: "彩钢板"
        },
        {
          label: "木材",
          value: "木材"
        },
        {
          label: "油回丝等",
          value: "油回丝等"
        },
        {
          label: "其他",
          value: "其他"
        }
      ]);
      const warringType = vue.ref([
        {
          label: "火灾",
          value: "火灾"
        },
        {
          label: "爆炸",
          value: "爆炸"
        },
        {
          label: "触电",
          value: "触电"
        },
        {
          label: "高处坠落",
          value: "高处坠落"
        },
        {
          label: "其他",
          value: "其他"
        }
      ]);
      const show = vue.ref(false);
      const securityMeasuresList = vue.ref([]);
      const securityMeasuresRemark = vue.ref("");
      function open() {
        querySecurityMeasures();
        show.value = true;
      }
      function handleClose() {
        show.value = false;
        securityMeasuresRemark.value = "";
        securityMeasuresList.value = [];
      }
      function confirm() {
        formstate.value.safeIdList = [];
        formstate.value.remark = securityMeasuresRemark.value;
        securityMeasuresList.value.forEach((item) => {
          formstate.value.safeIdList.push(item.securityMeasure);
        });
        handleClose();
      }
      function querySecurityMeasures() {
        request({
          url: `/${config.mesUser}/sys/word/listWordListByParentCode/AQCS`,
          data: {},
          needAuth: false,
          method: "GET"
        }).then((data) => {
          securityMeasuresList.value = [];
          data.forEach((item) => {
            securityMeasuresList.value.push({
              securityMeasure: item.wordName,
              confirm: false
            });
          });
        }).finally(() => {
        });
      }
      const photoList = vue.ref([]);
      const fileList = vue.ref([]);
      const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`;
      vue.onMounted(() => {
        queryApplyDepartment();
      });
      const __returned__ = { formstate, form, submitLoading, submit, hotWorkLocations, queryLocations, applyDepartments, queryApplyDepartment, level, hazardSources, warringType, show, securityMeasuresList, securityMeasuresRemark, open, handleClose, confirm, querySecurityMeasures, photoList, fileList, action, get pause() {
        return pause;
      }, get useToast() {
        return useToast;
      }, TabBarVue, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get formatDate() {
        return formatDate;
      }, get base64ToFile() {
        return base64ToFile;
      }, get showSuccess() {
        return showSuccess;
      }, get config() {
        return config;
      }, onMounted: vue.onMounted, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_picker = resolveEasycom(vue.resolveDynamicComponent("wd-picker"), __easycom_0$3);
    const _component_wd_input = resolveEasycom(vue.resolveDynamicComponent("wd-input"), __easycom_2$1);
    const _component_wd_datetime_picker = resolveEasycom(vue.resolveDynamicComponent("wd-datetime-picker"), __easycom_1$2);
    const _component_wd_textarea = resolveEasycom(vue.resolveDynamicComponent("wd-textarea"), __easycom_2);
    const _component_wd_select_picker = resolveEasycom(vue.resolveDynamicComponent("wd-select-picker"), __easycom_3);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_6);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_upload = resolveEasycom(vue.resolveDynamicComponent("wd-upload"), __easycom_4);
    const _component_wd_form = resolveEasycom(vue.resolveDynamicComponent("wd-form"), __easycom_7);
    const _component_wd_col = resolveEasycom(vue.resolveDynamicComponent("wd-col"), __easycom_9);
    const _component_wd_row = resolveEasycom(vue.resolveDynamicComponent("wd-row"), __easycom_10);
    const _component_wd_radio = resolveEasycom(vue.resolveDynamicComponent("wd-radio"), __easycom_11);
    const _component_wd_radio_group = resolveEasycom(vue.resolveDynamicComponent("wd-radio-group"), __easycom_12);
    const _component_wd_popup = resolveEasycom(vue.resolveDynamicComponent("wd-popup"), __easycom_13);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" form表单 "),
      vue.createElementVNode("view", null, [
        vue.createVNode(_component_wd_form, {
          ref: "form",
          model: $setup.formstate,
          border: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              columns: $setup.applyDepartments,
              label: "申请部门",
              modelValue: $setup.formstate.workshop,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formstate.workshop = $event),
              onConfirm: $setup.queryLocations
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              label: "部门管理员",
              type: "text",
              modelValue: $setup.formstate.departSupervisor,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formstate.departSupervisor = $event),
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              label: "动火车间",
              type: "text",
              modelValue: $setup.formstate.department,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formstate.department = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              prop: "location",
              columns: $setup.hotWorkLocations,
              label: "动火部位",
              modelValue: $setup.formstate.location,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formstate.location = $event),
              placeholder: "请选择动火部位",
              disabled: !$setup.formstate.workshop,
              rules: [{ required: true, message: "请选择动火部位" }]
            }, null, 8, ["columns", "modelValue", "disabled"]),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              columns: $setup.level,
              label: "动火级别",
              modelValue: $setup.formstate.level,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.formstate.level = $event)
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_datetime_picker, {
              label: "动火时间",
              "align-right": "",
              modelValue: $setup.formstate.dateTime,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.formstate.dateTime = $event),
              rules: [{ required: true, message: "请填写动火时间" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_textarea, {
              "align-right": "",
              label: "动火内容",
              modelValue: $setup.formstate.content,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.formstate.content = $event),
              placeholder: "请填写详细的动火内容",
              maxlength: 300,
              clearable: "",
              "show-word-limit": ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              label: "动火设备",
              modelValue: $setup.formstate.equipment,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.formstate.equipment = $event),
              placeholder: "请填写详细的动火设备",
              clearable: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_select_picker, {
              "align-right": "",
              label: "危险源识别",
              modelValue: $setup.formstate.hazardsourceIdentificationList,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.formstate.hazardsourceIdentificationList = $event),
              columns: $setup.hazardSources
            }, null, 8, ["modelValue", "columns"]),
            $setup.formstate.hazardsourceIdentificationList && $setup.formstate.hazardsourceIdentificationList.includes("其他") ? (vue.openBlock(), vue.createBlock(_component_wd_input, {
              key: 0,
              "align-right": "",
              label: "危险源识别-其他",
              type: "text",
              modelValue: $setup.formstate.hazardsourceIdentificationList_other,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.formstate.hazardsourceIdentificationList_other = $event),
              placeholder: "用英文状态的,分隔"
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("v-if", true),
            vue.createVNode(_component_wd_select_picker, {
              "align-right": "",
              label: "危险辨识",
              modelValue: $setup.formstate.hazardIdentificationList,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.formstate.hazardIdentificationList = $event),
              columns: $setup.warringType
            }, null, 8, ["modelValue", "columns"]),
            $setup.formstate.hazardIdentificationList && $setup.formstate.hazardIdentificationList.includes("其他") ? (vue.openBlock(), vue.createBlock(_component_wd_input, {
              key: 1,
              "align-right": "",
              label: "危险辨识-其他",
              type: "text",
              modelValue: $setup.formstate.hazardIdentificationList_other,
              "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.formstate.hazardIdentificationList_other = $event),
              placeholder: "用英文状态的,分隔"
            }, null, 8, ["modelValue"])) : vue.createCommentVNode("v-if", true),
            vue.createVNode(_component_wd_cell, {
              title: "安全措施确认",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_button, { onClick: $setup.open }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 安全措施确认 ")
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              label: "动火人",
              type: "text",
              modelValue: $setup.formstate.hotworkUser,
              "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $setup.formstate.hotworkUser = $event)
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              label: "特种作业操作证号或工作证号",
              type: "text",
              modelValue: $setup.formstate.certificateCode,
              "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $setup.formstate.certificateCode = $event),
              placeholder: "请输入"
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              label: "现场监护人",
              type: "text",
              modelValue: $setup.formstate.guardian,
              "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $setup.formstate.guardian = $event),
              placeholder: "请输入"
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              label: "现场指挥",
              type: "text",
              modelValue: $setup.formstate.siteSupervisor,
              "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $setup.formstate.siteSupervisor = $event),
              placeholder: "请输入"
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_cell, {
              title: "资料上传(图片)",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_upload, {
                  "file-list": $setup.photoList,
                  "onUpdate:fileList": _cache[16] || (_cache[16] = ($event) => $setup.photoList = $event),
                  "image-mode": "aspectFill",
                  action: $setup.action
                }, null, 8, ["file-list"])
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createVNode(_component_wd_cell, {
              title: "资料上传(文件)",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_upload, {
                  "file-list": $setup.fileList,
                  "onUpdate:fileList": _cache[17] || (_cache[17] = ($event) => $setup.fileList = $event),
                  accept: "all",
                  multiple: "",
                  action: $setup.action
                }, null, 8, ["file-list"])
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createElementVNode("view", { class: "footer" }, [
              vue.createVNode(_component_wd_button, {
                type: "primary",
                size: "large",
                onClick: $setup.submit,
                block: "",
                loading: $setup.submitLoading
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("提交")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["loading"])
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["model"])
      ]),
      vue.createCommentVNode(" 安全措施确认 "),
      vue.createVNode(_component_wd_popup, {
        modelValue: $setup.show,
        "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $setup.show = $event),
        position: "bottom",
        "close-on-click-modal": false,
        closable: "",
        "custom-style": "height: 60%;",
        onClose: $setup.handleClose,
        class: "security_measure"
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "security_measure_view" }, [
            vue.createVNode(_component_wd_row, { class: "security_measure_header" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_col, { span: 2 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", null, "序号")
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_wd_col, { span: 13 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", null, "安全措施")
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_wd_col, { span: 9 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", null, "确认")
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            }),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.securityMeasuresList, (item, index) => {
                return vue.openBlock(), vue.createBlock(
                  _component_wd_row,
                  {
                    class: "security_measure_row",
                    key: index
                  },
                  {
                    default: vue.withCtx(() => [
                      vue.createVNode(
                        _component_wd_col,
                        {
                          span: 2,
                          class: "security_measure_item"
                        },
                        {
                          default: vue.withCtx(() => [
                            vue.createElementVNode(
                              "view",
                              null,
                              vue.toDisplayString(index + 1),
                              1
                              /* TEXT */
                            )
                          ]),
                          _: 2
                          /* DYNAMIC */
                        },
                        1024
                        /* DYNAMIC_SLOTS */
                      ),
                      vue.createVNode(
                        _component_wd_col,
                        {
                          span: 13,
                          class: "security_measure_item"
                        },
                        {
                          default: vue.withCtx(() => [
                            vue.createElementVNode(
                              "view",
                              null,
                              vue.toDisplayString(item.securityMeasure),
                              1
                              /* TEXT */
                            )
                          ]),
                          _: 2
                          /* DYNAMIC */
                        },
                        1024
                        /* DYNAMIC_SLOTS */
                      ),
                      vue.createVNode(
                        _component_wd_col,
                        {
                          span: 9,
                          class: "security_measure_item"
                        },
                        {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_wd_radio_group, {
                              modelValue: item.confirm,
                              "onUpdate:modelValue": ($event) => item.confirm = $event,
                              shape: "dot",
                              inline: ""
                            }, {
                              default: vue.withCtx(() => [
                                vue.createVNode(_component_wd_radio, { value: true }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode("通过")
                                  ]),
                                  _: 1
                                  /* STABLE */
                                }),
                                vue.createVNode(_component_wd_radio, { value: false }, {
                                  default: vue.withCtx(() => [
                                    vue.createTextVNode("不通过")
                                  ]),
                                  _: 1
                                  /* STABLE */
                                })
                              ]),
                              _: 2
                              /* DYNAMIC */
                            }, 1032, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 2
                          /* DYNAMIC */
                        },
                        1024
                        /* DYNAMIC_SLOTS */
                      )
                    ]),
                    _: 2
                    /* DYNAMIC */
                  },
                  1024
                  /* DYNAMIC_SLOTS */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.createVNode(_component_wd_textarea, {
              "align-right": "",
              label: "备注",
              modelValue: $setup.securityMeasuresRemark,
              "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $setup.securityMeasuresRemark = $event),
              placeholder: "请填写备注信息",
              maxlength: 300,
              clearable: "",
              "show-word-limit": "",
              style: { "margin-top": "1rem" }
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("view", { class: "footer" }, [
              vue.createVNode(_component_wd_button, {
                type: "primary",
                size: "large",
                onClick: $setup.confirm,
                bloc: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("确认")
                ]),
                _: 1
                /* STABLE */
              })
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"]),
      vue.createCommentVNode(" endregion "),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesHotWorkHotWork = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__file", "E:/开发/app/security-environment/pages/hotWork/hotWork.vue"]]);
  const tagProps = {
    ...baseProps,
    /**
     * 是否开启图标插槽
     * 类型：boolean
     * 默认值：false
     */
    useIconSlot: makeBooleanProp(false),
    /**
     * 标签类型
     * 类型：string
     * 可选值：'default' / 'primary' / 'danger' / 'warning' / 'success'
     * 默认值：'default'
     */
    type: makeStringProp("default"),
    /**
     * 左侧图标
     * 类型：string
     * 默认值：空字符串
     */
    icon: makeStringProp(""),
    /**
     * 是否可关闭（只对圆角类型支持）
     * 类型：boolean
     * 默认值：false
     */
    closable: makeBooleanProp(false),
    /**
     * 幽灵类型
     * 类型：boolean
     * 默认值：false
     */
    plain: makeBooleanProp(false),
    /**
     * 是否为新增标签
     * 类型：boolean
     * 默认值：false
     */
    dynamic: makeBooleanProp(false),
    /**
     * 文字颜色
     * 类型：string
     * 默认值：空字符串
     */
    color: makeStringProp(""),
    /**
     * 背景色和边框色
     * 类型：string
     * 默认值：空字符串
     */
    bgColor: makeStringProp(""),
    /**
     * 圆角类型
     * 类型：boolean
     * 默认值：false
     */
    round: makeBooleanProp(false),
    /**
     * 标记类型
     * 类型：boolean
     * 默认值：false
     */
    mark: makeBooleanProp(false)
  };
  const __default__$1 = {
    name: "wd-tag",
    options: {
      addGlobalClass: true,
      virtualHost: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1,
    props: tagProps,
    emits: ["click", "close", "confirm"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const { translate } = useTranslate("tag");
      const tagClass = vue.ref("");
      const dynamicValue = vue.ref("");
      const dynamicInput = vue.ref(false);
      vue.watch(
        [() => props.useIconSlot, () => props.icon, () => props.plain, () => props.dynamic, () => props.round, () => props.mark],
        () => {
          computeTagClass();
        },
        { deep: true, immediate: true }
      );
      vue.watch(
        () => props.type,
        (newValue) => {
          if (!newValue)
            return;
          const type = ["primary", "danger", "warning", "success", "default"];
          if (type.indexOf(newValue) === -1)
            formatAppLog("error", "at uni_modules/wot-design-uni/components/wd-tag/wd-tag.vue:73", `type must be one of ${type.toString()}`);
          computeTagClass();
        },
        { immediate: true }
      );
      vue.watch(
        () => dynamicInput.value,
        () => {
          computeTagClass();
        },
        { immediate: true }
      );
      const rootClass = vue.computed(() => {
        return `wd-tag ${props.customClass} ${tagClass.value}`;
      });
      const rootStyle = vue.computed(() => {
        const rootStyle2 = {};
        if (!props.plain && props.bgColor) {
          rootStyle2["background"] = props.bgColor;
        }
        if (props.bgColor) {
          rootStyle2["border-color"] = props.bgColor;
        }
        return `${objToStyle(rootStyle2)}${props.customStyle}`;
      });
      const textStyle = vue.computed(() => {
        const textStyle2 = {};
        if (props.color) {
          textStyle2["color"] = props.color;
        }
        return objToStyle(textStyle2);
      });
      function computeTagClass() {
        const { type, plain, round, mark, dynamic, icon, useIconSlot } = props;
        let tagClassList = [];
        type && tagClassList.push(`is-${type}`);
        plain && tagClassList.push("is-plain");
        round && tagClassList.push("is-round");
        mark && tagClassList.push("is-mark");
        dynamic && tagClassList.push("is-dynamic");
        dynamicInput.value && tagClassList.push("is-dynamic-input");
        if (icon || useIconSlot)
          tagClassList.push("is-icon");
        tagClass.value = tagClassList.join(" ");
      }
      function handleClick(event) {
        emit("click", event);
      }
      function handleClose(event) {
        emit("close", event);
      }
      function handleAdd() {
        dynamicInput.value = true;
        dynamicValue.value = "";
      }
      function handleBlur() {
        setDynamicInput();
      }
      function handleConfirm(event) {
        setDynamicInput();
        emit("confirm", {
          value: event.detail.value
        });
      }
      function setDynamicInput() {
        dynamicInput.value = false;
      }
      const __returned__ = { props, emit, translate, tagClass, dynamicValue, dynamicInput, rootClass, rootStyle, textStyle, computeTagClass, handleClick, handleClose, handleAdd, handleBlur, handleConfirm, setDynamicInput, wdIcon: __easycom_1$3 };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        style: vue.normalizeStyle($setup.rootStyle),
        onClick: $setup.handleClick
      },
      [
        _ctx.useIconSlot ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "wd-tag__icon"
        }, [
          vue.renderSlot(_ctx.$slots, "icon", {}, void 0, true)
        ])) : _ctx.icon ? (vue.openBlock(), vue.createBlock($setup["wdIcon"], {
          key: 1,
          name: _ctx.icon,
          "custom-class": "wd-tag__icon"
        }, null, 8, ["name"])) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode(
          "view",
          {
            class: "wd-tag__text",
            style: vue.normalizeStyle($setup.textStyle)
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          4
          /* STYLE */
        ),
        _ctx.closable && _ctx.round ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "wd-tag__close",
          onClick: vue.withModifiers($setup.handleClose, ["stop"])
        }, [
          vue.createVNode($setup["wdIcon"], { name: "error-fill" })
        ])) : vue.createCommentVNode("v-if", true),
        $setup.dynamicInput && _ctx.dynamic ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
          key: 3,
          class: "wd-tag__add-text",
          placeholder: $setup.translate("placeholder"),
          type: "text",
          focus: true,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.dynamicValue = $event),
          onBlur: $setup.handleBlur,
          onConfirm: $setup.handleConfirm
        }, null, 40, ["placeholder"])), [
          [vue.vModelText, $setup.dynamicValue]
        ]) : _ctx.dynamic ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 4,
            class: "wd-tag__text",
            style: vue.normalizeStyle($setup.textStyle),
            onClick: vue.withModifiers($setup.handleAdd, ["stop"])
          },
          [
            _ctx.$slots.add ? vue.renderSlot(_ctx.$slots, "add", { key: 0 }, void 0, true) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 1 },
              [
                vue.createVNode($setup["wdIcon"], {
                  name: "add",
                  "custom-class": "wd-tag__add wd-tag__icon"
                }),
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString($setup.translate("add")),
                  1
                  /* TEXT */
                )
              ],
              64
              /* STABLE_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-97328e6e"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-tag/wd-tag.vue"]]);
  const _sfc_main$a = {
    __name: "onSiteInspection",
    setup(__props, { expose: __expose }) {
      __expose();
      const inspectionTaskList = vue.ref([]);
      function queryDate() {
        Promise.all([
          request({
            url: `/${config.mesMain}/hazardcheck/execution/taskList`,
            data: {
              area: ""
            },
            needAuth: true,
            method: "GET"
          }),
          request({
            url: `/${config.mesMain}/hazardcheck/execution/taskListEd`,
            data: {
              area: ""
            },
            needAuth: true,
            method: "GET"
          })
        ]).then(([d1, d2]) => {
          inspectionTaskList.value = [
            ...d1.list,
            ...d2.list
          ];
          formatAppLog("log", "at pages/onSiteInspection/onSiteInspection.vue:70", inspectionTaskList.value);
        }).finally(() => {
          uni.stopPullDownRefresh();
        });
      }
      function toDetails(deteils) {
        uni.navigateTo({
          url: `/pages/inspectionDetails/inspectionDetails?testId=${deteils.id}`
        });
      }
      vue.onMounted(() => {
        queryDate();
      });
      onPullDownRefresh(() => {
        queryDate();
      });
      const __returned__ = { inspectionTaskList, queryDate, toDetails, onMounted: vue.onMounted, ref: vue.ref, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get onPullDownRefresh() {
        return onPullDownRefresh;
      }, get config() {
        return config;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_tag = resolveEasycom(vue.resolveDynamicComponent("wd-tag"), __easycom_0$1);
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$3);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_cell_group = resolveEasycom(vue.resolveDynamicComponent("wd-cell-group"), __easycom_3$1);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", { style: { "margin-top": "1em" } }, [
      vue.createVNode(_component_wd_cell_group, null, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.inspectionTaskList, (item, index) => {
              return vue.openBlock(), vue.createBlock(
                _component_wd_cell,
                { key: index },
                {
                  title: vue.withCtx(() => [
                    vue.createElementVNode("view", null, [
                      vue.createElementVNode(
                        "view",
                        null,
                        vue.toDisplayString(item.area),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { style: { "display": "inline-block", "color": "#7f7f7f", "font-size": "15rpx" } }, [
                        vue.createTextVNode(
                          vue.toDisplayString(item.checkCode) + " ",
                          1
                          /* TEXT */
                        ),
                        vue.createVNode(
                          _component_wd_tag,
                          {
                            "custom-class": "space",
                            type: "primary"
                          },
                          {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(
                                vue.toDisplayString(item.checkType),
                                1
                                /* TEXT */
                              )
                            ]),
                            _: 2
                            /* DYNAMIC */
                          },
                          1024
                          /* DYNAMIC_SLOTS */
                        )
                      ]),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["status", item.state ? "success" : "notStarted"])
                        },
                        vue.toDisplayString(item.state ? "已完成" : "未开始"),
                        3
                        /* TEXT, CLASS */
                      )
                    ])
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_wd_icon, {
                      name: "arrow-right",
                      size: "22px",
                      style: { "line-height": "2em" },
                      onClick: ($event) => $setup.toDetails(item)
                    }, null, 8, ["onClick"])
                  ]),
                  _: 2
                  /* DYNAMIC */
                },
                1024
                /* DYNAMIC_SLOTS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesOnSiteInspectionOnSiteInspection = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__file", "E:/开发/app/security-environment/pages/onSiteInspection/onSiteInspection.vue"]]);
  /*!
    * vue-router v4.3.0
    * (c) 2024 Eduardo San Martin Morote
    * @license MIT
    */
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  var NavigationFailureType;
  (function(NavigationFailureType2) {
    NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
    NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
    NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
  })(NavigationFailureType || (NavigationFailureType = {}));
  const routeLocationKey = Symbol("route location");
  function useRoute() {
    return vue.inject(routeLocationKey);
  }
  const _sfc_main$9 = {
    __name: "inspectionDetails",
    setup(__props, { expose: __expose }) {
      __expose();
      const editItemId = vue.ref(-1);
      const { success: showSuccess2 } = useToast();
      const formstate = vue.ref();
      const form = vue.ref();
      function queryDetails() {
        request({
          url: `/${config.mesMain}/hazardcheck/execution/getBy/${editItemId.value}`,
          data: {
            area: ""
          },
          needAuth: true,
          method: "GET"
        }).then((data) => {
          formatAppLog("log", "at pages/inspectionDetails/inspectionDetails.vue:81", data);
          if (!data)
            data = {};
          data.result = data.result ? 1 : 0;
          if (data.photoList && data.photoList.length > 0) {
            fileList.value = [];
            data.photoList.forEach((item) => {
              fileList.value.push({
                url: item
              });
            });
          }
          formstate.value = data;
        });
      }
      function submit() {
        form.value.validate().then(({
          valid,
          errors
        }) => {
          if (valid) {
            const params = {
              ...formstate.value
            };
            fileList.value.forEach((item) => {
              params.photoList = [];
              if (item.response) {
                const urlMessage = JSON.parse(item.response);
                params.photoList.push(urlMessage.data);
              }
            });
            request({
              url: `/${config.mesMain}/hazardcheck/execution/update`,
              // 拼接URL: /mes-main/api/data
              data: params,
              needAuth: true,
              method: "put"
            }).then((data) => {
              showSuccess2({
                msg: "上报成功!"
              });
              uni.navigateBack({
                delta: 1
              });
            });
          }
        }).catch((error) => {
          formatAppLog("log", "at pages/inspectionDetails/inspectionDetails.vue:134", error, "error");
        });
      }
      function openReported() {
        uni.navigateTo({
          url: `/pages/hazardReporting/hazardReporting?testId=${formstate.value.id}`
        });
      }
      const resultList = [
        {
          label: "无隐患",
          value: 0
        },
        {
          label: "有隐患",
          value: 1
        }
      ];
      function scan() {
        if (formstate.value.state === 1)
          return;
        uni.scanCode({
          success: function(res) {
            formatAppLog("log", "at pages/inspectionDetails/inspectionDetails.vue:168", "条码类型：" + res.scanType);
            formatAppLog("log", "at pages/inspectionDetails/inspectionDetails.vue:169", "条码内容：" + res.result);
            formstate.value.sign = res.result;
          }
        });
      }
      const fileList = vue.ref([]);
      const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`;
      onLoad((option) => {
        formatAppLog("log", "at pages/inspectionDetails/inspectionDetails.vue:187", "接收到的testId参数是：", option);
        editItemId.value = option.testId;
        queryDetails();
      });
      onShow(() => {
        if (formstate.value) {
          queryDetails();
        }
      });
      const __returned__ = { editItemId, showSuccess: showSuccess2, formstate, form, queryDetails, submit, openReported, resultList, scan, fileList, action, onMounted: vue.onMounted, getCurrentInstance: vue.getCurrentInstance, ref: vue.ref, get useRoute() {
        return useRoute;
      }, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, get useToast() {
        return useToast;
      }, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get config() {
        return config;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_input = resolveEasycom(vue.resolveDynamicComponent("wd-input"), __easycom_2$1);
    const _component_wd_select_picker = resolveEasycom(vue.resolveDynamicComponent("wd-select-picker"), __easycom_3);
    const _component_wd_upload = resolveEasycom(vue.resolveDynamicComponent("wd-upload"), __easycom_4);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_6);
    const _component_wd_form = resolveEasycom(vue.resolveDynamicComponent("wd-form"), __easycom_7);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" form表单 "),
      vue.createElementVNode("view", { v: "" }, [
        vue.createVNode(_component_wd_form, {
          ref: "form",
          model: $setup.formstate,
          border: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.checkCode,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formstate.checkCode = $event),
              label: "检查编号",
              placeholder: "",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.planCheckTime,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formstate.planCheckTime = $event),
              label: "计划开始时间",
              placeholder: "",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.checkType,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formstate.checkType = $event),
              label: "检查类别",
              placeholder: "",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.checkCriteria,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formstate.checkCriteria = $event),
              label: "检查标准",
              placeholder: "",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.checkUser,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.formstate.checkUser = $event),
              label: "检查人",
              placeholder: "",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.area,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.formstate.area = $event),
              label: "区域",
              placeholder: "",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.content,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.formstate.content = $event),
              label: "内容",
              placeholder: "",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_select_picker, {
              "align-right": "",
              label: "巡检结果",
              modelValue: $setup.formstate.result,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.formstate.result = $event),
              columns: $setup.resultList,
              "show-confirm": false,
              type: "radio",
              prop: "result",
              rules: [{ required: true, message: "请选择巡检结果" }],
              disabled: $setup.formstate.state === 1
            }, null, 8, ["modelValue", "disabled"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.remark,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.formstate.remark = $event),
              label: "备注",
              disabled: $setup.formstate.state === 1
            }, null, 8, ["modelValue", "disabled"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.sign,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.formstate.sign = $event),
              label: "区域编码",
              "suffix-icon": "scan",
              readonly: "",
              onClick: _cache[10] || (_cache[10] = ($event) => $setup.scan()),
              prop: "sign",
              rules: [{ required: true, message: "请扫描区域编码" }],
              disabled: $setup.formstate.state === 1
            }, null, 8, ["modelValue", "disabled"]),
            vue.createVNode(_component_wd_cell, {
              title: "现场图片上传",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_upload, {
                  "file-list": $setup.fileList,
                  "onUpdate:fileList": _cache[11] || (_cache[11] = ($event) => $setup.fileList = $event),
                  "image-mode": "aspectFill",
                  action: $setup.action,
                  disabled: $setup.formstate.state === 1
                }, null, 8, ["file-list", "disabled"])
              ]),
              _: 1
              /* STABLE */
            }),
            $setup.formstate.state !== 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "footer"
            }, [
              $setup.formstate.result === 1 ? (vue.openBlock(), vue.createBlock(_component_wd_button, {
                key: 0,
                type: "primary",
                size: "large",
                onClick: $setup.openReported,
                block: "",
                disabled: $setup.formstate.isReport === 1
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 隐患上报 ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["disabled"])) : vue.createCommentVNode("v-if", true),
              vue.createVNode(_component_wd_button, {
                type: "primary",
                size: "large",
                onClick: $setup.submit,
                block: "",
                style: { "margin-top": "1rem" }
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("提交")
                ]),
                _: 1
                /* STABLE */
              })
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          _: 1
          /* STABLE */
        }, 8, ["model"])
      ]),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesInspectionDetailsInspectionDetails = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__file", "E:/开发/app/security-environment/pages/inspectionDetails/inspectionDetails.vue"]]);
  const _sfc_main$8 = {
    __name: "inspectionTask",
    setup(__props, { expose: __expose }) {
      __expose();
      function todo(type) {
        switch (type) {
          case "1": {
            uni.navigateTo({
              url: `/pages/onSiteInspection/onSiteInspection`
            });
            break;
          }
          case "2": {
            uni.navigateTo({
              url: `/pages/riskInspection/riskInspection`
            });
            break;
          }
        }
      }
      const __returned__ = { todo, onMounted: vue.onMounted, ref: vue.ref, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get config() {
        return config;
      }, TabBarVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$3);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_cell_group = resolveEasycom(vue.resolveDynamicComponent("wd-cell-group"), __easycom_3$1);
    return vue.openBlock(), vue.createElementBlock("view", { style: { "margin-top": "1em" } }, [
      vue.createVNode(_component_wd_cell_group, null, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_wd_cell, { title: "隐患巡检" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_wd_icon, {
                name: "arrow-right",
                size: "22px",
                style: { "line-height": "2em" },
                center: "",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.todo("1"))
              })
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createVNode(_component_wd_cell, { title: "风险巡检" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_wd_icon, {
                name: "arrow-right",
                size: "22px",
                style: { "line-height": "2em" },
                center: "",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.todo("2"))
              })
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode($setup["TabBarVue"])
    ]);
  }
  const PagesInspectionTaskInspectionTask = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__file", "E:/开发/app/security-environment/pages/inspectionTask/inspectionTask.vue"]]);
  const _sfc_main$7 = {
    __name: "report",
    setup(__props, { expose: __expose }) {
      __expose();
      function todo(type) {
        switch (type) {
          case "1": {
            uni.navigateTo({
              url: `/pages/hazardReporting/hazardReporting`
            });
            break;
          }
          case "2": {
            uni.navigateTo({
              url: `/pages/riskInspection/riskInspection`
            });
            break;
          }
          case "3": {
            uni.navigateTo({
              url: `/pages/accidentReport/accidentReport`
            });
            break;
          }
        }
      }
      const __returned__ = { todo, onMounted: vue.onMounted, ref: vue.ref, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get config() {
        return config;
      }, TabBarVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$3);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_cell_group = resolveEasycom(vue.resolveDynamicComponent("wd-cell-group"), __easycom_3$1);
    return vue.openBlock(), vue.createElementBlock("view", { style: { "margin-top": "1em" } }, [
      vue.createVNode(_component_wd_cell_group, null, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_wd_cell, { title: "隐患上报" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_wd_icon, {
                name: "arrow-right",
                size: "22px",
                style: { "line-height": "2em" },
                center: "",
                onClick: _cache[0] || (_cache[0] = ($event) => $setup.todo("1"))
              })
            ]),
            _: 1
            /* STABLE */
          }),
          vue.createCommentVNode(` <wd-cell title="风险上报">\r
				<wd-icon name="arrow-right" size="22px" style="line-height: 2em;" center @click="todo('2')"></wd-icon>\r
			</wd-cell> `),
          vue.createVNode(_component_wd_cell, { title: "事故上报" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_wd_icon, {
                name: "arrow-right",
                size: "22px",
                style: { "line-height": "2em" },
                center: "",
                onClick: _cache[1] || (_cache[1] = ($event) => $setup.todo("3"))
              })
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode($setup["TabBarVue"], { tabbar: "report" })
    ]);
  }
  const PagesReportReport = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__file", "E:/开发/app/security-environment/pages/report/report.vue"]]);
  const _sfc_main$6 = {
    __name: "riskInspection",
    setup(__props, { expose: __expose }) {
      __expose();
      const inspectionTaskList = vue.ref([]);
      function queryDate() {
        Promise.all([
          request({
            url: `/${config.mesMain}/riskcheck/execution/taskList`,
            data: {
              area: "",
              pageNum: 1,
              pageSize: 9999
            },
            needAuth: true,
            method: "GET"
          }),
          request({
            url: `/${config.mesMain}/riskcheck/execution/taskListEd`,
            data: {
              area: "",
              pageNum: 1,
              pageSize: 9999
            },
            needAuth: true,
            method: "GET"
          })
        ]).then(([d1, d2]) => {
          inspectionTaskList.value = [
            ...d1.list,
            ...d2.list
          ];
          formatAppLog("log", "at pages/riskInspection/riskInspection.vue:75", inspectionTaskList.value);
        }).finally(() => {
          uni.stopPullDownRefresh();
        });
      }
      const optionType = vue.ref(1);
      function toDetails(deteils) {
        uni.navigateTo({
          url: `/pages/riskInspectionDetails/riskInspectionDetails`,
          success(res) {
            res.eventChannel.emit("acceptDataFromOpenerPage", { id: deteils.id });
          }
        });
      }
      vue.onMounted(() => {
        queryDate();
        const instance = vue.getCurrentInstance().proxy;
        const eventChannel = instance.getOpenerEventChannel();
        eventChannel.on("acceptDataFromOpenerPage", function(data) {
          optionType.value = data.type;
          uni.setNavigationBarTitle({
            title: optionType.value === 2 ? "风险上报任务" : "巡检任务"
          });
        });
      });
      onPullDownRefresh(() => {
        queryDate();
      });
      const __returned__ = { inspectionTaskList, queryDate, optionType, toDetails, onMounted: vue.onMounted, ref: vue.ref, getCurrentInstance: vue.getCurrentInstance, get onPullDownRefresh() {
        return onPullDownRefresh;
      }, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get config() {
        return config;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_tag = resolveEasycom(vue.resolveDynamicComponent("wd-tag"), __easycom_0$1);
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$3);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_cell_group = resolveEasycom(vue.resolveDynamicComponent("wd-cell-group"), __easycom_3$1);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", { style: { "margin-top": "1em" } }, [
      vue.createVNode(_component_wd_cell_group, null, {
        default: vue.withCtx(() => [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($setup.inspectionTaskList, (item, index) => {
              return vue.openBlock(), vue.createBlock(
                _component_wd_cell,
                {
                  key: index,
                  center: ""
                },
                {
                  title: vue.withCtx(() => [
                    vue.createElementVNode("view", null, [
                      vue.createElementVNode(
                        "view",
                        null,
                        vue.toDisplayString(item.area),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { style: { "display": "inline-block", "color": "#7f7f7f", "font-size": "15rpx" } }, [
                        vue.createTextVNode(
                          vue.toDisplayString(item.riskCode) + " ",
                          1
                          /* TEXT */
                        ),
                        vue.createVNode(
                          _component_wd_tag,
                          {
                            "custom-class": "space",
                            type: "primary"
                          },
                          {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(
                                vue.toDisplayString(item.checkType),
                                1
                                /* TEXT */
                              )
                            ]),
                            _: 2
                            /* DYNAMIC */
                          },
                          1024
                          /* DYNAMIC_SLOTS */
                        )
                      ]),
                      vue.createElementVNode(
                        "view",
                        {
                          class: vue.normalizeClass(["status", item.state ? "success" : "notStarted"])
                        },
                        vue.toDisplayString(item.state ? "已完成" : "未开始"),
                        3
                        /* TEXT, CLASS */
                      )
                    ])
                  ]),
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_wd_icon, {
                      name: "arrow-right",
                      size: "22px",
                      onClick: ($event) => $setup.toDetails(item)
                    }, null, 8, ["onClick"])
                  ]),
                  _: 2
                  /* DYNAMIC */
                },
                1024
                /* DYNAMIC_SLOTS */
              );
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesRiskInspectionRiskInspection = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-55b128d6"], ["__file", "E:/开发/app/security-environment/pages/riskInspection/riskInspection.vue"]]);
  const _sfc_main$5 = {
    __name: "riskInspectionDetails",
    setup(__props, { expose: __expose }) {
      __expose();
      const editItemId = vue.ref(-1);
      const {
        success: showSuccess2
      } = useToast();
      const formstate = vue.ref();
      const form = vue.ref();
      const taskId = vue.ref();
      function submit() {
        form.value.validate().then(({
          valid,
          errors
        }) => {
          if (valid) {
            const url = `/${config.mesMain}/riskcheck/execution/update`;
            request({
              url,
              data: formstate.value,
              needAuth: true,
              method: "PUT"
            }).then((data) => {
              showSuccess2({
                msg: "上报成功!"
              });
              queryDetails();
            });
          }
        }).catch((error) => {
          formatAppLog("log", "at pages/riskInspectionDetails/riskInspectionDetails.vue:96", error, "error");
        });
      }
      function openReported() {
        uni.navigateTo({
          url: `/pages/riskReporting/riskReporting`,
          success(res) {
            res.eventChannel.emit("acceptDataFromOpenerPage", { id: formstate.value.id });
          }
        });
      }
      const resultList = [
        {
          label: "无风险",
          value: 0
        },
        {
          label: "有风险",
          value: 1
        }
      ];
      function scan() {
        if (formstate.value.state !== 1) {
          uni.scanCode({
            success: function(res) {
              formatAppLog("log", "at pages/riskInspectionDetails/riskInspectionDetails.vue:131", "条码类型：" + res.scanType);
              formatAppLog("log", "at pages/riskInspectionDetails/riskInspectionDetails.vue:132", "条码内容：" + res.result);
              formstate.value.sign = res.result;
            }
          });
        }
      }
      const fileList = vue.ref([]);
      const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`;
      function queryDetails() {
        request({
          url: `/${config.mesMain}/riskcheck/execution/getBy/${taskId.value}`,
          data: {},
          needAuth: true,
          method: "GET"
        }).then((data) => {
          if (!data)
            data = {};
          data.result = data.result ? 1 : 0;
          fileList.value = [];
          if (data.photoList && data.photoList.length > 0) {
            data.photoList.forEach((item) => {
              fileList.value.push({
                url: item
              });
            });
          }
          formstate.value = data;
        }).finally(() => {
          uni.stopPullDownRefresh();
        });
      }
      vue.onMounted(() => {
        const instance = vue.getCurrentInstance().proxy;
        const eventChannel = instance.getOpenerEventChannel();
        eventChannel.on("acceptDataFromOpenerPage", function(data) {
          formatAppLog("log", "at pages/riskInspectionDetails/riskInspectionDetails.vue:177", data, data.id);
          taskId.value = data.id;
          queryDetails();
        });
      });
      onPullDownRefresh(() => {
        queryDetails();
      });
      onShow(() => {
        if (formstate.value) {
          queryDetails();
        }
      });
      const __returned__ = { editItemId, showSuccess: showSuccess2, formstate, form, taskId, submit, openReported, resultList, scan, fileList, action, queryDetails, onMounted: vue.onMounted, getCurrentInstance: vue.getCurrentInstance, ref: vue.ref, get useToast() {
        return useToast;
      }, get onPullDownRefresh() {
        return onPullDownRefresh;
      }, get onShow() {
        return onShow;
      }, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get config() {
        return config;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_input = resolveEasycom(vue.resolveDynamicComponent("wd-input"), __easycom_2$1);
    const _component_wd_select_picker = resolveEasycom(vue.resolveDynamicComponent("wd-select-picker"), __easycom_3);
    const _component_wd_textarea = resolveEasycom(vue.resolveDynamicComponent("wd-textarea"), __easycom_2);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_upload = resolveEasycom(vue.resolveDynamicComponent("wd-upload"), __easycom_4);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_6);
    const _component_wd_form = resolveEasycom(vue.resolveDynamicComponent("wd-form"), __easycom_7);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" form表单 "),
      vue.createElementVNode("view", { v: "" }, [
        vue.createVNode(_component_wd_form, {
          ref: "form",
          model: $setup.formstate,
          border: "",
          disabled: "",
          v: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.planCheckTime,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formstate.planCheckTime = $event),
              label: "计划开始时间",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.checkType,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formstate.checkType = $event),
              label: "检查类别",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.checkCriteria,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formstate.checkCriteria = $event),
              label: "检查标准",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.checkUser,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formstate.checkUser = $event),
              label: "检查人",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.area,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.formstate.area = $event),
              label: "区域",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.content,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.formstate.content = $event),
              label: "内容",
              readonly: ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_select_picker, {
              "align-right": "",
              label: "巡检结果",
              modelValue: $setup.formstate.result,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.formstate.result = $event),
              columns: $setup.resultList,
              "show-confirm": false,
              type: "radio",
              prop: "sign",
              rules: [{ required: true, message: "请选扫描区域编码" }],
              disabled: $setup.formstate.state === 1
            }, null, 8, ["modelValue", "disabled"]),
            vue.createVNode(_component_wd_cell, {
              title: "备注",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_textarea, {
                  modelValue: $setup.formstate.remark,
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.formstate.remark = $event),
                  disabled: $setup.formstate.state === 1
                }, null, 8, ["modelValue", "disabled"])
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.sign,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.formstate.sign = $event),
              label: "区域编码",
              "suffix-icon": "scan",
              readonly: "",
              onClick: _cache[9] || (_cache[9] = ($event) => $setup.scan()),
              prop: "sign",
              rules: [{ required: true, message: "请选扫描区域编码" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_cell, {
              title: "现场图片上传",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_upload, {
                  "file-list": $setup.fileList,
                  "onUpdate:fileList": _cache[10] || (_cache[10] = ($event) => $setup.fileList = $event),
                  "image-mode": "aspectFill",
                  action: $setup.action,
                  disabled: $setup.formstate.state === 1
                }, null, 8, ["file-list", "disabled"])
              ]),
              _: 1
              /* STABLE */
            }),
            $setup.formstate.state !== 1 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "footer"
            }, [
              $setup.formstate.result === 1 ? (vue.openBlock(), vue.createBlock(_component_wd_button, {
                key: 0,
                type: "primary",
                size: "large",
                onClick: $setup.openReported,
                block: "",
                disabled: $setup.formstate.isReport === 1
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 隐患上报 ")
                ]),
                _: 1
                /* STABLE */
              }, 8, ["disabled"])) : vue.createCommentVNode("v-if", true),
              vue.createVNode(_component_wd_button, {
                type: "primary",
                size: "large",
                onClick: $setup.submit,
                block: "",
                style: { "margin-top": "1rem" }
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("提交")
                ]),
                _: 1
                /* STABLE */
              })
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          _: 1
          /* STABLE */
        }, 8, ["model"])
      ]),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesRiskInspectionDetailsRiskInspectionDetails = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "E:/开发/app/security-environment/pages/riskInspectionDetails/riskInspectionDetails.vue"]]);
  const _sfc_main$4 = {
    __name: "riskReporting",
    setup(__props, { expose: __expose }) {
      __expose();
      const formstate = vue.ref({
        discoverTime: "",
        discoverer: []
      });
      const form = vue.ref();
      const taskId = vue.ref(0);
      function submit() {
        form.value.validate().then(({
          valid,
          errors
        }) => {
          if (valid) {
            const params = {
              ...formstate.value,
              executionId: taskId.value
            };
            params.discoverTime = formatDate(params.discoverTime);
            params.discoverer = params.discoverer[1];
            fileList.value.forEach((item) => {
              params.photoList = [];
              if (item.response) {
                const urlMessage = JSON.parse(item.response);
                params.photoList.push(urlMessage.data);
              } else {
                params.photoList.push(item.url);
              }
            });
            const url = `/${config.mesMain}/risk/report/insert`;
            request({
              url,
              data: params,
              needAuth: true,
              method: "POST"
            }).then((data) => {
              showSuccess({
                msg: "上报成功!"
              });
              uni.navigateBack({
                delta: 1
              });
            });
          }
        }).catch((error) => {
          formatAppLog("log", "at pages/riskReporting/riskReporting.vue:145", error, "error");
        });
      }
      const columns = vue.ref([
        [
          { label: "请选择", value: -1 }
        ],
        [
          { label: "请选择", value: -1 }
        ]
      ]);
      function onChangeDistrict(pickerView, value, columnIndex, resolve) {
        const item = value[columnIndex];
        if (columnIndex === 0) {
          listSysPerson(item.value, (arr) => {
            pickerView.setColumnData(1, arr);
          });
        }
      }
      function displayFormat() {
      }
      function queryTree() {
        request({
          url: `/${config.mesUser}/sys/organization/listTree`,
          // 拼接URL: /mes-main/api/data
          data: {},
          needAuth: true,
          method: "GET"
        }).then((data) => {
          const arr = flattenTree([data]);
          if (arr.length > 0) {
            columns.value[0] = [
              { label: "请选择", value: -1 }
            ];
            arr.forEach((item) => {
              columns.value[0].push({
                label: item.orgFullName,
                value: item.orgCode
              });
            });
          }
        });
      }
      function listSysPerson(orgCode, callback) {
        request({
          url: `/${config.mesUser}/sys/person/listSysPerson`,
          // 拼接URL: /mes-main/api/data
          data: {
            orgCode,
            pageNum: 1,
            // 当前页码。
            pageSize: 999
            // 每页显示的数据条数。
          },
          needAuth: true,
          method: "GET"
        }).then(({ list }) => {
          const arr = [
            { label: "请选择", value: -1 }
          ];
          if (list.length > 0) {
            list.forEach((item) => {
              arr.push({
                label: item.perName,
                value: item.perName
              });
            });
          }
          callback(arr);
        });
      }
      const hiddenDangerType = vue.ref([
        {
          label: "人",
          value: "人"
        },
        {
          label: "物",
          value: "物"
        },
        {
          label: "环",
          value: "环"
        },
        {
          label: "管",
          value: "管"
        }
      ]);
      const hazardLevel = vue.ref([
        {
          label: "一般隐患",
          value: 1
        },
        {
          label: "严重隐患",
          value: 2
        },
        {
          label: "较大隐患",
          value: 3
        },
        {
          label: "重大隐患",
          value: 4
        }
      ]);
      function scan() {
        uni.scanCode({
          success: function(res) {
            formatAppLog("log", "at pages/riskReporting/riskReporting.vue:277", "条码类型：" + res.scanType);
            formatAppLog("log", "at pages/riskReporting/riskReporting.vue:278", "条码内容：" + res.result);
            formstate.value.location = res.result;
          }
        });
      }
      const fileList = vue.ref([]);
      const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`;
      vue.onMounted(() => {
        formstate.value.discoverTime = (/* @__PURE__ */ new Date()).getTime();
        queryTree();
        const instance = vue.getCurrentInstance().proxy;
        const eventChannel = instance.getOpenerEventChannel();
        eventChannel.on("acceptDataFromOpenerPage", function(data) {
          taskId.value = data.id;
        });
      });
      const __returned__ = { formstate, form, taskId, submit, columns, onChangeDistrict, displayFormat, queryTree, listSysPerson, hiddenDangerType, hazardLevel, scan, fileList, action, TabBarVue, onMounted: vue.onMounted, ref: vue.ref, getCurrentInstance: vue.getCurrentInstance, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get flattenTree() {
        return flattenTree;
      }, get formatDate() {
        return formatDate;
      }, get showSuccess() {
        return showSuccess;
      }, get config() {
        return config;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_picker = resolveEasycom(vue.resolveDynamicComponent("wd-picker"), __easycom_0$3);
    const _component_wd_datetime_picker = resolveEasycom(vue.resolveDynamicComponent("wd-datetime-picker"), __easycom_1$2);
    const _component_wd_input = resolveEasycom(vue.resolveDynamicComponent("wd-input"), __easycom_2$1);
    const _component_wd_textarea = resolveEasycom(vue.resolveDynamicComponent("wd-textarea"), __easycom_2);
    const _component_wd_upload = resolveEasycom(vue.resolveDynamicComponent("wd-upload"), __easycom_4);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_6);
    const _component_wd_form = resolveEasycom(vue.resolveDynamicComponent("wd-form"), __easycom_7);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" form表单 "),
      vue.createElementVNode("view", null, [
        vue.createVNode(_component_wd_form, {
          ref: "form",
          model: $setup.formstate,
          border: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              prop: "discoverer",
              columns: $setup.columns,
              label: "上报人员",
              modelValue: $setup.formstate.discoverer,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formstate.discoverer = $event),
              "column-change": $setup.onChangeDistrict,
              placeholder: "请选择上报人员",
              rules: [{ required: true, message: "请选择上报人员" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_datetime_picker, {
              label: "上报时间",
              "align-right": "",
              modelValue: $setup.formstate.discoverTime,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formstate.discoverTime = $event),
              prop: "discoverTime",
              rules: [{ required: true, message: "请填写上报时间" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              columns: $setup.hiddenDangerType,
              label: "风险类型",
              modelValue: $setup.formstate.riskType,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formstate.riskType = $event),
              prop: "riskType",
              rules: [{ required: true, message: "请选择风险类型" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.location,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formstate.location = $event),
              label: "发现区域",
              "suffix-icon": "scan",
              readonly: "",
              onClick: _cache[4] || (_cache[4] = ($event) => $setup.scan()),
              prop: "location",
              rules: [{ required: true, message: "请选择发现区域" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_textarea, {
              label: "问题描述",
              modelValue: $setup.formstate.description,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.formstate.description = $event),
              placeholder: "请填写详细的问题描述",
              maxlength: 300,
              clearable: "",
              "show-word-limit": "",
              prop: "description",
              rules: [{ required: true, message: "请填写详细的问题描述" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_input, {
              "align-right": "",
              modelValue: $setup.formstate.hazardSource,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.formstate.hazardSource = $event),
              label: "隐患来源",
              prop: "hazardSource",
              rules: [{ required: true, message: "请输入隐患来源" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              columns: $setup.hazardLevel,
              label: "隐患等级",
              modelValue: $setup.formstate.level,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.formstate.level = $event),
              prop: "level",
              rules: [{ required: true, message: "请选择隐患等级" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_cell, {
              title: "现场图片上传",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_upload, {
                  "file-list": $setup.fileList,
                  "onUpdate:fileList": _cache[8] || (_cache[8] = ($event) => $setup.fileList = $event),
                  "image-mode": "aspectFill",
                  action: $setup.action
                }, null, 8, ["file-list"])
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createElementVNode("view", { class: "footer" }, [
              vue.createVNode(_component_wd_button, {
                type: "primary",
                size: "large",
                onClick: $setup.submit,
                block: ""
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("提交")
                ]),
                _: 1
                /* STABLE */
              })
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["model"])
      ]),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesRiskReportingRiskReporting = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "E:/开发/app/security-environment/pages/riskReporting/riskReporting.vue"]]);
  const imgProps = {
    ...baseProps,
    customImage: makeStringProp(""),
    /**
     * 图片链接
     */
    src: String,
    /**
     * 预览图片链接
     */
    previewSrc: String,
    /**
     * 是否显示为圆形
     */
    round: makeBooleanProp(false),
    /**
     * 填充模式：'top left' / 'top right' / 'bottom left' / 'bottom right' / 'right' / 'left' / 'center' / 'bottom' / 'top' / 'heightFix' / 'widthFix' / 'aspectFill' / 'aspectFit' / 'scaleToFill'
     */
    mode: makeStringProp("scaleToFill"),
    /**
     * 是否懒加载
     */
    lazyLoad: makeBooleanProp(false),
    /**
     * 宽度，默认单位为px
     */
    width: numericProp,
    /**
     * 高度，默认单位为px
     */
    height: numericProp,
    /**
     * 圆角大小，默认单位为px
     */
    radius: numericProp,
    /**
     * 是否允许预览
     */
    enablePreview: makeBooleanProp(false),
    /**
     * 开启长按图片显示识别小程序码菜单，仅在微信小程序平台有效
     */
    showMenuByLongpress: makeBooleanProp(false)
  };
  const __default__ = {
    name: "wd-img",
    options: {
      virtualHost: true,
      addGlobalClass: true,
      styleIsolation: "shared"
    }
  };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    ...__default__,
    props: imgProps,
    emits: ["error", "click", "load"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const rootStyle = vue.computed(() => {
        const style = {};
        if (isDef(props.height)) {
          style["height"] = addUnit(props.height);
        }
        if (isDef(props.width)) {
          style["width"] = addUnit(props.width);
        }
        if (isDef(props.radius)) {
          style["border-radius"] = addUnit(props.radius);
          style["overflow"] = "hidden";
        }
        return `${objToStyle(style)}${props.customStyle}`;
      });
      const rootClass = vue.computed(() => {
        return `wd-img  ${props.round ? "is-round" : ""} ${props.customClass}`;
      });
      const status = vue.ref("loading");
      function handleError(event) {
        status.value = "error";
        emit("error", event);
      }
      function handleClick(event) {
        if (props.enablePreview && props.src && status.value == "success") {
          uni.previewImage({
            urls: [props.previewSrc || props.src]
          });
        }
        emit("click", event);
      }
      function handleLoad(event) {
        status.value = "success";
        emit("load", event);
      }
      const __returned__ = { props, emit, rootStyle, rootClass, status, handleError, handleClick, handleLoad };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass($setup.rootClass),
        onClick: $setup.handleClick,
        style: vue.normalizeStyle($setup.rootStyle)
      },
      [
        vue.createElementVNode("image", {
          class: vue.normalizeClass(`wd-img__image ${_ctx.customImage}`),
          style: vue.normalizeStyle($setup.status !== "success" ? "width: 0;height: 0;" : ""),
          src: _ctx.src,
          mode: _ctx.mode,
          "show-menu-by-longpress": _ctx.showMenuByLongpress,
          "lazy-load": _ctx.lazyLoad,
          onLoad: $setup.handleLoad,
          onError: $setup.handleError
        }, null, 46, ["src", "mode", "show-menu-by-longpress", "lazy-load"]),
        $setup.status === "loading" ? vue.renderSlot(_ctx.$slots, "loading", { key: 0 }, void 0, true) : vue.createCommentVNode("v-if", true),
        $setup.status === "error" ? vue.renderSlot(_ctx.$slots, "error", { key: 1 }, void 0, true) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-cb0c5dbc"], ["__file", "E:/开发/app/security-environment/uni_modules/wot-design-uni/components/wd-img/wd-img.vue"]]);
  const _sfc_main$2 = {
    __name: "my",
    setup(__props, { expose: __expose }) {
      __expose();
      const message = useMessage();
      const user = vue.ref({});
      function logout() {
        message.confirm({
          title: "是否确认退出登录?"
        }).then(() => {
          removeToken();
          clearUserInfo();
          uni.redirectTo({
            url: "/pages/login/login"
          });
        }).catch(() => {
          formatAppLog("log", "at pages/my/my.vue:56", "点击了取消按钮");
        });
      }
      vue.onMounted(() => {
        user.value = getUserInfo();
      });
      const __returned__ = { message, user, logout, TabBarVue, onMounted: vue.onMounted, ref: vue.ref, get request() {
        return request;
      }, get getUserInfo() {
        return getUserInfo;
      }, get clearUserInfo() {
        return clearUserInfo;
      }, get removeToken() {
        return removeToken;
      }, get config() {
        return config;
      }, get useMessage() {
        return useMessage;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_img = resolveEasycom(vue.resolveDynamicComponent("wd-img"), __easycom_0);
    const _component_wd_icon = resolveEasycom(vue.resolveDynamicComponent("wd-icon"), __easycom_1$3);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_cell_group = resolveEasycom(vue.resolveDynamicComponent("wd-cell-group"), __easycom_3$1);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", null, [
        vue.createElementVNode("view", { style: { "display": "flex", "align-items": "center", "flex-direction": "column" } }, [
          vue.createVNode(_component_wd_img, {
            width: 100,
            height: 100,
            round: "",
            src: "data:image/webp;base64,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"
          }),
          vue.createTextVNode(
            " " + vue.toDisplayString($setup.user.userName),
            1
            /* TEXT */
          )
        ]),
        vue.createVNode(_component_wd_cell_group, null, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_cell, { title: "退出登录" }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_icon, {
                  name: "arrow-right",
                  size: "22px",
                  style: { "line-height": "2em" },
                  center: "",
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.logout())
                })
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      vue.createVNode($setup["TabBarVue"], { tabbar: "my" }),
      vue.createVNode(_component_wd_message_box)
    ]);
  }
  const PagesMyMy = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "E:/开发/app/security-environment/pages/my/my.vue"]]);
  const _sfc_main$1 = {
    __name: "accidentReport",
    setup(__props, { expose: __expose }) {
      __expose();
      const formstate = vue.ref({
        discoverTime: "",
        discoverer: []
      });
      const form = vue.ref();
      function submit() {
        form.value.validate().then(({
          valid,
          errors
        }) => {
          if (valid) {
            const params = {
              ...formstate.value
            };
            params.time = formatDate(params.time);
            photoList.value.forEach((item) => {
              params.fileList = [];
              if (item.response) {
                const urlMessage = JSON.parse(item.response);
                params.fileList.push(urlMessage.data);
              } else {
                params.fileList.push(item.url);
              }
            });
            const url = `/${config.mesMain}/accident/register/insert`;
            request({
              url,
              data: params,
              needAuth: true,
              method: "POST"
            }).then((data) => {
              showSuccess({
                msg: "上报成功!"
              });
              setTimeout(() => {
                uni.navigateBack({
                  delta: 1
                });
              }, 500);
            });
          }
        }).catch((error) => {
          formatAppLog("log", "at pages/accidentReport/accidentReport.vue:121", error, "error");
        });
      }
      const accidentType = vue.ref([
        {
          label: "特别重大事故",
          value: 1
        },
        {
          label: "重大事故",
          value: 2
        },
        {
          label: "较大事故",
          value: 3
        },
        {
          label: "一般事故",
          value: 4
        }
      ]);
      const columns = vue.ref([
        [{
          label: "请选择",
          value: -1
        }],
        [{
          label: "请选择",
          value: -1
        }]
      ]);
      function onChangeDistrict(pickerView, value, columnIndex, resolve) {
        const item = value[columnIndex];
        if (columnIndex === 0) {
          listSysPerson(item.value, (arr) => {
            pickerView.setColumnData(1, arr);
          });
        }
      }
      function test({
        value,
        selectedItems: [v, item]
      }) {
        formstate.value.injuredUser = item.perName;
        formstate.value.worknumber = item.workNumber;
        formstate.value.depatment = item.orgName;
        formstate.value.position = item.stationName;
      }
      function changeManager({
        value,
        selectedItems: [v, item]
      }) {
        formstate.value.manager = item.perName;
      }
      function queryTree() {
        request({
          url: `/${config.mesUser}/sys/organization/listTree`,
          // 拼接URL: /mes-main/api/data
          data: {},
          needAuth: true,
          method: "GET"
        }).then((data) => {
          const arr = flattenTree([data]);
          if (arr.length > 0) {
            columns.value[0] = [{
              label: "请选择",
              value: -1
            }];
            arr.forEach((item) => {
              columns.value[0].push({
                label: item.orgFullName,
                value: item.orgCode
              });
            });
          }
        });
      }
      function listSysPerson(orgCode, callback) {
        request({
          url: `/${config.mesUser}/sys/person/listSysPerson`,
          // 拼接URL: /mes-main/api/data
          data: {
            orgCode,
            pageNum: 1,
            // 当前页码。
            pageSize: 999
            // 每页显示的数据条数。
          },
          needAuth: true,
          method: "GET"
        }).then(({
          list
        }) => {
          const arr = [{
            label: "请选择",
            value: -1
          }];
          if (list.length > 0) {
            list.forEach((item) => {
              arr.push({
                ...item,
                label: item.perName,
                value: item.perName
              });
            });
          }
          callback(arr);
        });
      }
      const injuredPart = vue.ref([
        {
          label: "手",
          value: "手"
        },
        {
          label: "脚",
          value: "脚"
        },
        {
          label: "头",
          value: "头"
        },
        {
          label: "眼睛",
          value: "眼睛"
        },
        {
          label: "面部",
          value: "面部"
        },
        {
          label: "腰",
          value: "腰"
        },
        {
          label: "腿",
          value: "腿"
        },
        {
          label: "胳膊",
          value: "胳膊"
        },
        {
          label: "躯干",
          value: "躯干"
        },
        {
          label: "其他",
          value: "其他"
        }
      ]);
      const injuryTypes = vue.ref([
        {
          label: "机械伤害",
          value: "机械伤害"
        },
        {
          label: "化学伤害",
          value: "化学伤害"
        },
        {
          label: "物理伤害",
          value: "物理伤害"
        },
        {
          label: "生物伤害",
          value: "生物伤害"
        },
        {
          label: "电气伤害",
          value: "电气伤害"
        },
        {
          label: "运动伤害",
          value: "运动伤害"
        },
        {
          label: "热伤害及温度伤害",
          value: "热伤害及温度伤害"
        }
      ]);
      const hazardLevel = vue.ref([
        {
          label: "一级",
          value: "一级"
        },
        {
          label: "二级",
          value: "二级"
        },
        {
          label: "三级",
          value: "三级"
        }
      ]);
      function scan() {
        uni.scanCode({
          success: function(res) {
            formatAppLog("log", "at pages/accidentReport/accidentReport.vue:356", "条码类型：" + res.scanType);
            formatAppLog("log", "at pages/accidentReport/accidentReport.vue:357", "条码内容：" + res.result);
            formstate.value.type1 = res.result;
          }
        });
      }
      const photoList = vue.ref([]);
      const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`;
      vue.onMounted(() => {
        formstate.value.time = (/* @__PURE__ */ new Date()).getTime();
        queryTree();
      });
      const __returned__ = { formstate, form, submit, accidentType, columns, onChangeDistrict, test, changeManager, queryTree, listSysPerson, injuredPart, injuryTypes, hazardLevel, scan, photoList, action, TabBarVue, onMounted: vue.onMounted, ref: vue.ref, getCurrentInstance: vue.getCurrentInstance, get request() {
        return request;
      }, get setToken() {
        return setToken;
      }, get setUserInfo() {
        return setUserInfo;
      }, get flattenTree() {
        return flattenTree;
      }, get formatDate() {
        return formatDate;
      }, get showSuccess() {
        return showSuccess;
      }, get config() {
        return config;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_wd_picker = resolveEasycom(vue.resolveDynamicComponent("wd-picker"), __easycom_0$3);
    const _component_wd_datetime_picker = resolveEasycom(vue.resolveDynamicComponent("wd-datetime-picker"), __easycom_1$2);
    const _component_wd_textarea = resolveEasycom(vue.resolveDynamicComponent("wd-textarea"), __easycom_2);
    const _component_wd_select_picker = resolveEasycom(vue.resolveDynamicComponent("wd-select-picker"), __easycom_3);
    const _component_wd_upload = resolveEasycom(vue.resolveDynamicComponent("wd-upload"), __easycom_4);
    const _component_wd_cell = resolveEasycom(vue.resolveDynamicComponent("wd-cell"), __easycom_5);
    const _component_wd_button = resolveEasycom(vue.resolveDynamicComponent("wd-button"), __easycom_6);
    const _component_wd_form = resolveEasycom(vue.resolveDynamicComponent("wd-form"), __easycom_7);
    const _component_wd_message_box = resolveEasycom(vue.resolveDynamicComponent("wd-message-box"), __easycom_8);
    const _component_wd_toast = resolveEasycom(vue.resolveDynamicComponent("wd-toast"), __easycom_9$1);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" form表单 "),
      vue.createElementVNode("view", null, [
        vue.createVNode(_component_wd_form, {
          ref: "form",
          model: $setup.formstate,
          border: ""
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              prop: "discoverer",
              columns: $setup.columns,
              label: "上报人员",
              modelValue: $setup.formstate.discoverer,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.formstate.discoverer = $event),
              "column-change": $setup.onChangeDistrict,
              onConfirm: $setup.test,
              placeholder: "请选择上报人员",
              rules: [{ required: true, message: "请选择上报人员" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_datetime_picker, {
              label: "发生时间",
              "align-right": "",
              modelValue: $setup.formstate.time,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.formstate.time = $event),
              prop: "time",
              rules: [{ required: true, message: "请填写发生时间" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              columns: $setup.accidentType,
              label: "事故类型",
              modelValue: $setup.formstate.type,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.formstate.type = $event),
              prop: "type",
              rules: [{ required: true, message: "请选择事故类型" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_textarea, {
              label: "事件描述",
              modelValue: $setup.formstate.eventDescription,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.formstate.eventDescription = $event),
              placeholder: "请填写详细的事件描述",
              maxlength: 300,
              clearable: "",
              "show-word-limit": "",
              prop: "eventDescription",
              rules: [{ required: true, message: "请填写详细的事件描述" }]
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_select_picker, {
              "align-right": "",
              columns: $setup.injuredPart,
              label: "受伤部位",
              modelValue: $setup.formstate.injuredPartList,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.formstate.injuredPartList = $event),
              prop: "injuredPartList",
              rules: [{ required: true, message: "请选择受伤部位" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_textarea, {
              label: "受伤情况描述",
              modelValue: $setup.formstate.injuredDescription,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.formstate.injuredDescription = $event),
              placeholder: "",
              maxlength: 300,
              clearable: "",
              "show-word-limit": ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_select_picker, {
              "align-right": "",
              columns: $setup.injuryTypes,
              label: "伤害类型",
              modelValue: $setup.formstate.injuredTypeList,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.formstate.injuredTypeList = $event)
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_cell, {
              title: "附件上传",
              top: ""
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_wd_upload, {
                  "file-list": $setup.photoList,
                  "onUpdate:fileList": _cache[7] || (_cache[7] = ($event) => $setup.photoList = $event),
                  "image-mode": "aspectFill",
                  action: $setup.action
                }, null, 8, ["file-list"])
              ]),
              _: 1
              /* STABLE */
            }),
            vue.createVNode(_component_wd_picker, {
              "align-right": "",
              prop: "managerItem",
              columns: $setup.columns,
              label: "责任部门主管",
              modelValue: $setup.formstate.managerItem,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.formstate.managerItem = $event),
              "column-change": $setup.onChangeDistrict,
              onConfirm: $setup.changeManager,
              placeholder: "请选择责任部门主管",
              rules: [{ required: true, message: "请选择责任部门主管" }]
            }, null, 8, ["columns", "modelValue"]),
            vue.createVNode(_component_wd_textarea, {
              label: "事故原因",
              modelValue: $setup.formstate.reason,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.formstate.reason = $event),
              placeholder: "",
              maxlength: 200,
              clearable: "",
              "show-word-limit": ""
            }, null, 8, ["modelValue"]),
            vue.createVNode(_component_wd_textarea, {
              label: "整改措施",
              modelValue: $setup.formstate.measures,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.formstate.measures = $event),
              placeholder: "",
              maxlength: 200,
              clearable: "",
              "show-word-limit": ""
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("view", { class: "footer" }, [
              vue.createVNode(_component_wd_button, {
                type: "primary",
                size: "large",
                onClick: $setup.submit,
                block: "",
                class: "footer_button"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("提交")
                ]),
                _: 1
                /* STABLE */
              })
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["model"])
      ]),
      vue.createVNode(_component_wd_message_box),
      vue.createVNode(_component_wd_toast)
    ]);
  }
  const PagesAccidentReportAccidentReport = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-32e28102"], ["__file", "E:/开发/app/security-environment/pages/accidentReport/accidentReport.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/hazardReporting/hazardReporting", PagesHazardReportingHazardReporting);
  __definePage("pages/hotWork/hotWork", PagesHotWorkHotWork);
  __definePage("pages/onSiteInspection/onSiteInspection", PagesOnSiteInspectionOnSiteInspection);
  __definePage("pages/inspectionDetails/inspectionDetails", PagesInspectionDetailsInspectionDetails);
  __definePage("pages/inspectionTask/inspectionTask", PagesInspectionTaskInspectionTask);
  __definePage("pages/report/report", PagesReportReport);
  __definePage("pages/riskInspection/riskInspection", PagesRiskInspectionRiskInspection);
  __definePage("pages/riskInspectionDetails/riskInspectionDetails", PagesRiskInspectionDetailsRiskInspectionDetails);
  __definePage("pages/riskReporting/riskReporting", PagesRiskReportingRiskReporting);
  __definePage("pages/my/my", PagesMyMy);
  __definePage("pages/accidentReport/accidentReport", PagesAccidentReportAccidentReport);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/开发/app/security-environment/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
