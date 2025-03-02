import React from "react"
import {AbstractNode, RootNode} from "../ast/TreeNode";

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

