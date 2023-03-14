import { Component, EmitEventListener, InitOptions } from "../component"

export type Grecaptcha = {
    ready: (callback: () => void) => void
    render: (element: HTMLDivElement, options: {
        callback: (code: string) => void,
        "error-callback": () => void,
        "expired-callback": () => void,
        sitekey: string
        size: "compact" | "normal"
        theme: "dark" | "light"
    }) => number
    reset: (id: number) => void
}

declare var grecaptcha: Grecaptcha;

type Value = null | string
type Id = null | number

/**
 * 指定した要素にRecaptchaを配置する
 */
export class Recaptcha extends Component {
    private element: HTMLDivElement
    private id: Id = null
    private readonly siteKey: string = "__SITE_KEY__"

    // value
    private $value: Value = null

    set value(value: Value) {
        this.$value = value;
    }

    get value(): Value {
        return this.$value;
    }

    reset(): void {
        this.value = null;
        if (null !== this.id) grecaptcha.reset(this.id);
    }

    confirmed: boolean = false

    constructor(options: InitOptions & {
        element: HTMLDivElement
        strict?: boolean
        on?: {
            change: EmitEventListener
        },
    }) {
        super({
            on: options.on,
            P: options.P,
        });

        const element = this.element = options.element;

        var scriptE = document.createElement("script");

        (true === options.strict ? Promise.resolve(false) : this.window.fetch({
            credentials: true,
            method: "GET",
            path: "recaptcha",
        }))
            .then((res: boolean) => {
                if (this.S) {
                    if (res) {
                        this.confirmed = true;
                        this.element.remove();
                        // this.emit("ready");

                    } else {
                        return (new Promise<void>((resolve) => {
                            scriptE.src = "//www.google.com/recaptcha/api.js";
                            document.body.appendChild(scriptE);

                            var timeouts = this.T;

                            timeouts[0] = setInterval(() => {
                                if (this.S) {
                                    if ("grecaptcha" in self) {
                                        clearInterval(this.T[0]);
                                        resolve();
                                    }
                                }
                            }, 8);
                        }));
                    }
                }
            })
            .then(() => {
                if (this.S && !this.confirmed) {
                    grecaptcha.ready(() => {
                        if (this.S) {

                            var win = this.window!;
                            var errorEv = () => {
                                this.value = null;
                                this.emit("change");
                            };

                            this.id = grecaptcha.render(element, {
                                callback: (code) => {
                                    this.value = code;
                                    this.emit("change");
                                },
                                "error-callback": errorEv,
                                "expired-callback": errorEv,
                                sitekey: this.siteKey,
                                size: 360 > win.innerWidth ? "compact" : "normal",
                                theme: (document.documentElement.classList.contains("t2")) ? "dark" : "light",
                            });

                            // this.emit("ready");

                            element.classList.remove("sk");
                        }
                    });
                }
            })
            .catch((err) => {
                if (this.S) {
                    console.error(err);
                    this.window!.throw();
                }
            });

        this.on!(this, "destroy", () => {
            this.reset();

            scriptE.remove();
        });
    }
}