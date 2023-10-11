import { patchClass } from "./patch-prop/patchClass"
import { patchStyle } from "./patch-prop/patchStyle"
import { patchEvent } from "./patch-prop/patchEvent"
import { patchAttr } from "./patch-prop/patchAttr"

export const patchProp = (el, key, preValue, nextValue) => {
    if(key === 'class') {
        patchClass(el, nextValue)
    } else if(key === 'style') {
        patchStyle(el, preValue, nextValue)
    } else if(/on[^a-z]/.test(key)) {
        patchEvent(el, key, nextValue)
    } else {
        patchAttr(el, key, nextValue)
    }
}