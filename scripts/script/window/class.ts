
import { Factory } from "../factory"
import { Component, InitOptions } from "../../component"
import { ServerOptions } from "../script"
import { CSS } from "../css"
import { JS } from "../js"
import { Json2Node } from "../element"
import { Doc, DocManager } from "../document"
import { Me } from "../me"
import { SVG } from "../svg"
import { Popup, PopupCloseOptions } from "../../8/class"
import { PopupItem, PopupItemOptions } from "../../8/item"

export class Win extends Component {
    constructor(options: ServerOptions) {
        super({
            P: null,
        });

        this.version = options.version;

        Object.setPrototypeOf(Factory.prototype, {
            window: this,
        });

        [
            CSS,
            DocManager,
            Doc,
            JS,
            Json2Node,
            Me,
            SVG,
        ].forEach((constructor) => {
            this.factory.create(constructor);
        });

        this.css = new CSS({ P: this });
        this.js = new JS({ P: this, });
        this.svg = new SVG({ P: this, });
        this.document = new DocManager({ P: this });
        this.me = new Me({ P: this });
        this.element = new Json2Node;

        matchMedia("(prefers-reduced-motion)").addEventListener("change", (event: MediaQueryListEvent) => {
            const mode = localStorage.getItem("r");
            const isActive = "2" === mode || ("1" !== mode && event.matches);
            document.documentElement.classList[isActive ? "add" : "remove"]("r1");
            this.css.build();
        }, {
            passive: true,
        });

        matchMedia("(prefers-color-scheme:dark)").addEventListener("change", (event: MediaQueryListEvent) => this.colorScheme.update(event.matches), {
            passive: true,
        });

        addEventListener("resize", () => {
            this.innerHeight = innerHeight;
            this.innerWidth = innerWidth;

            this.emit("resize");
        }, {
            passive: true,
        });

        Promise.all([
            this.css.setup(),
            this.me.update(),
        ])
            .then(() => {
                if (this.S) {
                    this.document.load({
                        data: options.document,
                        location: new URL(location.href),
                        scroll: {
                            left: scrollX,
                            top: scrollY,
                        },
                        type: 0,
                    });
                }
            })
            .catch((err) => {
                if (this.S) {
                    console.error(err);
                    this.window!.throw();
                }
            });
    }

    fetch(options: FetchOptions): Promise<any> {
        let reqBody: any = options.body;

        if (reqBody) {
            if (reqBody instanceof FormData) {
                const object = {};
                reqBody.forEach((value, key) => object[key] = value);
                reqBody = object;
            }

            reqBody = JSON.stringify(reqBody);
        }

        const credentials = options.credentials;
        const method = options.method;
        const priority = options.priority;
        let pathname = "/api/p" + (credentials ? "rivate" : "ublic") + "/" + options.path;

        const requestOptions: {
            headers: HeadersInit
            priority: "high" | "low" | "auto"
        } & RequestInit = {
            cache: "default",
            credentials: credentials ? "same-origin" : "omit",
            headers: {
                "x-csrf-token": location.hostname,
            },
            keepalive: false,
            method: method,
            mode: "same-origin",
            priority: priority || "auto",
            redirect: "error",
            referrer: "about:client",
            referrerPolicy: "same-origin",
        };

        if ("GET" === method) {
            if (reqBody) pathname += "?v=" + encodeURIComponent(reqBody);
            if (!credentials) pathname += (reqBody ? "&" : "?") + "a=" + this.version;

        } else {
            requestOptions.headers["Content-Type"] = "application/json;charset=utf-8";
            if (reqBody) requestOptions.body = reqBody;
        }

        return new Promise((resolve, reject) => {
            fetch(pathname, requestOptions)
                .then((res: Response) => {
                    if (this.S) {
                        const status = res.ok ? res.status : null;

                        if (200 === status) {
                            return res.json();
                        }
                    }
                })
                .then(resolve)
                .finally(reject);
        });
    }

    throw(): void {
        console.log("window: throw");

        this.S = false;
    }

    caches: { [key: string]: any } & {
        popup?: Popup
    } = {}

    innerHeight: number = innerHeight
    innerWidth: number = innerWidth

    factory: Factory = new Factory
    version: number = 0

    document: DocManager
    element: Json2Node
    css: CSS
    js: JS
    svg: SVG
    me: Me

    colorScheme = {
        update: (matches?: boolean) => {
            const mode = localStorage.getItem("t");
            const isActive = "2" === mode || ("1" !== mode && ("boolean" === typeof matches ? matches : matchMedia("(prefers-color-scheme:dark)").matches));
            document.documentElement.classList.replace(isActive ? "t1" : "t2", isActive ? "t2" : "t1");
            this.css.build();
        }
    }
    dialog = {
        create: (options: InitOptions): Promise<PopupItem> => {
            return new Promise<PopupItem>((resolve, reject) => {
                (this.caches.dialog ? Promise.resolve(this.caches.dialog) : this.js.load(9))
                    .then(() => this.caches.dialog!.create(options))
                    .then(resolve)
                    .catch(reject);
            });
        },
    }
    popup = {
        attach: (element: HTMLAnchorElement, listener: EventListener) => {
            element.addEventListener("click", listener, {
                passive: true,
            });

            element.addEventListener("mousedown", (event: Event) => event.stopPropagation(), { passive: true, });

            element.addEventListener("touchstart", (event: Event) => event.stopPropagation(), { passive: true, });
        },
        create: (options: PopupItemOptions): Promise<PopupItem> => {
            return new Promise<PopupItem>((resolve, reject) => {
                (this.caches.popup ? Promise.resolve(this.caches.popup) : this.js.load(8))
                    .then(() => resolve(this.caches.popup!.create(options)))
                    .catch(reject);
            });
        },
        close: (options?: PopupCloseOptions) => {
            this.caches.popup?.close(options);
        }
    }
}

export type FetchOptions = {
    credentials: boolean
    body?: { [key: string]: any } | FormData
    method: "GET" | "POST" | "PATCH"
    path: string
    priority?: "high" | "low" | "auto"
};