import { Component, ExtendsTarget, InitOptions } from "../../component";

export type ScriptId = number
export type ScriptIds = Array<ScriptId>

export class JS extends Component {
    private caches: {
        [key: string]: any
    } = {}

    constructor(options: InitOptions) {
        super({
            P: options.P,
        });
    }

    get(id: ScriptId): any {
        return this.caches[id];
    }

    load(ids: ScriptIds | ScriptId): Promise<any> {
        if (!Array.isArray(ids)) ids = [ids,];

        return Promise.all(ids.map((id) => {
            return new Promise((resolve, reject) => {
                if (this.caches[id]) {
                    resolve(this.caches[id]);
                } else {
                    import("/scripts/" + id + ".js?v=" + this.window.version)
                        .then((response) => {
                            const module = response.default;
                            const promises: Array<any> = [module,];

                            if (module) {
                                const scriptIds: Array<number> | undefined = module.js;
                                const styleIds: Array<number> | undefined = module.css;
                                const svgIds: Array<number> | undefined = module.svg;

                                scriptIds?.forEach((id) => promises.push(this.load(id)));
                                if (styleIds) promises.push(this.window.css.load(styleIds));
                                if (svgIds) promises.push(this.window.svg.load(svgIds));
                            }

                            return Promise.all(promises);
                        })
                        .then((res) => {
                            const promises: Array<any> = [];
                            const module = res[0];

                            if (module) {
                                let component: any;
                                const type = module.type;

                                if ("cec073ceb46482ef596df4c8724c4134" === module.scope) {
                                    if ("class" === type) {
                                        let components = module.component;
                                        if (!Array.isArray(components)) components = [components];
                                        component = this.caches[id] = components[0];

                                        components.forEach((component: ExtendsTarget) => {
                                            this.window.factory.create(component);
                                        });
                                    } else if ("function" === type || "object" === type) {
                                        component = this.caches[id] = module.component;
                                    } else {
                                        component = 1;
                                    }

                                    promises.push(component);

                                    if (module.run) {
                                        promises.push(module.run(this.window, module));
                                    }

                                } else {
                                    const constructor = component = module;
                                    promises.push(this.caches[id] = constructor ? constructor : module);
                                }
                            }

                            return Promise.all(promises);
                        })
                        .then((res) => {
                            if (this.S) {
                                resolve(res[0]);
                            }
                        })
                        .catch((err) => {
                            if (this.S) {
                                console.error(err);
                                this.window.throw();
                            }
                        })
                        .finally(reject);
                }
            });
        }));
    }
}
