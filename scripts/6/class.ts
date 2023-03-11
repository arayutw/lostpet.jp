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
    }

    create(data: ContentData & {
        body?: any
    }) {
        this.P.ui.main.update({
            background: 1,
            body: data.body,
        });
    }
}
