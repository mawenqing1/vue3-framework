export let activeEffect = undefined;

export class ReactiveEffect {
    public active = true;
    public parent = null;
    public fn
    constructor(fn) {
        this.fn = fn;
    }
    run() {
        if(!this.active) {
            this.fn()
        } else {
            try {
                this.parent = activeEffect;
                activeEffect = this;
            } finally {
                activeEffect = this.parent;
                this.parent = null;
            }
        }
    }
};

export function track(target, key) {
 
}

export function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
};