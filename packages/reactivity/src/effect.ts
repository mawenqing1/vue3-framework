export let activeEffect = undefined;

function cleanEffect(effect) {
    let deps = effect.deps;
    for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect)
    }
    effect.deps.length = 0;
}

export class ReactiveEffect {
    public active = true;
    public parent = null;
    public deps = [];
    constructor(public fn, public scheduler) {
        this.fn = fn;
    }
    run() {
        if (!this.active) {
            return this.fn()
        } else {
            try {
                this.parent = activeEffect;
                activeEffect = this;
                cleanEffect(this);
                return this.fn()
            } finally {
                activeEffect = this.parent;
                this.parent = null;
            }
        }
    };
    stop() {
        if (this.active) {
            this.active = false;
            cleanEffect(this)
        }
    }
};

//map {object: {name:[effect, effect], age:[effect,effect]}}
const targetMap = new WeakMap();
export function trigger(target, key, value) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        return;
    }
    let effects = depsMap.get(key);
    if (effects) {
        effects = new Set(effects);
        effects && effects.forEach(effect => {
            if (effect !== activeEffect) {
                if(effect.scheduler) {
                    effect.scheduler()
                } else {
                    effect.run();
                }
            }
        });
    }
};

export function track(target, key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target);
        if (!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }
        let deps = depsMap.get(key);
        if (!deps) {
            depsMap.set(key, (deps = new Set()));
        }
        let shouldTrack = !deps.has(activeEffect);
        if (shouldTrack) {
            deps.add(activeEffect);
            activeEffect.deps.push(deps);
        }
    }
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner
};