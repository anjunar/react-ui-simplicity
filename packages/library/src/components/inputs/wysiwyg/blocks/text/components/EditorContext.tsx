import React from "react"
import {AbstractTreeNode, RootTreeNode} from "../AST";

export interface Context {
    ast: {
        root : RootTreeNode,
        triggerAST() : void
    }
    cursor: {
        container: AbstractTreeNode,
        offset: number
        triggerCursor(value : {container : AbstractTreeNode, offset : number}) : void
    }
    event : {
        handled : boolean
        instance : InputEvent
    }
}

const EditorContext = React.createContext<Context>(null)

export default EditorContext

