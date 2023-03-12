import { dependenciesStyleIds } from ".";
import { Component, InitOptions } from "../component";
import { ElementUnit } from "../script/element";

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

        if (this.element) {
            this.ui.main = this.element.getElementsByTagName("main")[0];
            this.ui.side = this.element.getElementsByTagName("nav")[0];

        } else {
            this.create();

        }

        const elements = this.element.getElementsByClassName("c3b1b2");

        win.popup.attach((elements[elements.length - 1].getElementsByClassName("c3b1b2a")[0] as HTMLAnchorElement), (event: Event) => {
            const win = this.window;

            const targetE = event.currentTarget!;

            win.svg.load([
                18, 17, 5,
            ])
                .then((svgUnits: ElementUnit[]) => {
                    const currentValue = localStorage.getItem("t") || "0";

                    win.popup.create({
                        element: {
                            attribute: {
                                class: "c7",
                            },
                            children: ([
                                [0, "自動判定", 0,],
                                [1, "ライト", 1,],
                                [2, "ダーク", 2,],
                            ] as Array<[number, string, 0 | 1 | 2]>).map(([svgIndex, text, value]) => {
                                return {
                                    attribute: {
                                        class: "c7i"
                                    },
                                    children: {
                                        attribute: {
                                            class: "a2 c7a c7ai" + (value === parseInt(currentValue, 10) ? " c7s" : "") + " hb2",
                                        },
                                        children: [
                                            win.element.create(svgUnits[svgIndex], {
                                                attribute: {
                                                    height: "1em",
                                                    width: "1em",
                                                },
                                                children: {
                                                    attribute: {
                                                        class: "c7p",
                                                    },
                                                },
                                            }),
                                            text,
                                        ],
                                        on: {
                                            click: [
                                                () => {
                                                    const win = this.window;

                                                    win.popup.close({
                                                        annotation: 1,
                                                    });

                                                    localStorage[(!value ? "remove" : "set") + "Item"]("t", value);

                                                    win.colorScheme.update();
                                                },
                                                {
                                                    passive: true,
                                                },
                                            ],
                                        },
                                        tagName: "a",
                                    },
                                    tagName: "div",
                                };
                            }),
                            tagName: "div",
                        },
                        id: "a",
                        P: this,
                        target: targetE,
                        type: "menu",
                    });
                });

        });

        this.window.css.attach(this, dependenciesStyleIds);

        this.window.document.attach(this.element);
    }

    private create(): void {
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

        const func1 = ([text, slug, svg,]: [string, string, number,]) => {
            const aE = document.createElement("a");
            aE.className = "a2 c3b1b2a hb2";
            aE.href = slug;

            const svgJson = this.window.svg.get(svg);
            svgJson.attribute!.className = "c3b1b2at3";
            svgJson.children![0].attribute!.className = "c3b1b2at3a";

            aE.append(this.window.element.create(svgJson), text);
            return aE;
        };

        const createSideContainer = (title: string, border: boolean, items: HTMLElement[]): HTMLDivElement => {
            const containerE = document.createElement("div");
            containerE.className = "c3b1b" + (border ? " c3b1c" : "");

            const headingE = document.createElement("h5");
            headingE.className = "c3b1b1";
            headingE.textContent = title;

            const UlE = document.createElement("ul");
            UlE.className = "c3b1b2";
            UlE.append(...items);

            containerE.append(headingE, UlE);

            return containerE;
        }

        sideInnerDivE.append(
            sideHeadingE,
            createSideContainer("検索", false, ([
                ["迷子", "lost", 1,],
                ["保護", "find", 2,],
            ] as Array<[string, string, number]>).map(([text, slug, type,]) => {
                const aE = document.createElement("a");
                aE.className = "a2 c3b1b2a c3b1b2at" + type + " hb2";
                aE.href = "/search/" + slug;
                aE.textContent = text;
                return aE;
            })),
            createSideContainer("お役立ち", false, ([
                ["掲載", "/search/new", 4,],
                ["ポスター", "/poster", 3,],
            ] as Array<[string, string, number]>).map(func1)),
            createSideContainer("案内", false, ([
                ["利用規約", "/terms", 6,],
                ["プライバシーポリシー", "/privacy", 7,],
                ["問い合わせ", "/contact", 8,],
            ] as Array<[string, string, number]>).map(func1)),
            createSideContainer("環境設定", false, ([
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

        containerE.append(mainE, sideE);
    }

    update(options: UpdateOptions): void {
        /* main */
        const mainE = this.ui.main;
        mainE.className = "c3a" + (options.background ? (" c3at" + options.background) : "");
        if (options.body) mainE.replaceChildren(this.window.element.create(options.body));

        /* side nav */

        this.window.document.attach(mainE);
    }
}