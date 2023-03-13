import { dependenciesStyleIds } from ".";
import { Column2Document } from "../1/class";
import { Column2DocumentContent } from "../1/interface";
import { Recaptcha } from "../12/class";
import { Component, InitOptions } from "../component";
import { ContentData } from "../script/content";

export class UIContactContent extends Component implements Column2DocumentContent {
    id!: number
    declare P: Column2Document

    constructor(options: InitOptions) {
        super({
            id: options.id,
            P: options.P,
        });

        this.window.css.attach(this, dependenciesStyleIds);
    }

    create(data: ContentData & {
        body?: any
    }) {
        this.window.css.build();

        this.P.ui.main.update({
            background: 1,
            body: data.body,
        });

        this.P.on(this, "ready", () => {
            const captchaE = this.P.ui.main.element.querySelector("#p10");

            new (this.window.js.get(12) as typeof Recaptcha)({
                element: captchaE as HTMLDivElement,
                P: this,
                strict: true,
            });
        }, {
            once: true,
        });
    }
}
