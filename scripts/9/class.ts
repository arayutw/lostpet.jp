import { Component, InitOptions } from "../component";
import { Win } from "../script/window";

export class Dialog extends Component {
    private readonly items: Array<DialogItem> = []

    declare P: Win

    constructor(options: InitOptions) {
        super({
            P: options.P,
        });
    }

    close() {
        for (var i = 0, a = this.items; a.length > i; i++) {
            a[i].close();
            this.items.splice(i--, 1);
        }
    }
}