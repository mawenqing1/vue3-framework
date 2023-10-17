import { isNumber, isString } from "@vue/shared";
import { ShapeFlags, Text, createVNode, isSameVNode } from "./createVNode";

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

    function patchProps(oldProps, newProps, el) {
        if(oldProps == null) oldProps = {}
        if(newProps == null) newProps = {}
        for(let key in newProps) {
            let prev = oldProps[key];
            let next = newProps[key];
            if(prev !== next) {
                hostPatchProp(el, key, prev, next)
            }
        }

        for(let key in oldProps) {
            if(!newProps.hasOwnProperty(key)) {
                hostPatchProp(el, key, oldProps[key], null)
            }
        }
    }

    function mountElement(vnode, container, anchor) {
        let { type, props, children, shapeFlag } = vnode;
        let el = vnode.el = hostCreateElement(type);

        if(props) {
            patchProps(null, props, el)
        }

        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        }
        if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el);
        }

        hostInsert(el, container, anchor);
    }

    function processText(n1, n2, container) {
        if(n1 === null) {
            hostInsert(n2.el = hostCreateTextNode(n2.children, container), container);
        }
    }

    function unmountChildren(children) {
        children.forEach(el => {
            unmount(el)
        })
    }

    function patchKeyedChildren(c1, c2, el) {
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;

        while(i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if(isSameVNode(n1, n2)) {
                patch(n1, n2, el)
            } else {
                break
            }
            i++;
        }

        while(i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if(isSameVNode(n1, n2)) {
                patch(n1, n2, el)
            } else {
                break
            }
            e1--;
            e2--;
        }

        if(i > e1) {
            if(i <= e2) { 
                while(i <= e2) {
                    const nextPos = e2 + 1;
                    let anchor = c2.length <= nextPos ? null : c2[nextPos].el;
                    patch(null, c2[i], el, anchor)
                    i++
                }
            }
        } else if(i > e2) {
            if(i <= e1) {
                while(i <= e1) {
                    unmount(c1[i])
                    i++
                }
            }
        }

        let s1 = i;
        let s2 = i;
        const keyToNewIndexMap = new Map();
        let toBePatched = e2 - s2 + 1;

        for(let i = s2; i <= e2; i++) {
            keyToNewIndexMap.set(c2[i].key, i);
        }
        for(let i = s1; i <= e1; i++) {
            const oldVNode = c1[i];
            let newIndex = keyToNewIndexMap.get(oldVNode.key);
            if(newIndex == null) {
                unmount(oldVNode)
            } else {
                patch(oldVNode, c2[newIndex], el)
            }
        }

        for(let i = toBePatched - 1; i >= 0; i++) {
            const currentIndex = s2 + i;
            const child = c2[currentIndex]
            const anchor = currentIndex + 1 < c2.length ? c2[currentIndex + 1].el : null;
            if(child.el == null) {
                patch(null, child, el, anchor)
            } else {
                hostInsert(child.el, el, anchor)
            }
        }
    }

    function patchChildren(n1, n2, el) {
        let c1 = n1.children;
        let c2 = n2.children;
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;

        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                unmountChildren(c1);
            }
            if(c1 !== c2) {
                hostSetElementText(el, c2)
            }
        } else {
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    patchKeyedChildren(c1, c2, el)
                } else {
                    unmountChildren(c1);
                }
            } else {
                if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    hostSetElementText(el, '')
                }
                if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    mountChildren(c2, el)
                }
            }
        }
    }

    function patchElement(n1, n2) {
        let el = n2.el = n1.el;
        let oldProps = n1.props;
        let newProps = n2.props;
        patchProps(oldProps, newProps, el)
        patchChildren(n1, n2, el);
    }

    function processElement(n1, n2, container, anchor) {
        if(n1 == null) {
            mountElement(n2, container, anchor);
        } else {
            patchElement(n1, n2);
        }
    }

    function unmount(n1) {
        hostRemove(n1.el);
    }

    function patch(n1, n2, container, anchor = null) {

        if(n1 && !isSameVNode(n1, n2)) {
            unmount(n1);
            n1 = null;
        }

        const { type, shapeFlag } = n2;

        switch(type) {
            case Text:
                processText(n1, n2, container);
                break;
            default: 
                if(shapeFlag & ShapeFlags.ELEMENT) {
                    processElement(n1, n2, container, anchor);
                }
        }
    }

    function render(vnode, container) {
        
        if(vnode == null) {
            if(container._vnode) {
                unmount(container._vnode);
            }
        } else {
            patch(container._vnode || null, vnode, container)
        }

        container._vnode = vnode;
        
    }

    return {
        render
    }
}