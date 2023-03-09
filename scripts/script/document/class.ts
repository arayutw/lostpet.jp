import { Component, InitOptions } from "../../component"
import { Content, ContentData } from "../content"
import { ElementUnit } from "../element"


/*
preload
load
reload

{
    id: 1
    data: {}    
}

1.jsを読み込み、new Constructor(data)を実行する。
*/

/**
 * 0: SSR
 * 1: click
 * 2: popstate
 * 3: reload
 */
type Type = 0 | 1 | 2 | 3

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
    type: Type
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
            console.log("click:", this);

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
            console.log("mouseover:", this);

            const aE = event.currentTarget as HTMLAnchorElement;
            const pathname = aE.pathname;
            const search = aE.search;

            const cache = this.caches[pathname + search];

            if (!cache || Date.now() > cache.expires_at) {
                this.preload({
                    cache: true,
                    data: null,
                    location: new URL(aE.href),
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
        /* */
        const http = 1 & this.flag;

        const newLoc = options.location;
        const newSearch = newLoc.search;
        const newPathname = newLoc.pathname;

        history[(http ? "replace" : "push") + "State"](null, document.title, "https://" + location.hostname + newPathname + newSearch + newLoc.hash);

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
    type!: Type

    constructor(options: CreateOptions & InitOptions) {
        super({
            location: options.location,
            P: options.P,
            scroll: options.scroll || null,
            type: options.type,
        });
    }

    render(data: DocumentData | null): Promise<void> {
        return new Promise((resolve, reject) => {
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
                    const docManager = this.P;

                    if (this.S && docManager.history[0] === this) {
                        const oldContent = docManager.content;

                        docManager.content = this.content = oldContent?.id === data.id ? oldContent : new (this.window!.js.get(data.id))({
                            document: this,
                            id: data.id,
                            P: docManager,
                        });

                        return Promise.all([
                            data,
                            this.content!.create(data.data),
                        ]);
                    }
                })
                .then((response) => {
                    if (this.S && docManager.history[0] === this && response) {
                        // update head
                        const data = response[0];

                        if (this.type) {
                            const newHead = data.head!;

                            [
                                {
                                    attribute: {
                                        content: "/icon.png",
                                        property: "og:image",
                                    },
                                    tagName: "meta"
                                },
                                {
                                    attribute: {
                                        content: "image/png",
                                        property: "og:image:type",
                                    },
                                    tagName: "meta"
                                },
                                {
                                    attribute: {
                                        content: "2000",
                                        property: "og:image:height",
                                    },
                                    tagName: "meta"
                                },
                                {
                                    attribute: {
                                        content: "2000",
                                        property: "og:image:width",
                                    },
                                    tagName: "meta"
                                },
                            ].forEach((unit1) => {
                                for (let i = 0; newHead.length > i; i++) {
                                    const unit2 = newHead[i];

                                    if ("meta" === unit2.tagName) {

                                    }
                                }

                            });

                        }

                        resolve();
                    }
                });
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