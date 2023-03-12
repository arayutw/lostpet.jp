import { Component, InitOptions } from "../../component"
import { Content, ContentData } from "../content"
import { ElementUnit } from "../element"

/**
 * 0: SSR
 * 1: click
 * 2: popstate
 * 3: reload
 * 4: api (default)
 */
type TransitionType = 0 | 1 | 2 | 3 | 4

export type DocumentData = {
    id: number
    data?: ContentData
    head?: Array<MetaElementUnit1 | MetaElementUnit2 | LinkElementUnit | TitleElementUnit>
}

type Caches = {
    [key: string]: {
        data: DocumentData
        expires_at: number
    }
}

type CreateOptions = {
    scroll?: ScrollToOptions
    location: URL
    type: TransitionType
}

type LoadOptions = CreateOptions & {
    data?: DocumentData
}

/**
 * 1: 次回の読み込みでhttp遷移を強要する
 */
type Flag = 0 | 1

export class DocManager extends Component {
    caches: Caches = {}
    content?: Content
    history: Array<Doc> = []
    flag: Flag = 0

    private eventListeners: [EventListener, EventListener] = [
        (event: Event) => {
            const aE = event.currentTarget as HTMLAnchorElement;
            const doc = this.history[0];

            if (doc) {
                const loc = doc.location;
                const same = loc.pathname === aE.pathname && loc.search === aE.search;

                if (!(same && loc.hash !== aE.hash)) {
                    event.preventDefault();

                    if (!same || scrollY) {
                        history.pushState(history.state, document.title, aE.pathname + aE.search + aE.hash);

                        if (!same) {
                            this.load({
                                location: new URL(aE.href),
                                type: 1,
                            });
                        } else {
                            scrollTo({
                                left: 0,
                                top: 0,
                            });
                        }
                    }
                }
            }
        },

        (event: Event) => {
            const aE = event.currentTarget as HTMLAnchorElement;
            const pathname = aE.pathname;
            const search = aE.search;

            const cache = this.caches[pathname + search];

            if (!cache || Date.now() > cache.expires_at) {
                this.preload({
                    cache: true,
                    data: null,
                    location: new URL(aE.href),
                })
                    .catch((err) => {
                        if (this.S) {
                            console.error(err);
                        }
                    });
            }
        },
    ]

    attach(rootE: HTMLElement = document.body): void {
        const canHover = matchMedia("(hover:hover)").matches;

        for (let i = 0, a = rootE.getElementsByTagName("a"); a.length > i; i++) {
            const aE = a[i];

            if (aE.hasAttribute("href") && location.hostname === aE.hostname) {
                aE.addEventListener("click", this.eventListeners[0], {
                    passive: false,
                });

                if (canHover && !this.caches[aE.pathname + aE.search]) {
                    aE.addEventListener("mouseover", this.eventListeners[1], {
                        once: true,
                        passive: true,
                    });
                }
            }
        }
    }

    constructor(options: InitOptions) {
        super({
            P: options.P,
        });

        addEventListener("popstate", (event) => {
            event.preventDefault();

            this.load({
                location: new URL(location.href),
                type: 2,
            });
        }, {
            passive: false,
        });
    }

    reload(options: {
        scroll?: ScrollToOptions
    }): void {
        this.load({
            location: new URL(location.href),
            scroll: options.scroll || {
                left: scrollX,
                top: scrollY,
            },
            type: 3,
        });
    }

    load(options: LoadOptions): void {
        const http = 1 & this.flag;

        const newLoc = options.location;
        const newSearch = newLoc.search;
        const newPathname = newLoc.pathname;

        if (http || 4 === options.type) {
            history[(http ? "replace" : "push") + "State"](null, document.title, "https://" + location.hostname + newPathname + newSearch + newLoc.hash);
        }

        if (http) {
            location.reload();

        } else {
            const oldDoc = this.history[0];

            if (options.type && oldDoc) {
                const oldLoc = oldDoc.location;
                if (oldLoc.search === newSearch && oldLoc.pathname === newPathname) return;
            }

            if (oldDoc && oldDoc.S) oldDoc.destroy!();

            const newDoc = new Doc({
                P: this,
                ...options,
            });

            this.history.unshift(newDoc);

            newDoc.render(options.data || null);

            this.history.slice(0, 1);
        }
    }

    preload(options: {
        cache: boolean | null
        data: DocumentData | null
        location: URL
    }): Promise<DocumentData> {
        const loc = options.location;

        return new Promise((resolve, reject) => {
            (new Promise<DocumentData>((resolve, reject) => {
                const cacheKey = loc.pathname + loc.search;
                const cache = this.caches[cacheKey];
                const data = options.data ? options.data : (cache && false !== options.cache && (true === options.cache || (cache.expires_at > Date.now())) ? cache.data : null);

                if (data) {
                    resolve(data);
                } else {
                    this.window!.fetch({
                        body: {
                            pathname: loc.pathname,
                            search: loc.search,
                        },
                        credentials: false,
                        method: "GET",
                        path: "document",
                    })
                        .then((data) => {
                            if (this.S) {
                                this.caches[cacheKey] = {
                                    data: data,
                                    expires_at: (60 * 1000) + Date.now(),
                                };

                                resolve(data);
                            }
                        })
                        .finally(reject);
                }
            }))
                .then((data) => {
                    if (this.S) {
                        return Promise.all([
                            data,
                            this.window!.js.load(data.id),
                        ]);
                    }
                })
                .then((response) => {
                    if (this.S && response) {
                        resolve(response[0]);
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
}

export class Doc extends Component {
    content?: Content
    location!: URL
    scroll!: ScrollOptions | null
    declare P: DocManager
    type!: TransitionType

    constructor(options: CreateOptions & InitOptions) {
        super({
            location: options.location,
            P: options.P,
            scroll: options.scroll || null,
            type: options.type,
        });
    }

    render(data: DocumentData | null): void {

        const docManager = this.P;
        const loc = this.location;
        const type = this.type;

        if (2 === this.type && !docManager.caches[loc.pathname + loc.search]) {
            document.documentElement.classList.add("h");
        }

        docManager.preload({
            cache: 2 === type ? true : null,
            data: data,
            location: loc,
        })
            .then((data) => {
                if (this.S && docManager.history[0] === this) {
                    const oldContent = docManager.content;

                    const newContent = docManager.content = this.content = oldContent?.id === data.id ? oldContent : new (this.window!.js.get(data.id))({
                        id: data.id,
                        P: docManager,
                    });

                    newContent.document = this;

                    return Promise.all([
                        data,
                        newContent.create(data.data),
                    ]);
                }
            })
            .then((response) => {
                if (this.S && docManager.history[0] === this && response) {
                    response[0].head?.forEach((unit: ElementUnit) => {
                        const tag = unit.tagName;
                        const attrs = unit.attribute!;

                        if ("title" === tag) {
                            document.title = unit.children;
                        } else {
                            const isMeta = "meta" === tag;
                            const isProperty = isMeta ? attrs.property : false;

                            const el = document.head.querySelector(tag + "[" + (isMeta ? (isProperty ? "property" : "name") : "rel") + "='" + attrs[(isMeta ? (isProperty ? "property" : "name") : "rel")] + "']") as HTMLMetaElement | HTMLLinkElement | null;

                            if (el) {
                                const property = isMeta ? "content" : "href";
                                el[property] = attrs[property];
                            }
                        }
                    });

                    if ([1, 3, 4,].indexOf(type) > -1) {
                        scrollTo(this.scroll || {
                            left: 0,
                            top: 0,
                        });
                    }

                    if (0 === type) {
                        document.head.querySelector("link[href^='/styles/i']")?.remove();
                    }

                    document.documentElement.classList.remove("h");
                }
            })
            .catch((err) => {
                if (this.S) {
                    console.error(err);
                    this.window.throw();
                }
            });
    }
}

type TitleElementUnit = {
    children: string
    tagName: "title"
}

type MetaElementUnit1 = {
    attribute: {
        content: string
        name: string
    }
    tagName: "meta"
}

type MetaElementUnit2 = {
    attribute: {
        content: string
        property: string
    }
    tagName: "meta"
}

type LinkElementUnit = {
    attribute: {
        href: string
        rel: string
    }
    tagName: "link"
}