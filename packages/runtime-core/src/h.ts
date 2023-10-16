import { isArray, isObj } from "@vue/shared";
import { isVNode, createVNode } from "./createVNode";

export function h(type, propsOrChildren, children) {
    const l = arguments.length;

    if(l === 2) {
        if(isObj(propsOrChildren) && !isArray(propsOrChildren)) {
            if(isVNode(propsOrChildren)) {
                return createVNode(type, null, [propsOrChildren])
            }
            return createVNode(type, propsOrChildren)
        } else {
            return createVNode(type, null, propsOrChildren)
        }

    } else {
        if(l === 3 && isVNode(children)) {
            children = [children]
        } else if(l > 3) {
            children = Array.prototype.slice.call(arguments, 2)
        }
        return createVNode(type, propsOrChildren, children)
    }
}