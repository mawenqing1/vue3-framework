import { ReactiveEffect } from "./effect";
import { isReactive } from "./baseHandler";
import { isFunction, isObj } from "@vue/shared";

function traversal(value, set = new Set()) {
    if(!isObj(value)) {
        return value
    }
    if(set.has(value)) {
        return value
    }
    set.add(value);
    for(let key in value) {
        traversal(value[key], set)
    }
    return value
}

export  function watch(source, cb) {
    let get;
    if(isReactive(source)) {
        get = () => traversal(source);
    } else if(isFunction(source)) {
        get = source;
    };
    let oldValue;
    let cleanup;
    const onCleanup = (fn) => {
        cleanup = fn
    }
    const job = () => {
        cleanup && cleanup();
        let newValue = effect.run();
        cb(newValue, oldValue, onCleanup);
        oldValue = newValue;
    }
    const effect = new ReactiveEffect(get, job);
    oldValue = effect.run();
}