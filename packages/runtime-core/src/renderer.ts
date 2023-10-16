import { isNumber, isString } from "@vue/shared";
import { ShapeFlags, Text, createVNode } from "./createVNode";

export function createRenderer(options: any) {

    let {
        createElement: hostCreateElement,
        createTextNode: hostCreateTextNode,
        insert: hostInsert,
        remove: hostRemove,
        querySelector: hostQuerySelector,
        parentNode: hostParentNode,
        //获取兄弟节点
        nextSibling: hostNextSibling,
        setText: hostSetText,
        setElementText: hostSetElementText,
        patchProp: hostPatchProp,
    } = options;

    function normalize(children, i) {
        if(isNumber(children[i]) || isString(children[i])) {
            children[i] = createVNode(Text, null, children[i])
        }
        return children[i]
    }

    function mountChildren(children, container) {

        for(let i = 0; i < children.length; i++) {
            let child = normalize(children, i);
            patch(null, child, container)
        }
    }

    function mountElement(vnode, container) {
        let { type, props, children, shapeFlag } = vnode;
        let el = vnode.el = hostCreateElement(type);
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        }
        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el);
        }

        hostInsert(el, container);
    }

    function processText(n1, n2, container) {
        if(n1 === null) {
            hostInsert(n2.el = hostCreateTextNode(n2.children, container));
        }
    }

    function processElement(n1, n2, container) {
        if(n1 == null) {
            mountElement(n2, container);
        }
    }

    function patch(n1, n2, container) {

        const { type, shapeFlag } = n2;

        switch(type) {
            case Text:
                processText(n1, n2, container);
                break;
            default: 
                if(shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container);
                }
        }
    }

    function render(vnode, container) {
        
        if(vnode == null) {

        } else {
            patch(container._vnode || null, vnode, container)
        }

        container._vnode = vnode;
        
    }

    return {
        render
    }
}