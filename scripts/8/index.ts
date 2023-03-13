import { Module } from "../component/module"
import { Win } from "../script/window"
import { Popup } from "./class"
import { PopupItem } from "./item";

export const dependenciesStyleIds = [1006,]

export default {
    css: dependenciesStyleIds,
    scope: "cec073ceb46482ef596df4c8724c4134",
    type: "class",
    component: [
        Popup,
        PopupItem,
    ],
    run: (win: Win, module: Module) => {
        win.caches.popup = new (module.component[0] as typeof Popup)({
            P: win,
        });
    },
} as Module