import React, {useState} from "react"
import {AbstractNode, RootNode, TextNode} from "../core/TreeNode";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";
import {AbstractProvider} from "../blocks/shared/AbstractProvider";
import {KeyCommand} from "../../wysiwyg/commands/KeyCommand";

let defaultValue = {
    event : {currentEvent : {instance : null, queue : []}, triggerEvent() {}},
    cursor : {currentCursor : null, triggerCursor() {}},
    selection : {currentSelection : null, triggerSelection() {}}
};

export const WysiwygContext = React.createContext<WysiwygState.Context>(defaultValue)

function WysiwygState(properties: WysiwygState.Attributes) {

    const {children} = properties

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

    const [event, setEvent] = useState<{ currentEvent: { queue: KeyCommand[], instance: WysiwygState.GeneralEvent } }>({
        currentEvent: {
            queue: [],
            instance: null
        }
    })

    let value = {
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
        <WysiwygContext value={value}>{children}</WysiwygContext>
    )
}

namespace WysiwygState {
    export interface Attributes {
        children: React.ReactNode
    }

    export interface GeneralEvent {
        type: string
        data: string
    }

    export interface Context {
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
                queue: KeyCommand[],
                instance: GeneralEvent
            }
            triggerEvent(): void
        }
    }

}

export default WysiwygState