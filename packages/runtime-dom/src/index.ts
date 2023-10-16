import { createRenderer } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";

const renderOptions = {patchProp, ...nodeOps}

export function render(vnode, container) {
    let { render } = createRenderer(renderOptions)

    return render(vnode, container)
}

export * from '@vue/runtime-core'