var __renderjsModules={};

__renderjsModules["78afd58a"] = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    default: () => stdin_default
  });
  var stdin_default = {
    mounted() {
      if (this.$ownerInstance.$el) {
        (document.querySelector("uni-app") || document.body).appendChild(this.$ownerInstance.$el);
      }
    },
    beforeDestroy() {
      if (this.$ownerInstance.$el) {
        (document.querySelector("uni-app") || document.body).removeChild(this.$ownerInstance.$el);
      }
    }
  };
  return __toCommonJS(stdin_exports);
})();
