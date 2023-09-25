import { patchClass } from "./patch-prop/patchClass"
import { patchStyle } from "./patch-prop/patchStyle"

function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei || (el._vei = {})
}

export const patchProp = (el, key, preValue, nextValue) => {
    if(key === 'class') {
        patchClass(el, nextValue)
    }
    if(key === 'style') {
        patchStyle(el, preValue, nextValue)
    }
    if(/on[^a-z]/.test(key)) {
        patchEvent(el, key, nextValue)
    }
}