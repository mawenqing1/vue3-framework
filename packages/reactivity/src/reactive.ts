import { isObj } from "@vue/shared";

export function reactive(target) {
    if(!isObj(target)) {
        return target
    }

    const proxy = new Proxy(target, {
        get(target, key, receiver) {
            console.log('get');
            
            return target[key]
        },
        set(target, key, value, receiver) {
            console.log('set');
            
            target[key] = value;
            return true
        }
    });
    return proxy;
}