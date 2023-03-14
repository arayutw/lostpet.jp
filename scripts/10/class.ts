import { dependenciesStyleIds } from ".";
import { Column2Document } from "../1/class";
import { Column2DocumentContent } from "../1/interface";
import { Recaptcha } from "../12/class";
import { EmailInput } from "../14/class";
import { TextInput } from "../15/class";
import { Component, EmitEvent, InitOptions } from "../component";
import { ContentData } from "../script/content";

export class UIContactContent extends Component implements Column2DocumentContent {
    id!: number
    declare P: Column2Document

    ui!: {
        form: HTMLFormElement
        submit: HTMLButtonElement
        title: TextInput
        email: EmailInput
        description: TextInput
        capture: Recaptcha
    }

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
        const win = this.window;
        const js = win.js;

        win.css.build();

        this.P.ui.main.update({
            background: 1,
            body: data.body,
        });

        this.P.on(this, "ready", () => {
            const TextInputClass = js.get(15) as typeof TextInput;
            const captchaE = this.P.ui.main.element.querySelector("#p10c");

            const formE = this.P.ui.main.element.querySelector("#p10f") as HTMLFormElement;
            const emailE = formE.querySelector("input[name=email]") as HTMLInputElement;
            const titleE = formE.querySelector("input[name=title]") as HTMLInputElement;
            const descriptionE = formE.querySelector("textarea[name=description]") as HTMLTextAreaElement;

            const ui = this.ui = {
                form: formE,
                submit: formE.getElementsByClassName("bt")[0] as HTMLButtonElement,
                email: new (js.get(14) as typeof EmailInput)({
                    element: emailE,
                    P: this,
                }),
                title: new TextInputClass({
                    element: titleE,
                    name: "タイトル",
                    P: this,
                }),
                description: new TextInputClass({
                    element: descriptionE,
                    name: "内容",
                    P: this,
                }),
                capture: new (js.get(12) as typeof Recaptcha)({
                    element: captchaE as HTMLDivElement,
                    on: {
                        change: () => this.check(false),
                    },
                    P: this,
                    strict: false,
                }),
            };

            for (let a = [
                "email",
                "title",
                "description",
            ], i = 0; a.length > i; i++) {
                const target = ui[a[i]];

                const listener = () => {
                    this.check(false);
                    target.error.append();
                };

                target.element.addEventListener("input", listener, { passive: true, });
                target.element.addEventListener("blur", listener, { passive: true, });
            }

            formE.addEventListener("submit", (event: Event) => {
                event.preventDefault();

                if (this.check(true)) {

                } else {
                    // dialog
                }
            }, {
                passive: false,
            });

            formE.noValidate = true;
        }, {
            once: true,
        });
    }

    private check(view: boolean): boolean {
        const ui = this.ui;
        let someError = false;

        for (let a = [
            ui.email,
            ui.title,
            ui.description,
        ], i = 0; a.length > i; i++) {
            if (!a[i].check(view)) {
                someError = true;
            }
        }

        if (!someError) {
            someError = !ui.capture.value;
        }

        ui.submit.disabled = someError;

        return !someError;
    }
}
