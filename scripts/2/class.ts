import { Component, InitOptions } from "../component";

export class UIHeader extends Component {
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
        const headerE = this.element = document.createElement("header");
        headerE.className = "c1";
        headerE.role = "banner";

        const aE1 = document.createElement("a");
        aE1.className = "c1a";
        aE1.href = "/";

        const pictureE = document.createElement("picture");

        const sourceE = document.createElement("source");
        sourceE.srcset = "/logo.svg";
        sourceE.media = "(min-width: 480px)";

        const imgE = new Image;
        imgE.className = "c1a1";
        imgE.src = "/icon.svg";

        pictureE.append(sourceE, imgE);
        aE1.appendChild(pictureE);

        const aE2 = document.createElement("a");
        aE2.className = "a3 c1b ht1";
        aE2.href = "/";
        aE2.textContent = "サイトに掲載";

        this.window.document.attach(aE2);

        headerE.append(aE1, aE2);
    }
}