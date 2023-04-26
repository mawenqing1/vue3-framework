import { isObj } from "@vue/shared";
import { track, trigger } from "./effect";
import { reactive } from "./reactive";

export const enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive'
}

export const baseHandler = {
    get(target, key, receiver) {
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        track(target, key)
        let res = Reflect.get(target, key, receiver);
        if(isObj(res)) {
            return reactive(res)
        }
        return res
    },
    set(target, key, value, receiver) {
        let oldValue = target[key];
        if(oldValue !== value) {
           let result = Reflect.set(target, key, value, receiver);
           trigger(target, key, value);
           return result
        }
    }
}