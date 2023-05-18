import { isObj } from "@vue/shared";
import { reactive } from "./reactive";
import { trackEffects, triggerEffects } from "./effect";

export function ref(value) {
    return new RefImpl(value)
}

export function toReactive(value) {
    return isObj(value) ? reactive(value) : value
}

class RefImpl {
    private _value;
    private dep
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