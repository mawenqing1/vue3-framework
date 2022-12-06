import { isObj } from "@vue/shared";

const reactiveMap = new WeakMap();
const enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive'
}

export function reactive(target) {
    if(!isObj(target)) {
        return target
    }
    if(target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }
    const existing = reactiveMap.get(target);
    if(existing) {
        return existing
    }

    const proxy = new Proxy(target, {
        get(target, key, receiver) {
            console.log('get');
            if(key === ReactiveFlags.IS_REACTIVE) {
                return true
            }
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            console.log('set');
            return Reflect.set(target, key, value, receiver)
        }
    });
    reactiveMap.set(target, proxy)
    return proxy;
}