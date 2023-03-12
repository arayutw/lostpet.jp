import { Component, InitOptions } from "../component";
import { PopupItem, PopupItemOptions } from "./item";
import { PopupLayer } from "./layer";

export class Popup extends Component {
    readonly items: PopupItem[] = []

    private caches: { [key: string]: any } & {
        count?: number
    } = {}

    eventListeners: [EventListener, (event: KeyboardEvent) => void, EventListener,] = [
        (): void => {
            this.close({
                annotation: 1,
            });
        },
        (event: KeyboardEvent): void => {
            if ("Escape" === event.key) {
                event.preventDefault();

                this.close({
                    annotation: 2,
                });
            }
        },
        () => this.reposition(),
    ]

    constructor(options: InitOptions) {
        super({
            P: options.P,
        });

        this.on(this, "destroy", () => this.detach());
    }

    create(options: PopupItemOptions): PopupItem {
        const items = this.items;
        const newId = options.id;

        let someItemClosed = false;

        if (items.length) {
            const parentLayer = this.findLayer(options.P!);

            for (let i = items.length; i--;) {
                const oldItem = items[i];

                if (oldItem && oldItem.S) {
                    const oldId = oldItem.id;
                    const isSameId = newId && oldId === newId;
                    if (parentLayer && parentLayer === oldItem.layer) break;
                    oldItem.close();
                    someItemClosed = true;
                    if (isSameId) return oldItem;
                }
            }
        }

        const isLayer = options.layer;

        const newItem = new PopupItem({
            ...options,
            ...(someItemClosed ? {
                animation: false,
            } : {}),
        });

        if (isLayer) {
            newItem.layer = new PopupLayer({
                P: newItem,
                target: isLayer,
            });
        }

        this.items.push(newItem);

        this.update();

        return newItem;
    }

    reposition(): void {
        for (let i = 0, a = this.items; a.length > i; i++) {
            let item = a[i];
            if (item && item.S) item.reposition();
        }
    }

    private findLayer(target: Component): PopupLayer | void {
        const items = this.items;
        const layerTargets = [];

        for (let i = items.length; i--;) {
            const item = items[i];
            const layer = item.layer;
            if (layer) layerTargets.push(layer.target);
        }

        while (target && target.S) {
            if (-1 !== layerTargets.indexOf(target)) {
                for (let i = items.length; i--;) {
                    const item = items[i];
                    const layer = item.layer;

                    if (layer && target === layer.target) {
                        return layer;
                    }
                }
            }

            target = target.P!;
        }
    }

    private detach(): void {
        const eventListeners = this.eventListeners;

        removeEventListener("mousedown", eventListeners[0]);
        removeEventListener("touchstart", eventListeners[0]);
        removeEventListener("keydown", eventListeners[1], { "capture": true, });
        removeEventListener("resize", eventListeners[2]);
        removeEventListener("scroll", eventListeners[2]);
    }

    update(): void {
        const oldCount = this.caches.count;

        if (oldCount) {
            for (let a = this.items, i = 0; a.length > i; i++) {
                const item = a[i];
                if (!(item && item.S)) a.splice(i--, 1);
            }
        }

        const newCount = this.caches.count = this.items.length;

        if (!oldCount && newCount) {
            const eventListeners = this.eventListeners;

            addEventListener("mousedown", eventListeners[0], { "passive": true, });
            addEventListener("touchstart", eventListeners[0], { "passive": true, });

            addEventListener("keydown", eventListeners[1], {
                "capture": true,
                "passive": false,
            });

            addEventListener("resize", eventListeners[2], { "passive": true, });
            addEventListener("scroll", eventListeners[2], { "passive": true, });

        } else if (oldCount && !newCount) {
            this.detach();
        }
    }


    close(options?: {
        annotation?: number
        layer?: Component
    }): void {
        const annotation = options ? options.annotation : 0;
        const layerHint = options ? options.layer : null;
        const parentLayer = layerHint ? this.findLayer(layerHint) : null;

        const items = this.items;

        for (let i = items.length; i--;) {
            const item = items[i];

            if (item && item.S) {
                if (parentLayer && parentLayer === item.layer) break;

                item.close({
                    annotation: annotation,
                });
            }
        }
    }
}