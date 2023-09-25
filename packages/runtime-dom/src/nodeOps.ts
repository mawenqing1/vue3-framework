export const nodeOps = {
    createElement(tagName) {
        return document.createElement(tagName);
    },
    createTextNode(text) {
        return document.createTextNode(text);
    },
    insert(element, parent, anchor = null) {
        parent.insertBefore(element, anchor);
    },
    remove(child) {
        const parent = child.parentNode;
        if (parent) {
            parent.removeChild(child);
        }
    },
    querySelector(selectors) {
        return document.querySelector(selectors);
    },
    parentNode(node) {
        return node.parentNode;
    },
    //获取兄弟节点
    nextSibling(node) {
        return node.nextSibling;
    },
    setText(element, text) {
        element.nodeValue = text;
    },
    setElementText(element, text) {
        element.textContent = text;
    }
}