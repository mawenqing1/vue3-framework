import { track, trigger } from "./effect";

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
        let oldValue = target[key];
        if(oldValue !== value) {
           let result = Reflect.set(target, key, value, receiver);
           trigger(target, key, value);
           return result
        }
    }
}