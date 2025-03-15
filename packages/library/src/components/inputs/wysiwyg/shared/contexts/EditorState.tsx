import React, {useState} from "react"
import {AbstractProvider} from "../blocks/shared/AbstractProvider";
import {RootNode, TextNode} from "../core/TreeNode";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";

export const EditorContext = React.createContext<EditorState.Context>({providers : [], ast : null })

function EditorState(properties: EditorState.Attributes) {

    const {providers, children} = properties

    const [astState, setAstState] = useState(() => {
        return {
            root: new RootNode([new ParagraphNode([new TextNode()])])
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
        providers : providers
    };

    return (
        <EditorContext value={value}>
            {children}
        </EditorContext>
    )
}

namespace EditorState {
    export interface Attributes {
        children : React.ReactNode
        providers : AbstractProvider<any, any, any>[]
    }

    export interface Context {
        providers : AbstractProvider<any, any, any>[]
        ast: {
            root: RootNode,
            triggerAST(): void
        }
    }
}

export default EditorState