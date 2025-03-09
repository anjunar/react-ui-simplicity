import React from "react"
import {AbstractNode, RootNode, TextNode} from "./core/TreeNode";
import {AbstractProvider} from "./blocks/shared/AbstractProvider";

export interface GeneralEvent {
    type : string
    data : string
}

export interface Context {
    ast: {
        root : RootNode,
        triggerAST() : void
    }
    providers : AbstractProvider<any, any, any>[]
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
        currentEvent : {
            handled : boolean
            instance : GeneralEvent
        }
        triggerEvent() : void
    }
}

const EditorContext = React.createContext<Context>(null)

export default EditorContext

