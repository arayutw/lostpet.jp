import { Component, InitOptions } from "../component";

export class UIFooter extends Component {
    element!: HTMLElement

    constructor(options: InitOptions & {
        element: HTMLElement | null
    }) {
        super({
            element: options.element,
            P: options.P
        });

        if (!this.element) {
            this.create();
        }
    }

    private create(): void {
        const footerE = this.element = document.createElement("footer");
        footerE.className = "c2";
        footerE.role = "contentinfo";

        const headingE = document.createElement("h5");
        headingE.className = "c2a";
        headingE.textContent = "Aboud";

        const ulE = document.createElement("ul");
        ulE.className = "c2b";

        ulE.append(...[
            ["/terms", "利用規約",],
            ["/privacy", "プライバシーポリシー",],
            ["/contact", "お問い合わせ",],
        ].map(([href, text]): HTMLLIElement => {
            const liE = document.createElement("li");

            const aE = document.createElement("a");
            aE.href = href;
            aE.textContent = text;

            liE.appendChild(aE);

            return liE;
        }));

        const imgDivE = document.createElement("div");
        imgDivE.className = "c2e";

        const imgE = new Image;
        imgE.alt = "LOSTPET.JP | 迷子ペットのデータベース";
        imgE.className = "c2e1";
        imgE.decoding = "async";
        imgE.height = 50;
        imgE.loading = "lazy";
        imgE.src = "/icon.svg";
        imgE.width = 50;

        imgDivE.appendChild(imgE);

        const messageE = document.createElement("div");
        messageE.className = "c2c";
        messageE.textContent = "迷子ペットとの再会をサポートしたい";

        const copyrightDivE = document.createElement("div");
        copyrightDivE.className = "c2d";

        const copyrightE = document.createElement("small");
        copyrightE.className = "c2d1";
        copyrightE.textContent = "© 2018-" + (new Date).getFullYear() + " " + location.hostname;
        copyrightDivE.appendChild(copyrightE);

        footerE.append(headingE, ulE, imgDivE, messageE, copyrightDivE);
    }
}