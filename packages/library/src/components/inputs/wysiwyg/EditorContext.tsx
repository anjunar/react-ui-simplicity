import React from "react"
import {AbstractNode, RootNode, TextNode} from "./core/TreeNode";

export enum SelectionState {
    partial= "partial",
    full = "full",
    over = "over",
    none = "none"
}

export function selectionState(selection: Selection) {
    if (selection) {
        if (selection.startContainer === selection.endContainer) {
            if (selection.startContainer instanceof TextNode && selection.endContainer instanceof TextNode) {
                if (selection.startOffset === 0 && selection.endOffset === selection.startContainer.text.length) {
                    return SelectionState.full
                } else {
                    return SelectionState.partial
                }
            } else {
                return SelectionState.none
            }
        } else {
            return SelectionState.over
        }
    } else {
        return SelectionState.none
    }
}

export interface Selection {
    startContainer: AbstractNode,
    startOffset: number,
    endContainer: AbstractNode,
    endOffset: number,
}

export interface GeneralEvent {
    type : string
    data : string
}

export interface Context {
    ast: {
        root : RootNode,
        triggerAST() : void
    }
    cursor: {
        currentCursor : {
            container: AbstractNode,
            offset: number
        }
        triggerCursor() : void
    },
    selection : {
        currentSelection : {
            startContainer: AbstractNode,
            startOffset: number,
            endContainer: AbstractNode,
            endOffset: number,
        },
        triggerSelection() : void
    }
    event : {
        handled : boolean
        instance : GeneralEvent
    }
}

const EditorContext = React.createContext<Context>(null)

export default EditorContext

