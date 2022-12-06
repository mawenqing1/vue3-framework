var VueReactivity = (() => {
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

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/shared/src/index.ts
  var isObj = (val) => {
    return typeof val === "object" && val !== null;
  };

  // packages/reactivity/src/reactive.ts
  function reactive(target) {
    if (!isObj(target)) {
      return target;
    }
    const proxy = new Proxy(target, {
      get(target2, key, receiver) {
        console.log("get");
        return target2[key];
      },
      set(target2, key, value, receiver) {
        console.log("set");
        target2[key] = value;
        return true;
      }
    });
    return proxy;
  }

  // packages/reactivity/src/effect.ts
  function effect() {
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
