import { Component } from "../component"
import { ContentData } from "../script/content"

export interface Column2DocumentContent extends Component {
    id: number

    ready?: () => Promise<void>
    create: (data: ContentData) => Promise<void> | void
}