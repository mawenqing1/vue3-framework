import { track } from "./effect";

export const enum ReactiveFlags {
    IS_REACTIVE = '_v_isReactive'
}

export const baseHandler = {
    get(target, key, receiver) {
        console.log('get');
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        track(target, key)
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        console.log('set');
        return Reflect.set(target, key, value, receiver)
    }
}