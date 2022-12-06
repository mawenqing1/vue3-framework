import { isObj } from "@vue/shared";
import {baseHandler, ReactiveFlags} from "./baseHandler";

const reactiveMap = new WeakMap();

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

    const proxy = new Proxy(target, baseHandler);
    reactiveMap.set(target, proxy)
    return proxy;
}