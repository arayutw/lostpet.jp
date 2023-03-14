import { Component, EmitEvent, InitOptions } from "../component";

export class FormError extends Component {
    element: HTMLDivElement = document.createElement("div")
    target!: HTMLInputElement | HTMLTextAreaElement
    message: string | null = null

    constructor(options: InitOptions & {
        on?: {
            change: (event: EmitEvent & {
                view: boolean
            }) => void
        }
        target: HTMLInputElement | HTMLTextAreaElement
    }) {
        super({
            target: options.target,
            on: options.on,
            P: options.P,
        });

        this.element.className = "c10";
    }

    append(): void {
        if ("string" === typeof this.message) {
            const win = this.window;

            Promise.all([
                win.css.load(1010),
                win.svg.load(16),
            ])
                .then(() => {
                    if (this.S && "string" === typeof this.message) {
                        win.css.attach(this, 1010, {
                            build: true,
                        });

                        if (!this.element.childNodes.length) {
                            this.element.append(win.element.create([
                                win.element.create(win.svg.get(16), {
                                    attribute: {
                                        height: "1em",
                                        width: "1em",
                                    },
                                    children: {
                                        attribute: {
                                            class: "c10p",
                                        },
                                    },
                                }),
                                "",
                            ]));
                        }

                        (this.element.childNodes[1] as Text).data = this.message;

                        this.target.parentNode?.insertBefore(
                            this.element,
                            this.target.nextSibling
                        );

                        this.emit("change", {
                            view: true,
                        });
                    }
                })
                .catch((err) => {
                    if (this.S) {
                        console.error(err);
                        win.throw();
                    }
                });
        }
    }

    update(text: string | null | undefined): void {
        this.message = ("" === text || "undefined" === typeof text) ? null : text;
        if ("string" !== typeof this.message) this.remove();
    }

    remove(): void {
        this.element.remove();

        this.window.css.detach(this, 1010);

        this.emit("change", {
            view: false,
        });
    }
}