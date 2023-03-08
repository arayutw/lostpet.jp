import { merge } from "../../merge"

export type ElementUnit = {
    attribute?: {
        [key: string]: any
    } | null
    children?: any
    on?: Array<[string, EventListener, EventListenerOptions?]> | {
        [key: string]: [EventListener, EventListenerOptions?]
    }
    tagName: string
}

export class Json2Node {
    create(options: any, ...sources: Array<any>): Node {
        if (sources.length) options = merge(options, ...sources);

        if (undefined === options || null === options) {
            return document.createDocumentFragment();

        } else if (options instanceof Node && -1 !== [1, 3, 8, 11,].indexOf(options.nodeType)) {
            return options;

        } else if ("undefined" !== typeof options.tagName) {
            return this.convert(options as ElementUnit);

        } else if (Array.isArray(options) || options instanceof HTMLCollection || options instanceof NodeList) {
            const documentFragment = document.createDocumentFragment();

            for (let i = 0; options.length > i; i++) {
                const entry = options[i];

                if (null !== entry) {
                    documentFragment.appendChild(this.create(entry));
                }
            }

            return documentFragment;

        } else {
            return document.createTextNode("string" !== typeof options ? options.toString() : options);

        }
    }

    private convert(unit: ElementUnit): Node {
        const tagName = unit.tagName;
        const attribute = unit.attribute;
        const events = unit.on;
        const children = unit.children;

        const isSvg = -1 !== [
            "circle",
            "path",
            "polygon",
            "rect",
            "svg",
        ].indexOf(tagName);

        const element = (isSvg ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName));
        if (!(undefined === children || null === children)) element.appendChild(this.create(children));

        for (let property in attribute) {
            const value = attribute[property];

            if ("class" === property) {
                if ("string" === typeof value) {
                    if (isSvg) {
                        element.className.baseVal = value;
                    } else {
                        (element as HTMLElement).className = value;
                    }
                }
            } else {
                let hasProperty = false;

                for (let nativeProperty in element) {
                    if (nativeProperty === property) {
                        hasProperty = true;
                        break;
                    }
                }

                if (hasProperty && !isSvg) {
                    element[property] = value;

                } else if ("string" === typeof value) {
                    if (isSvg && "viewBox" !== property) {
                        element.setAttributeNS(null, property, value);
                    } else {
                        element.setAttribute(property, value);
                    }
                }
            }
        }

        if (events) {
            if (Array.isArray(events)) {
                events.forEach((entry) => {
                    element.addEventListener(...entry);
                });
            } else {
                for (let name in events) {
                    element.addEventListener(name, ...events[name])
                }
            }
        }

        return element;
    }

    autolink(str: string): any {
        const entries: Array<[number, number, string]> = [];
        let s: string = str;
        let i = 0;
        let offset: number = 0;

        while (20 > ++i) {
            const matches: RegExpMatchArray | null = s.match(/((https?):\/\/)([a-z0-9-]+\.)?[a-z0-9-]+(\.[a-z]{2,6}){1,3}(\/[a-z0-9.,_\/~#&=;@%+?-]*)?/is);
            if (!matches) break;

            const url = matches[0] as string;
            const start = str.indexOf(url, offset);
            const length = url.length;

            offset = start + length;
            entries.push([start, length, str.slice(start, offset),]);

            s = str.slice(offset);
        }

        const nodes: Array<ElementUnit | string> = [];
        offset = 0;

        entries.forEach((entry) => {
            const [start, length,] = entry;
            const href = str.slice(start, start + length);

            if (start > offset) {
                nodes.push(str.slice(offset, start));
            }

            const url = new URL(href, "https://" + location.hostname);
            const suffix = url.pathname + url.search + url.hash;

            nodes.push({
                attribute: {
                    ...{
                        class: "a1",
                        href: href,
                    },
                    ...(!(url.hostname.indexOf("lostpet.jp") > -1) ? {
                        target: "_blank",
                        rel: "external nofollow noopener",
                    } : {})
                },
                children: url.protocol + "//" + url.hostname + (suffix.length > 51 ? suffix.slice(0, 50) + "..." : suffix),
                tagName: "a",
            });

            offset = start + length;
        });

        nodes.push(str.slice(offset));

        return nodes;
    }
}