import { Component, InitOptions } from "../component";

export class UIHeader extends Component {
    element: HTMLElement | null = null

    constructor(options: InitOptions & {
        element: HTMLElement | null
    }) {
        super({
            element: options.element,
            P: options.P
        });

        if (!this.element) {
            this.element = this.create();
        }
    }


    create(): HTMLElement {
        const headerE = this.element = document.createElement("header");
        headerE.className = "c2";

        const aE1 = document.createElement("a");
        aE1.className = "c2a";
        aE1.href = "/";

        const pictureE = document.createElement("picture");

        const sourceE = document.createElement("source");
        sourceE.srcset = "/logo.svg";
        sourceE.media = "(min-width: 480px)";

        const imgE = new Image;
        imgE.className = "c2a1";
        imgE.src = "/icon.svg";

        pictureE.append(sourceE, imgE);
        aE1.appendChild(pictureE);

        const aE2 = document.createElement("a");
        aE2.className = "a3 c2b ht1";
        aE2.href = "/";
        aE2.textContent = "サイトに掲載";

        headerE.append(aE1, aE2);

        return headerE;
    }
}