import { UIHeader } from "../2/class";
import { Component, InitOptions } from "../component";
import { Content } from "../script/content";
import { Doc, DocManager } from "../script/document";

type Data = {
    id: number
}

export class DocContent extends Component implements Content {
    document!: Doc
    id!: number
    declare P: DocManager

    ui: {
        footer: null
        header: UIHeader | null
    } = {
            footer: null,
            header: null,
        }

    constructor(options: InitOptions) {
        super({
            document: options.document,
            id: options.id,
            P: options.P,
        });
    }

    create(data: Data): Promise<void> {
        return new Promise((resolve, reject) => {
            const win = this.window;
            const doc = this.document;

            // header
            const header = this.ui.header = new (win.js.get(2))({
                element: !doc.type ? document.getElementsByClassName("c2")[0]! : null,
                P: this,
            }) as UIHeader;

            // SSR
            if (!doc.type) {

            } else {
                const headerE = header.create();

                // body
                // data.id
                // data.body

                // footer

            }

            document.body.replaceChildren(header.element!);

            // headerを作成する
            // footerを作成する
            // mainを作成する
        });
    }
}