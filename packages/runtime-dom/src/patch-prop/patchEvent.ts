function createInvoker(fn) {
    const invoker = () => {
        invoker.value()
    }
    invoker.value = fn
    return invoker
}

export function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei || (el._vei = {});
    const exitingInvoker = invokers[eventName];
    if(exitingInvoker && nextValue) {
        exitingInvoker.value = nextValue;
    } else {
        const eName = eventName.slice(2).toLowerCase();
        if(nextValue) {
            const invoker = createInvoker(nextValue);
            invokers[eventName] = invoker;
            el.addEventListener(eName, invoker);
        } else if(exitingInvoker) {
            el.removeEventListener(eName, exitingInvoker);
            invokers[eventName] = null;
        }
    }
}