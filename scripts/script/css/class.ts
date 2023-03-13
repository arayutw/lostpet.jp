import { Component, Components, InitOptions } from "../../component"

export type StyleId = number
export type StyleIds = Array<StyleId>

type CSSText = string

type MediaQueryType = "global" | "hover" | `min${"360" | "480" | "600" | "768" | "1024" | "1120" | "1280"}` | `max${"359" | "479" | "599" | "767" | "1023" | "1119" | "1279"}` | "light" | "dark" | "hover:light" | "hover:dark" | "motion"

type Position = [number, number];

type PositionEntry = {
    index: Position
    type: MediaQueryType
}

type PositionEntries = Array<PositionEntry>

type MetaEntry = {
    css: StyleIds
    id: number
    position: PositionEntries
}

type MetaEntries = Array<MetaEntry>

type IdEntry = {
    expires_at: number
    id: StyleId
    sources: Components
}

type IdEntries = Array<IdEntry>

type StyleEntry = {
    text: CSSText
    type: MediaQueryType
}

type StyleEntries = Array<StyleEntry>

type CacheEntry = {
    css: StyleIds
    id: StyleId
    styles: StyleEntries
}

type AttachOptions = {
    build?: boolean
} | true | null

type Module = {
    css?: StyleIds
    text: string
}

export class CSS extends Component {
    private promises: {
        [key: string]: Promise<void> | undefined
    } = {}
    private caches: {
        [key: string]: CacheEntry
    } = {}
    private element: HTMLStyleElement = document.createElement("style")
    private entries: IdEntries = []

    constructor(options: InitOptions) {
        super({
            P: options.P,
        });

        document.head.appendChild(this.element);

        const changeListener: EventListener = () => {
            this.emit!("resize");
            this.build();
        }

        [
            "360",
            "480",
            "600",
            "768",
            "1024",
            "1120",
            "1280",
        ].forEach((size) => {
            matchMedia("screen and (min-width:" + size + "px)").addEventListener("change", changeListener, {
                passive: true,
            });
        });
    }

    setup(): Promise<void> {
        return new Promise((resolve, reject) => {
            const href = (document.head.querySelector("link[href^='/styles/i']") as HTMLLinkElement).href;
            const matches = href.match(/\/i([0-9]+)t([0-9]+)z\.css/);
            const bundleId = matches![1];
            const version = matches![2];

            Promise.all([
                fetch(href),
                this.window.fetch({
                    credentials: false,
                    method: "GET",
                    body: {
                        id: parseInt(bundleId, 10),
                        version: parseInt(version, 10),
                    },
                    path: "css",
                }),
            ])
                .then((responses) => {
                    if (this.S) {
                        return Promise.all([
                            responses[0].text(),
                            responses[1],
                        ]);
                    }
                })
                .then((responses) => {
                    if (this.S && responses) {
                        const cssText = responses[0];

                        (responses[1] as MetaEntries).forEach((entry) => {
                            const id = entry.id;

                            this.caches[id] = {
                                css: entry.css,
                                id: id,
                                styles: [],
                            };

                            entry.position.forEach((position) => {
                                const start = position.index[0];
                                const end = start + position.index[1];
                                const type = position.type;

                                this.caches[id].styles.push({
                                    text: cssText.slice(start, end),
                                    type: type,
                                });

                            });
                        });

                        resolve();
                    }
                })
                .catch((err) => {
                    if (this.S) {
                        console.error(err);
                        this.window!.throw();
                    }
                })
                .finally(reject);
        });
    }

    load(ids: StyleId | StyleIds): Promise<StyleIds> {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(ids)) ids = [ids];

            Promise.all(ids.map((id) => {
                if (!this.caches[id]) {
                    this.caches[id] = {
                        css: [],
                        id: id,
                        styles: [],
                    };

                    const promises = this.promises;
                    const promise = promises[id];

                    return promise ? promise : (promises[id] = new Promise((resolve, reject) => {
                        import("/styles/" + id + ".js?v=" + this.window!.version)
                            .then((response) => {
                                if (this.S) {
                                    const module = response.default as Module;
                                    const promises: Array<any> = [module,];

                                    const styleIds: Array<number> | undefined = module.css;
                                    if (styleIds) promises.push(this.window.css.load(styleIds));

                                    return Promise.all(promises);
                                }
                            })
                            .then((res) => {
                                if (this.S) {
                                    const module = res![0] as Module;
                                    const text = module.text;
                                    const positions: Array<number> = [];

                                    if (module.css) {
                                        this.caches[id].css = module.css;
                                    }

                                    [
                                        "@media screen and (min-width:360px){",
                                        "@media screen and (min-width:480px){",
                                        "@media screen and (min-width:600px){",
                                        "@media screen and (min-width:768px){",
                                        "@media screen and (min-width:1024px){",
                                        "@media screen and (min-width:1120px){",
                                        "@media screen and (min-width:1280px){",
                                        "@media screen and (max-width:359px){",
                                        "@media screen and (max-width:479px){",
                                        "@media screen and (max-width:599px){",
                                        "@media screen and (max-width:767px){",
                                        "@media screen and (max-width:1023px){",
                                        "@media screen and (max-width:1119px){",
                                        "@media screen and (max-width:1279px){",
                                        "@media (hover:hover) and (prefers-color-scheme:light){",
                                        "@media (hover:hover) and (prefers-color-scheme:dark){",
                                        "@media (prefers-color-scheme:light){",
                                        "@media (prefers-color-scheme:dark){",
                                        "@media (hover:hover){",
                                        "@media (prefers-reduced-motion:no-preference){",
                                    ].forEach((prefix: string) => {
                                        const p = text.indexOf(prefix);
                                        if (-1 !== p) positions.push(p);
                                    });

                                    positions.sort((a, b) => a - b);

                                    const texts: Array<CSSText> = [];

                                    if (positions.length) {
                                        if (positions[0]) texts.push(text.slice(0, positions[0]));

                                        positions.forEach((position, index) => {
                                            const so = [position];
                                            if ((1 + index) !== positions.length) so.push(positions[1 + index]);
                                            texts.push(text.slice(...so));
                                        });
                                    } else {
                                        texts.push(text);
                                    }

                                    texts.forEach((text) => {
                                        let type: MediaQueryType = "global";

                                        if ("@" === text[0]) {
                                            const char35 = text.slice(0, 35);

                                            let position: Position;

                                            if ("h" === char35[8]) {
                                                // @media (hover:hover) and (prefers-color-scheme:light)
                                                let start = 21;

                                                if ("(" === char35[25]) {

                                                    if ("l" === text[47]) {
                                                        type = "hover:light";
                                                        start = 54;
                                                    } else {
                                                        type = "hover:dark";
                                                        start = 53;
                                                    }
                                                } else {
                                                    type = "hover";
                                                }

                                                position = [start, -1,];
                                            } else if ("r" === char35[16]) {
                                                type = "motion";
                                                position = [46, -1,];

                                            } else if ("p" === char35[8]) {
                                                if ("l" === char35[29]) {
                                                    type = "light";
                                                    position = [36, -1,];

                                                } else {
                                                    type = "dark";
                                                    position = [35, -1,];

                                                }
                                            } else {
                                                const size = parseInt(char35.slice(-6), 10);

                                                switch (size) {
                                                    case 1023:
                                                    case 1024:
                                                    case 1119:
                                                    case 1120:
                                                    case 1279:
                                                    case 1280:
                                                        position = [37, -1,];
                                                        break;

                                                    default:
                                                        position = [36, -1,];
                                                        break;
                                                }

                                                type = (("i" === char35[20] ? "min" : "max") + size) as MediaQueryType;
                                            }

                                            text = text.slice(...position);
                                        }

                                        this.caches[id].styles.push({
                                            text: text,
                                            type: type,
                                        });
                                    });
                                }

                                resolve();
                            })
                            .catch(reject)
                            .finally(() => {
                                if (this.S) {
                                    this.promises[id] = undefined;
                                }
                            });
                    }));
                }
            }))
                .then(() => resolve(ids as StyleIds))
                .catch((err) => {
                    if (this.S) {
                        console.error(err);
                        this.window!.throw();
                    }

                    reject();
                })
        });
    }

    attach(source: Component, ids: StyleId | StyleIds, options: AttachOptions = null): void {
        if (!Array.isArray(ids)) ids = [ids];

        let changed = false;
        const attachIds = ids.slice();

        ids.forEach((id) => attachIds.push(...this.caches[id].css));

        attachIds.forEach((id) => {
            for (let i = 0, a = this.entries; a.length > i; i++) {
                const entry = a[i];

                if (id === entry.id) {
                    entry.expires_at = 0;
                    entry.sources.push(source);
                    return;
                }
            }

            this.entries.push({
                expires_at: 0,
                id: id,
                sources: [source,],
            });

            changed = true;
        });

        if (changed) {
            this.update();

            if (true === options || true === options?.build) {
                this.build();
            }
        }
    }

    detach(source: Component, ids: StyleId | StyleIds): void {
        if (!Array.isArray(ids)) ids = [ids];

        let changed = false;

        ids.forEach((id) => {
            for (let i = 0, a = this.entries; a.length > i; i++) {
                const entry = a[i];

                if (id === entry.id) {
                    for (let i = 0, aa = entry.sources; aa.length > i; i++) {
                        if (aa[i] === source) {
                            entry.sources.splice(i--, 1);
                            changed = true;
                        }
                    }

                    return;
                }
            }
        });

        if (changed) {
            this.update();
        }
    }

    build(debounce: boolean = false): void {
        clearTimeout(this.T[0]);

        if (true === debounce) {
            this.T[0] = setTimeout(() => this.build(), 500);

        } else {
            this.update();

            const styleE = this.element;

            const textMap: {
                [key in MediaQueryType]?: string
            } = {};

            this.entries.sort((a, b) => {
                return a.id - b.id;
            }).forEach((entry) => {
                const cacheEntry = this.caches[entry.id];

                if (cacheEntry) {
                    cacheEntry.styles.forEach((entry) => {
                        const type = entry.type;
                        if ("string" !== typeof textMap[type]) textMap[type] = "";
                        textMap[type] += entry.text;
                    });
                }
            });

            const isDark = document.documentElement.classList.contains("t2");
            const isReduceMotion = document.documentElement.classList.contains("r1");

            let text = "";

            for (let a = [
                ["global", ""],
                ["min360", "screen and (min-width:360px)",],
                ["min480", "screen and (min-width:480px)",],
                ["min600", "screen and (min-width:600px)",],
                ["min768", "screen and (min-width:768px)",],
                ["min1024", "screen and (min-width:1024px)",],
                ["min1120", "screen and (min-width:1120px)",],
                ["min1280", "screen and (min-width:1280px)",],
                ["max1279", "screen and (max-width:1279px)",],
                ["max1119", "screen and (max-width:1119px)",],
                ["max1023", "screen and (max-width:1023px)",],
                ["max767", "screen and (max-width:767px)",],
                ["max599", "screen and (max-width:599px)",],
                ["max479", "screen and (max-width:479px)",],
                ["max359", "screen and (max-width:359px)",],
                ["hover", "(hover:hover)"],
                ["light", !isDark],
                ["dark", isDark],
                ["hover:light", isDark ? false : "(hover:hover)"],
                ["hover:dark", !isDark ? false : "(hover:hover)"],
                ["motion", !isReduceMotion],
            ], i = 0; a.length > i; i++) {
                const entry = a[i];
                const t1 = textMap[entry[0] as MediaQueryType];

                if ("string" === typeof t1) {
                    const t2: CSSText = t1;
                    const mediaQuery = entry[1];

                    if ("boolean" === typeof mediaQuery ? mediaQuery : !(mediaQuery && !matchMedia(mediaQuery).matches)) {
                        text += t2;
                    }
                }
            }

            if (styleE.textContent !== text) {
                styleE.innerHTML = text;
            }
        }
    }

    private update(options: AttachOptions = null): void {
        const now = Date.now();
        // let changed = false;

        this.entries = this.entries.filter((entry) => {
            entry.sources = entry.sources.filter((instance) => instance && instance.S);

            if (!entry.sources.length) {
                if (!entry.expires_at) {
                    entry.expires_at = now + (10 * 1000);

                } else if (now > entry.expires_at) {
                    //  changed = true;
                    return false;
                }
            }

            return true;
        });

        // if (changed && (true === options || true === options?.build)) this.build();
    }
}