import { ContentData } from "../script/content"

export interface Column2DocumentContent {
    id: number

    ready?: () => Promise<void>
    create: (data: ContentData) => Promise<void> | void
}