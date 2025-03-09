import React, {useState} from "react"
import {AbstractNode, RootNode, TextNode} from "./core/TreeNode";
import {ParagraphNode} from "./blocks/paragraph/ParagraphNode";
import {AbstractProvider} from "./blocks/shared/AbstractProvider";
import {EventCommand} from "./commands/EventCommand";

export interface GeneralEvent {
    type: string
    data: string
}

export interface Context {
    ast: {
        root: RootNode,
        triggerAST(): void
    }
    providers: AbstractProvider<any, any, any>[]
    cursor: {
        currentCursor: {
            container: AbstractNode,
            offset: number
        }
        triggerCursor(): void
    },
    selection: {
        currentSelection: {
            startContainer: AbstractNode,
            startOffset: number,
            endContainer: AbstractNode,
            endOffset: number,
        },
        triggerSelection(): void
    }
    event: {
        currentEvent: {
            queue: EventCommand[],
            instance: GeneralEvent
        }
        triggerEvent(): void
    }
}

export const EditorContext = React.createContext<Context>(null)

function EditorState(properties: EditorState.Attributes) {

    const {providers, children} = properties

    const [astState, setAstState] = useState(() => {
        return {
            root: new RootNode([new ParagraphNode([new TextNode()])])
        }
    })

    const [cursorState, setCursorState] = useState<{ currentCursor: { container: AbstractNode, offset: number } }>(() => {
        return {
            currentCursor: null
        }
    })

    const [selectionState, setSelectionState] = useState<{
        currentSelection: {
            startContainer: AbstractNode,
            startOffset: number,
            endContainer: AbstractNode,
            endOffset: number
        }
    }>(() => {
        return {
            currentSelection: null
        }
    })

    const [event, setEvent] = useState<{ currentEvent: { queue: EventCommand[], instance: GeneralEvent } }>({
        currentEvent: {
            queue: [],
            instance: null
        }
    })

    let value = {
        ast: {
            get root() {
                return astState.root
            },
            set root(value) {
                astState.root = value
            },
            triggerAST() {
                setAstState({...astState})
            }
        },
        providers: providers,
        cursor: {
            get currentCursor() {
                return cursorState.currentCursor
            },
            set currentCursor(value) {
                cursorState.currentCursor = value
            },
            triggerCursor() {
                setCursorState({...cursorState})
            }
        },
        selection: {
            get currentSelection() {
                return selectionState.currentSelection
            },
            set currentSelection(value) {
                selectionState.currentSelection = value
            },
            triggerSelection() {
                setSelectionState({...selectionState})
            }
        },
        event: {
            get currentEvent() {
                return event.currentEvent
            },
            set currentEvent(value) {
                event.currentEvent = value
            },
            triggerEvent() {
                setEvent({...event})
            }
        }
    };

    return (
        <EditorContext value={value}>{children}</EditorContext>
    )
}

namespace EditorState {
    export interface Attributes {
        providers: AbstractProvider<any, any, any>[]
        children: React.ReactNode
    }
}

export default EditorState