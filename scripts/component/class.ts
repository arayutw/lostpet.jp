import { Win } from "../script/window";

export class Component {
    constructor(options: InitOptions) {
        this.init!(options);
    }

    window?: Win

    C: Components = []
    T: TimerIdMap = {}
    D: ToEventEntriesMap = {}
    E: FromEventEntries = []
    P?: Component | null
    S: boolean = true

    init?: Init
    on?: On
    off?: Off
    emit?: Emit
    destroy?: Destroy
}

export type Components = Array<Component>
export type TimerIdMap = { [key: number | string]: any }

export type ExtendsTarget = {
    prototype: {
        [key: string]: any
    }
}

export type InitOptions = {
    on?: {
        [key: string]: (any?: any) => void
    }
    P: Component | null
    [key: number | string]: any
}

export type EmitEventType = string
export type EmitEventListener = (event: EmitEvent) => void
export type EmitEventOptions = {
    once: boolean
}
export type EmitEvent = EmitEventData & {
    source: Component
    target: Component
    type: EmitEventType
}
export type EmitEventData = {
    [key: string]: any
}
export type On = (source: Component, name: EmitEventType, callback: EmitEventListener, options?: EmitEventOptions) => void
export type Off = (source: Component | null, name: EmitEventType, callback: EmitEventListener) => void
export type Destroy = () => void
export type Init = (options: InitOptions) => void
export type Emit = (name: EmitEventType, event?: EmitEventData) => void //{ [key: string]: any }

export type ToEventEntry = [EmitEventListener, EmitEventOptions | undefined, Component | null];
export type ToEventEntries = Array<ToEventEntry>
export type ToEventEntriesMap = { [key: EmitEventType]: ToEventEntries }

export type FromEventEntry = [Component, EmitEventType, EmitEventListener,];
export type FromEventEntries = Array<FromEventEntry>