import { dependenciesStyleIds } from ".";
import { Component, InitOptions } from "../component";
import { StyleIds } from "../script/css";
import { ElementUnit } from "../script/element";
import { SVGIds } from "../script/svg";
import { PopupLayer } from "./layer";

/**
    * features:
    * 1: can touch close
    * 2: can keyboard close
    * 4: can button close
    * 8: disabled reposition
 */

/**
    * annotation:
    * 0: force close
    * 1: touch close
    * 2: keyboard (ESC)
    * 4: button close
*/

type PopupItemConfirm = (options: {
    source: Component
    target: Component
}) => void

type CommonOptions = {
    css: StyleIds
    id: string | number
}

// for any
type Options1 = CommonOptions & {
    align?: 0 | 1 | 2 | 3 | 4
    animation?: boolean
    confirm?: PopupItemConfirm
    css?: StyleIds
    feature: number
    layer?: Component
    position?: 0 | 1 | 2 | 3 | 4
    target: HTMLElement
    width?: HTMLElement
}

// for toast
type Options2 = CommonOptions & {
    color: "n" | "p" | "w" | "i"
    feature: number
    expires?: number
    text: any
    type: "toast"
}

export type PopupItemOptions = InitOptions & (Options1 | Options2);

export class PopupItem extends Component {
    align: 0 | 1 | 2 | 3 | 4 = 0
    confirm?: PopupItemConfirm
    element!: HTMLDivElement
    feature: number = 0
    id!: string | number
    layer?: PopupLayer
    position: 0 | 1 | 2 | 3 | 4 = 3
    target?: HTMLElement
    style: HTMLStyleElement = document.createElement("style")
    width?: HTMLElement

    private eventListeners: [
        EventListener,
    ] = [
            (event: Event) => {
                event.stopPropagation();

                this.close({
                    annotation: 1,
                    children: true,
                });
            },
        ]

    constructor(options: PopupItemOptions) {
        super({
            id: options.id,
            P: options.P,
            on: options.on,
        });

        const win = this.window!;
        const css = win.css;
        const svg = win.svg;
        const json2Node = win.element;
        const eventListeners = this.eventListeners;

        this.feature = "number" === typeof options.feature ? options.feature : (1 | 2 | 4);

        const color = options.color;

        const type = options.type;
        const isToast = "toast" === type;

        const cssToken = "u" + Math.random().toString(32).substring(2) + Date.now();

        let nodes = options.element;

        const styleIds: StyleIds = [];
        const svgIds: SVGIds = [];

        const closeButtonAE = isToast ? json2Node.create({
            attribute: {
                class: "a2 " + (isToast ? "c8b" : "c6a2") + " hb2",
            },
            on: {
                click: [
                    (event: MouseEvent | TouchEvent) => {
                        event.preventDefault();

                        this.close({
                            annotation: 4,
                        });
                    },
                    {
                        passive: false,
                    },
                ],
            },
            tagName: "a",
        }) : null;

        if (closeButtonAE) styleIds.push(107);

        if (isToast) {
            this.feature |= 8;

            const textOptions = options.text;
            let children: Array<any> = [];

            styleIds.push(1008);

            if (textOptions) {
                for (let a = Array.isArray(textOptions) ? textOptions : [textOptions,], i = 0; a.length > i; i++) {
                    children.push({
                        children: a[i],
                        tagName: "div",
                    });
                }
            }

            svgIds.push("p" === color ? 9 : ("n" === color ? 10 : ("w" === color ? 15 : 16)));

            nodes = [
                {
                    attribute: {
                        class: "c8a c8a" + color,
                    },
                    tagName: "div",
                },
                {
                    children: children,
                    tagName: "div",
                },
            ];
        } else {
            this.target = options.target;

            if (options.align) {
                this.align = options.align;
            }

            if (3 !== options.position || 0 === options.position) {
                this.position = options.position;
            }
        }

        const rootE = this.element = json2Node.create({
            attribute: {
                class: "c6 " + cssToken + (isToast ? " c8 c8p" : ""),
            },
            children: nodes,
            on: {
                mousedown: [eventListeners[0], { passive: true, },],
                touchstart: [eventListeners[0], { passive: true, },],
            },
            tagName: "div",
        }) as HTMLDivElement;

        const contentE = rootE.firstChild as HTMLElement;

        Promise.all([
            css.load([
                ...styleIds,
                ...(options.css ? options.css : []),
            ]),
            svg.load([
                10,
                ...svgIds,
            ]),
        ])
            .then(([styleIds, svgNodes]: [StyleIds, ElementUnit[]]) => {
                css.attach(this, [
                    ...dependenciesStyleIds,
                    ...styleIds,
                ], {
                    build: true,
                });

                const styleE = this.style;
                styleE.innerHTML = "." + cssToken + "{}";
                document.head.appendChild(styleE);

                closeButtonAE?.appendChild(json2Node.create(svgNodes[0], {
                    attribute: {
                        height: "12",
                        width: "12",
                    },
                    children: {
                        attribute: {
                            fill: "currentColor",
                        },
                    },
                }));

                if (isToast) {
                    rootE.childNodes[0].appendChild(json2Node.create(svgNodes[1], {
                        attribute: {
                            height: "1.2em",
                            width: "1.2em",
                        },
                        children: {
                            attribute: {
                                class: "c8a" + color + "1",
                            },
                        },
                    }));

                    rootE.appendChild(closeButtonAE!);
                }

                document.body.appendChild(rootE);

                this.reposition();

                if (isToast) {
                    setTimeout(() => {
                        if (this.S) this.close();
                    }, (options as Options2).expires || 3000);

                    setTimeout(() => {
                        rootE.classList.remove("c8p");
                    }, 8);
                }

                this.window.document.attach(rootE);
            })
            .catch((err) => {
                if (this.S) {
                    console.error(err);
                    this.window!.throw();
                }
            });

        this.on!(this, "destroy", () => {
            const win = this.window;

            this.close({
                children: true,
            });

            this.element.remove();
            this.style.remove();

            win.css.build(true);

            win.caches.popup!.update();
        });
    }

    reposition(): void {
        if (!(8 & this.feature)) {
            const win = this.window;
            const styleE = this.style;
            const sheet = styleE.sheet;
            const cssRules = sheet!.cssRules;
            const style = (cssRules[0] as CSSStyleRule).style!;

            const widthTarget = this.width;
            const containerWidth = widthTarget ? widthTarget.offsetWidth : null;

            const element = this.element;
            const position = this.position;

            const _innerWidth = win.innerWidth;
            const _innerHeight = win.innerHeight;

            let elWidth = element.offsetWidth;
            const elHeight = element.offsetHeight;

            if (containerWidth && containerWidth > elWidth) elWidth = containerWidth;

            let top, left;

            if (0 === position) {
                left = (_innerWidth / 2) - (elWidth / 2);
                top = (_innerHeight / 2) - (elHeight / 2);

            } else {
                const rect = this.target!.getBoundingClientRect();

                const targetLeft = rect.left - 8;
                const targetTop = rect.top - 8;
                const targetRight = rect.right + 8;
                const targetBottom = rect.bottom + 8;
                const targetWidth = rect.right - rect.left;
                const targetHeight = rect.bottom - rect.top;

                const rightEdge = _innerWidth - 8;
                const leftEdge = 8;
                const topEdge = 8;
                const bottomEdge = _innerHeight - 8;

                const rightSpace = rightEdge - targetRight;
                const bottomSpace = bottomEdge - targetBottom;

                if ((4 === position) ? 4 : ((2 === position) ? 2 : 0)) {
                    left = (4 === position && (rightSpace >= elWidth)) ? targetRight : (targetLeft - elWidth);
                    top = targetTop + 8 + (targetHeight / 2) - (elHeight / 2);

                } else {
                    top = (3 === position && (bottomSpace >= elHeight)) ? targetBottom : (targetTop - elHeight);
                    left = targetLeft + 8 + (4 === this.align ? 0 : ((targetWidth / 2) - (elWidth / 2)));

                }

                left = Math.min(Math.max(left, leftEdge), rightEdge - elWidth);
                top = Math.min(Math.max(top, topEdge), bottomEdge - elHeight);
            }

            style.cssText = "top:" + (scrollY + top) + "px;left:" + (scrollX + left) + "px;" + (containerWidth ? ("width:" + elWidth + "px") : "");
        }
    }

    close(options?: {
        annotation?: number
        children?: true
    }): void {
        if (this.S) {
            const annotation = options?.annotation || 0;

            if (options?.children) {
                let isChild = false;

                for (let i = 0, a = this.window.caches.popup!.items; a.length > i; i++) {
                    const item = a[i];

                    if (item && item.S) {
                        if (isChild) {
                            item.close({
                                annotation: annotation,
                            });
                        }

                        if (this === item) isChild = true;
                    }
                }
            } else {
                const feature = this.feature;

                const isTouchClose = 1 & annotation;
                const isKeyboardClose = 2 & annotation;
                const isButtonClose = 4 & annotation;
                const isManualClose = isTouchClose || isKeyboardClose || isButtonClose;

                if (!((isTouchClose && !(1 & feature)) || (isKeyboardClose && !(2 & feature)) || (isButtonClose && !(4 & feature)))) {
                    if (isManualClose && "function" === typeof this.confirm) {
                        this.confirm({
                            source: this.P,
                            target: this,
                        });
                    } else {
                        this.emit("close", {
                            "annotation": annotation,
                        });

                        this.destroy();
                    }
                }
            }
        }
    }
}