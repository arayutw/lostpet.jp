import { Component, InitOptions } from "../component";
import { PopupItem } from "./item";

export class PopupLayer extends Component {
    declare P: PopupItem
    target!: Component

    constructor(options: InitOptions & {
        P: PopupItem
        target: Component
    }) {
        super({
            P: options.P,
            target: options.target,
        });
    }
}
