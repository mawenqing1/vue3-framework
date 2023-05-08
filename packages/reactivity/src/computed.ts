import { isFunction } from "@vue/shared";
import { ReactiveEffect, activeEffect, trackEffects, triggerEffects } from "./effect";

export function computed(getterOrOptions) {
    let isGetter = isFunction(getterOrOptions);
    let getter;
    let setter;
    const fn = () => console.warn('computed is readonly');
    if(isGetter) {
        getter = getterOrOptions;
        setter = fn
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set || fn
    }
    
    return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
    private _value;
    private _dirty = true;
    public effect;
    public deps;
    constructor(getter, public setter) {
        this.effect = new ReactiveEffect(getter, () => {
            if(!this._dirty) {
                this._dirty = true;
                triggerEffects(this.deps)
            }
        })
    }
    get value() {
        if(activeEffect) {
            trackEffects(this.deps || (this.deps = new Set()))
        }

        if(this._dirty) {
            this._dirty = false;
            this._value = this.effect.run();
        }
        return this._value;
    }
    set value(newValues) {
        this.setter(newValues);
    }
}