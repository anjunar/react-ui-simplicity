import React from "react"
import {AbstractTreeNode, RootTreeNode} from "../ast/TreeNode";

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
        current : {
            container: AbstractTreeNode,
            offset: number
        }
        triggerCursor() : void
    }
    event : {
        handled : boolean
        instance : GeneralEvent
    }
}

const EditorContext = React.createContext<Context>(null)

export default EditorContext

