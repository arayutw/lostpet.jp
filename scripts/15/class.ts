import { FormError } from "../13/class";
import { Component, InitOptions } from "../component";

export class TextInput extends Component {
    name!: string
    element!: HTMLInputElement | HTMLTextAreaElement
    error: FormError

    constructor(options: InitOptions & {
        element: HTMLInputElement | HTMLTextAreaElement
        name: string
    }) {
        super({
            element: options.element,
            name: options.name,
            P: options.P,
        });

        this.error = new (this.window.js.get(13) as typeof FormError)({
            target: this.element,
            on: {
                change: (event) => {
                    this.element.classList[event.view ? "add" : "remove"]("c10b");
                },
            },
            P: this,
        });
    }

    check(append: boolean = false) {
        const inputE = this.element;
        const validity = inputE.validity;

        let status = true;
        let message = null;

        if (!validity.valid) {
            status = false;

            if (validity.valueMissing) {
                message = "_を入力して下さい。"
            } else if (validity.tooLong) {
                message = "_が長すぎます。"
            } else if (validity.tooShort) {
                message = "_が短すぎます。"
            }
        }

        if (!status && !message) {
            message = "_を正しく入力して下さい。";
        }

        this.error.update(message?.replace("_", this.name));
        if (append) this.error.append();

        return status;
    }
}