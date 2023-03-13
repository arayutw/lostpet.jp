import { dependenciesStyleIds } from ".";
import { UIContactContent } from "../10/class";
import { UIHeader } from "../2/class";
import { UIFooter } from "../3/class";
import { UIMain } from "../4/class";
import { UITermsContent } from "../5/class";
import { UIPrivacyContent } from "../6/class";
import { Component, InitOptions } from "../component";
import { Content, ContentData } from "../script/content";
import { Doc, DocManager } from "../script/document";
import { Column2DocumentContent } from "./interface";

type Builder = typeof UITermsContent | typeof UIPrivacyContent | typeof UIContactContent

// 利用規約 - apiで内容を取得して反映するだけ (外部ファイル不要)
// プライバシー - apiで内容を取得して反映するだけ (外部ファイル不要)
// 問い合わせ (formにevent attach) - .jsでのattach()が必要
// 登録 - .jsでのattach()が必要
// ポスター - .jsでのattach()が必要
/**
 * これにもcontentを付けた方がいい？
 */

export class Column2Document extends Component implements Content {
    content?: Column2DocumentContent
    document!: Doc
    id!: number
    declare P: DocManager
    readyState: 0 | 1 = 0

    ui!: {
        footer: UIFooter
        header: UIHeader
        main: UIMain
    }

    constructor(options: InitOptions & {
        id: number
    }) {
        super({
            id: options.id,
            P: options.P,
            ui: {},
        });

        this.window.css.attach(this, dependenciesStyleIds);
    }

    create(data: ContentData & {
        id: number
    }): Promise<void> {
        return new Promise((resolve, reject) => {
            const win = this.window;
            const doc = this.document;
            const js = win.js;
            const isSSR = !doc.type;
            const ui = this.ui;

            let header = ui.header;
            let main = ui.main;
            let footer = ui.footer;

            if (!header) {
                header = ui.header = new (js.get(2))({
                    element: isSSR ? document.getElementsByClassName("c1")[0]! : null,
                    P: this,
                }) as UIHeader;
            }

            if (!main) {
                main = ui.main = new (js.get(4))({
                    element: isSSR ? document.getElementsByClassName("c3")[0]! : null,
                    P: this,
                }) as UIMain;
            }

            if (!footer) {
                footer = ui.footer = new (js.get(3))({
                    element: isSSR ? document.getElementsByClassName("c2")[0]! : null,
                    P: this,
                }) as UIFooter;
            }

            (this.content?.id === data.id ? Promise.resolve(this.content!) : new Promise<Column2DocumentContent>((resolve, reject) => {
                this.window.js.load(data.id)
                    .then(([Constructor,]: [Builder]) => {
                        if (this.S) {
                            this.content?.destroy();

                            resolve(this.content = new Constructor({
                                id: data.id,
                                P: this,
                            }) as Column2DocumentContent);
                        }
                    })
                    .finally(reject);
            }))
                .then((content) => {
                    if (this.S) {
                        return content.create(data);
                    }
                })
                .then(() => {
                    const ui = this.ui;

                    document.body.replaceChildren(
                        ui.header.element,
                        ui.main.element,
                        ui.footer.element
                    );

                    this.emit("ready");

                    resolve();
                })
                .finally(reject);
        });
    }
}