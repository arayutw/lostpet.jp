import { StyleIds } from "../script/css"
import { ScriptIds } from "../script/js"
import { SVGIds } from "../script/svg"
import { Win } from "../script/window"
import { Component } from "./class"

export type Module = {
    css?: StyleIds
    js?: ScriptIds
    svg?: SVGIds
    scope: "cec073ceb46482ef596df4c8724c4134",
    type: "class"
    component: typeof Component | typeof Component[]
    run?: (win: Win, module: Module) => void | Promise<void>
}