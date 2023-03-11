import { Component, InitOptions } from "../component";

type UpdateOptions = {
    background: number
    body: any
}

export class UIMain extends Component {
    element!: HTMLDivElement
    ui!: {
        main: HTMLElement
        side: HTMLElement
    }
    constructor(options: InitOptions & {
        element: HTMLDivElement | null
    }) {
        super({
            element: options.element,
            P: options.P,
            ui: {},
        });

        this.create();
    }

    private create(): void {
        if (this.element) {
            this.ui.main = this.element.getElementsByTagName("main")[0];
            this.ui.side = this.element.getElementsByTagName("nav")[0];
            return;
        }

        const containerE = this.element = document.createElement("div");

        /* main */
        const mainE = this.ui.main = document.createElement("main");
        // mainE.className = "c3a c3at1";
        mainE.role = "main";

        /* side */
        const sideE = this.ui.side = document.createElement("nav");
        sideE.className = "c3b";

        const sideInnerDivE = document.createElement("div");
        sideInnerDivE.className = "c3b1";
        sideE.appendChild(sideInnerDivE);

        const sideHeadingE = document.createElement("h2");
        sideHeadingE.className = "c3b1a";
        sideHeadingE.textContent = "メニュー";

        sideInnerDivE.append(
            sideHeadingE,
            this.createSideContainer("検索", false, ([
                ["迷子", "lost", 1,],
                ["保護", "find", 2,],
            ] as Array<[string, string, number]>).map(([text, slug, type,]) => {
                const aE = document.createElement("a");
                aE.className = "a2 c3b1b2a c3b1b2at" + type + " hb2";
                aE.href = "/search/" + slug;
                aE.textContent = text;
                return aE;
            })),
            this.createSideContainer("お役立ち", false, ([
                ["掲載", "/search/new", 4,],
                ["ポスター", "/poster", 3,],
            ] as Array<[string, string, number]>).map(([text, slug, svg,]) => {
                const aE = document.createElement("a");
                aE.className = "a2 c3b1b2a hb2";
                aE.href = "/search/" + slug;

                const svgJson = this.window.svg.get(svg);
                svgJson.attribute!.className = "c3b1b2at3";
                svgJson.children![0].attribute!.className = "c3b1b2at3a";

                aE.append(this.window.element.create(svgJson), text);
                return aE;
            })),
            this.createSideContainer("環境設定", false, ([
                ["カラーモード", 5,],
            ] as Array<[string, number]>).map(([text, svg,]) => {
                const json2node = this.window.element;

                const aE = document.createElement("a");
                aE.className = "a2 c3b1b2a hb2";
                aE.role = "button";

                const svgJson1 = this.window.svg.get(svg);
                svgJson1.attribute!.className = "c3b1b2at3";
                svgJson1.children![0].attribute!.className = "c3b1b2at3a";

                const svgJson2 = this.window.svg.get(13);
                svgJson2.attribute!.className = "c3b1b2at3";
                svgJson2.children![0].attribute!.className = "c3b1b2at3a";

                aE.append(json2node.create(svgJson1), text, json2node.create(svgJson2));
                return aE;
            })),
        );

        this.window.document.attach(sideE);

        containerE.append(mainE, sideE);
    }

    private createSideContainer(title: string, border: boolean, items: HTMLElement[]): HTMLDivElement {
        const containerE = document.createElement("div");
        containerE.className = "c3b1b";

        const headingE = document.createElement("h5");
        headingE.className = "c3b1b1";

        const UlE = document.createElement("ul");
        UlE.className = "c3b1b2";
        UlE.append(...items);

        containerE.append(headingE, UlE);

        return containerE;
    }

    update(options: UpdateOptions): void {
        /* main */
        const mainE = this.ui.main;
        mainE.className = "c3a" + (options.background ? (" c3at" + options.background) : "");
        if (options.body) mainE.replaceChildren(this.window.element.create(options.body));

        this.window.document.attach(mainE);

        /* side nav */
    }
}