import { isObj } from "@vue/shared";
import { reactive } from "./reactive";
import { trackEffects, triggerEffects } from "./effect";

export function ref(value) {
    return new RefImpl(value)
}

export function toRef(object, key) {
    return new ObjectRefImpl(object, key)
}

export function toRefs(object) {
    let result = {};
    for(let key in object) {
        result[key] = toRef(object, key)
    };
    return result
}

export function proxyRefs(object) {
    return new Proxy(object, {
        get(target, key, receiver) {
            let result = Reflect.get(target, key, receiver);
            return result.__v_isRef ? result.value : result
        },
        set(target,key,value,receiver) {
            if(target[key].__v_isRef) {
                target[key].value = value;
                return true
            }
            return Reflect.set(target,key,value,receiver)
        }
    })
}

export function toReactive(value) {
    return isObj(value) ? reactive(value) : value
}

class RefImpl {
    private _value;
    private dep
    private __v_isRef = true
    constructor(public rawValue) {
        this._value = toReactive(rawValue)
    }

    get value() {
        trackEffects(this.dep || (this.dep = new Set))
        return this._value
    }

    set value(newValue) {
        if(newValue != this.rawValue) {
            this._value = toReactive(newValue)
            this.rawValue = newValue;
            triggerEffects(this.dep)
        }
    }
}

class ObjectRefImpl {
    private __v_isRef = true
    constructor(public object, public key) {}
    get value() {
        return this.object[this.key]
    }
    set value(newValue) {
        this.object[this.key] = newValue;
    }
}