import { Win } from "../window"
import { Component, ExtendsTarget, Init, InitOptions, Components, On, Off, Emit, Destroy, TimerIdMap, ToEventEntriesMap, FromEventEntries, EmitEventType, EmitEventListener, EmitEventOptions, ToEventEntries, EmitEventData } from "../../component";

export class Factory {
    create(constructor: ExtendsTarget) {
        Object.setPrototypeOf(constructor.prototype, {
            ...this.features,
            window: this.window,
        });
    }

    features = features

    window?: Win
}

type features = {
    init: Init
    on: On
    off: Off
    emit: Emit
    destroy: Destroy
};

export const features: features = {
    init: function (this: Component, options: InitOptions): void {
        const initOptions: InitOptions = {
            ...options,
            ...{
                C: [],
                D: {}, // event (自分に設定されたイベント)
                E: [], // event (相手に設定したイベント)
                T: {},
            } as {
                C: Components
                T: TimerIdMap
                D: ToEventEntriesMap
                E: FromEventEntries
            },
        };

        for (let key in initOptions) {
            let val = initOptions[key];

            if ("on" !== key && "undefined" !== typeof val) {
                this[key] = val;
            }
        }

        const parent = initOptions.P;

        if (parent) {
            (parent as { C: Components }).C.push(this);

            const events = initOptions.on;

            if (events) {
                for (let name in events) {
                    this.on!(parent, name, events[name]);
                }
            }
        }
    },

    on: function (this: Component, source: Component, type: EmitEventType, callback: EmitEventListener, options?: EmitEventOptions): void {
        if (this.S) {
            const listeners = this.D;

            const determinedSource = source && source !== this ? source : null;

            if (!(determinedSource && !determinedSource.S)) {
                this.off!(determinedSource, type, callback);

                let entries = listeners[type];
                if (!entries) entries = listeners[type] = [];

                entries.push([callback, options, determinedSource,]);
                if (determinedSource) determinedSource.E.push([this, type, callback,]);
            }
        }
    },

    off: function (this: Component, source: Component | null, type: EmitEventType, callback: EmitEventListener): void {
        const listeners = this.D;

        const entries = listeners ? listeners[type] : null;

        if (entries) {
            const newEntries: ToEventEntries = [];

            for (let key in entries) {
                const entry = entries[key];
                const _source = entry[2];

                if (_source && source === _source) {
                    if (!_source.S) continue;

                    const newEntries2: FromEventEntries = [];
                    const oldEntries2 = _source.E;

                    for (let _i = 0; oldEntries2.length > _i; _i++) {
                        const _entry = oldEntries2[_i];

                        if (_entry[0] !== this || _entry[1] !== type || _entry[2] !== callback) {
                            newEntries2.push(_entry);
                        }
                    }

                    _source.E = newEntries2;
                }

                if ((_source || this) !== source || callback !== entry[0]) {
                    newEntries.push(entry);
                }
            }

            listeners[type] = newEntries;
        }
    },

    emit: function (this: Component, type: EmitEventType, eventData?: EmitEventData): void {
        const listeners = this.D;
        const isDestroy = "destroy" === type;

        if (!(!listeners || (!this.S && !isDestroy))) {
            const entries = listeners[type];

            if (entries) {
                for (let i = entries.length; i--;) {
                    const entry = entries[i];
                    const source = entry[2] || this;
                    const callback = entry[0];
                    const options = entry[1];

                    if (!(source && !source.S && !isDestroy)) {
                        callback({
                            ...(eventData || {}),
                            source: source,
                            target: this,
                            type: type,
                        });

                        if ((!options || !options.once) && !isDestroy) {
                            continue;
                        }
                    }

                    this.off!(source, type, callback);
                }

                // return event;
            }
        }
    },

    destroy: function (this: Component) {
        if (this.S) {
            const timerIdMap = this.T;

            for (let key in timerIdMap) {
                const id = timerIdMap[key];
                clearTimeout(id);
                clearInterval(id);
                cancelAnimationFrame(id as number);
            }

            this.S = false;

            this.emit!("destroy");

            for (let i = 0, a = this.E; a.length > i; i++) {
                const entry = a[i];
                const target = entry[0];

                if (target && target.S) {
                    const type = entry[1];

                    target.off!(this, type, entry[2]);

                    const targetFromEvents = target.D;
                    const oldEntries = targetFromEvents[type];

                    if (oldEntries) {
                        const newEntries: ToEventEntries = [];

                        for (let i = 0; oldEntries.length > i; i++) {
                            const entry = oldEntries[i];
                            const instance = entry[2];

                            if (!instance || (instance.S)) {
                                newEntries.push(entry);
                            }
                        }

                        targetFromEvents[type] = newEntries;

                        if (!targetFromEvents[type].length) {
                            targetFromEvents[type] = [];

                            const newTargetFromEvents = target.D = {};

                            for (let key in targetFromEvents) {
                                const entry = targetFromEvents[key];
                                if (entry.length) newTargetFromEvents[key] = entry;
                            }
                        }
                    }
                }
            }

            for (let i = 0, a = this.C; a.length > i; i++) {
                a[i].destroy!();
            }

            const parent = this.P;

            if (parent && parent.S) {
                const newEntries: Components = [];
                const oldEntries = parent.C;

                for (let i = 0; oldEntries.length > i; i++) {
                    let instance = oldEntries[i];

                    if (instance && instance.S) {
                        newEntries.push(instance);
                    }
                }

                parent.C = newEntries;
            }
        }
    },
}