import React, {useState} from "react"
import {NodeRange} from "../../markdown/selection/ASTSelection";

export const MarkdownContext = React.createContext<MarkdownState.Context>(null)

function MarkdownState(properties: MarkdownState.Attributes) {

    const {children} = properties

    const [markdown, setMarkdown] = useState({
        currentMarkdown: ""
    })

    const [selection, setSelection] = useState<{currentSelection : NodeRange[]}>({
        currentSelection : []
    })

    const value = {
        markdown: {
            get currentMarkdown() {
                return markdown.currentMarkdown
            },
            set currentMarkdown(value: string) {
                markdown.currentMarkdown = value
            },
            triggerMarkdown() {
                setMarkdown({...markdown})
            }
        },
        selection : {
            get currentSelection() {
                return selection.currentSelection
            },
            set currentSelection(value ) {
                selection.currentSelection = value
            },
            triggerSelection() {
                setSelection({...selection})
            }
        }
    }

    return (
        <MarkdownContext value={value}>
            {children}
        </MarkdownContext>
    )
}

namespace MarkdownState {
    export interface Attributes {
        children: React.ReactNode
    }

    export interface Context {
        markdown: {
            currentMarkdown: string,
            triggerMarkdown(): void
        },
        selection : {
            currentSelection : NodeRange[]
            triggerSelection() : void
        }
    }

}

export default MarkdownState