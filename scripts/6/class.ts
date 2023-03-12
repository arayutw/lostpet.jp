import { dependenciesStyleIds } from ".";
import { Column2Document } from "../1/class";
import { Column2DocumentContent } from "../1/interface";
import { Component, InitOptions } from "../component";
import { ContentData } from "../script/content";

export class UIPrivacyContent extends Component implements Column2DocumentContent {
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
    }
}
