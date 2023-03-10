import { Component, InitOptions } from "../../component";
import { ElementUnit } from "../element";

type CacheEntry = string

export type SVGId = number
export type SVGIds = Array<SVGId>

export class SVG extends Component {
    private caches: {
        [key: string]: CacheEntry
    } = {}

    constructor(options: InitOptions) {
        super({
            P: options.P,
        });
    }

    load(ids: SVGId | SVGIds): Promise<ElementUnit[]> {
        return new Promise<ElementUnit[]>((resolve, reject) => {
            Promise.all((Array.isArray(ids) ? ids : [ids]).map((id) => new Promise<ElementUnit>((resolve, reject) => {
                if (this.caches[id]) {
                    resolve(this.get(id));
                } else {
                    this.window.fetch({
                        body: {
                            id: id
                        },
                        credentials: false,
                        method: "GET",
                        path: "svg",
                    })
                        .then((res: ElementUnit) => {
                            if (this.S && res) {
                                this.caches[id] = JSON.stringify(res);

                                resolve(res);
                            }
                        })
                        .finally(reject);
                }
            })))
                .then((res) => {
                    if (this.S) {
                        resolve(res);
                    }
                })
                .finally(reject);
        });
    }

    get(id: SVGId): ElementUnit {
        return JSON.parse(this.caches[id]) as ElementUnit;
    }
}