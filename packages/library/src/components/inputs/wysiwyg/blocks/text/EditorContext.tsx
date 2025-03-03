import React from "react"
import {AbstractTreeNode, RootTreeNode, TextTreeNode} from "./core/TreeNode";
import {CursorHolder} from "./core/Cursor";

export enum SelectionState {
    partial= "partial",
    full = "full",
    over = "over",
    none = "none"
}

export function selectionState(selection: Selection) {
    if (selection) {
        if (selection.startContainer === selection.endContainer) {
            if (selection.startContainer instanceof TextTreeNode && selection.endContainer instanceof TextTreeNode) {
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
    startContainer: AbstractTreeNode,
    startOffset: number,
    endContainer: AbstractTreeNode,
    endOffset: number,
}

export interface GeneralEvent {
    type : string
    data : string
}

export interface Context {
    ast: {
        root : RootTreeNode,
        triggerAST() : void
    }
    cursor: {
        currentCursor : {
            container: AbstractTreeNode,
            offset: number
        }
        triggerCursor(cursor? : CursorHolder) : void
    },
    selection : {
        currentSelection : {
            startContainer: AbstractTreeNode,
            startOffset: number,
            endContainer: AbstractTreeNode,
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

