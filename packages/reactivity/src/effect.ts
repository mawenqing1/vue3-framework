export let activeEffect = undefined;

export class ReactiveEffect {
    public active = true;
    public parent = null;
    public deps = [];
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
                return this.fn()
            } finally {
                activeEffect = this.parent;
                this.parent = null;
            }
        }
    }
};

//map {object: {name:[effect, effect], age:[effect,effect]}}
const targetMap = new WeakMap();
export function trigger(target, key, value) {
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        return;
    }
    const effects = depsMap.get(key);
    effects && effects.forEach(effect => { 
        if(effect !== activeEffect) {
            effect.run();
        }
    });
};

export function track(target, key) {
    if(activeEffect) {
        let depsMap = targetMap.get(target);
        if(!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let deps = depsMap.get(key);
        if(!deps) {
            depsMap.set(key, (deps = new Set()));
        }
        let shouldTrack = !deps.has(activeEffect);
        if(shouldTrack) {
            deps.add(activeEffect);
            activeEffect.deps.push(deps);
        }
    }
    console.log(targetMap);
    
}

export function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
};