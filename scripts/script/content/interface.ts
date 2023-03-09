import { Component } from "../../component"
import { Doc, DocManager } from "../document"

export type ContentData = {
    [key: string]: any
}

export interface Content extends Component {
    document: Doc
    P: DocManager
    id: number

    create(data?: ContentData): Promise<void> | void
}