import { Component, InitOptions } from "../component";

declare var turnstile: TurnstileManager;

export type TurnstileManager = {
    ready: (callback: () => void) => void
    render: (element: HTMLDivElement, options: {
        callback: (code: string) => void,
        execution: string
        "error-callback": () => void,
        "expired-callback": () => void,
        "timeout-callback": () => void,
        sitekey: string
        size: "compact" | "normal"
        theme: "dark" | "light"
        language: "ja"
    }) => number
    reset: (id: number) => void
}

type Value = null | string
type Id = null | number

export class Turnstile extends Component {
    confirmed: boolean = false
    private element: HTMLDivElement
    private id: Id = null
    private readonly siteKey: string = "__SITE_KEY__"
    private $value: Value = null

    set value(value: Value) {
        this.$value = value;
    }

    get value(): Value {
        return this.$value;
    }

    reset(): void {
        this.value = null;
        if (null !== this.id) turnstile.reset(this.id);
    }

    constructor(options: InitOptions & {
        element: HTMLDivElement
        strict?: boolean
    }) {
        super({
            on: options.on,
            P: options.P,
        });

        const element = this.element = options.element;

        var scriptE = document.createElement("script");

        (true === options.strict ? Promise.resolve(false) : this.window!.fetch({
            credentials: true,
            method: "GET",
            path: "recaptcha",
        }))
            .then((res) => {
                if (this.S) {
                    if (res && (res as { status: boolean }).status) {
                        this.confirmed = true;
                        this.element.remove();
                        this.emit!("ready");

                    } else {
                        return (new Promise<void>((resolve) => {
                            scriptE.src = "//challenges.cloudflare.com/turnstile/v0/api.js";
                            document.body.appendChild(scriptE);

                            var timeouts = this.T;

                            timeouts[0] = setInterval(() => {
                                if (this.S) {
                                    if ("turnstile" in self) {
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
                    var win = this.window!;
                    var errorEv = () => {
                        this.value = null;
                        this.emit!("input");
                    };

                    this.id = turnstile.render(element, {
                        callback: (code) => {
                            this.value = code;
                            this.emit!("input");
                        },
                        execution: "execute",
                        "error-callback": errorEv,
                        "expired-callback": errorEv,
                        "timeout-callback": errorEv,
                        sitekey: this.siteKey,
                        size: 360 > win.innerWidth ? "compact" : "normal",
                        theme: (document.documentElement.classList.contains("t2")) ? "dark" : "light",

                        language: "ja",
                    });

                    this.emit!("ready");
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