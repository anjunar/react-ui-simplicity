import "./Wysiwyg.css"
import React, {CSSProperties, useState} from "react"
import {RootNode} from "./blocks/RootNode";
import NodeFactory from "./blocks/NodeFactory";
import {ParagraphNode, TextBlock} from "./blocks/paragraph/ParagraphNode";
import MenuButton from "./components/MenuButton";
import {AbstractProvider} from "./blocks/AbstractProvider";
import {Context} from "./context/Context";
import Block from "./components/Block";

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const {providers, style} = properties

    const [ast, setAst] = useState<{root : RootNode}>(() => {
        return {
            root : new RootNode([new ParagraphNode(new TextBlock(""))])
        }
    })

    return (
        <div className={"wysiwyg"} id={"editor"} style={style}>
            <Context value={{providers: providers, ast : ast.root, trigger() {setAst({...ast})}}}>
                {
                    ast.root.blocks.map(node => (
                            <div key={node.id}>
                                <Block node={node}/>
                            </div>
                        )
                    )
                }
            </Context>
        </div>
    )
}

namespace Wysiwyg {
    export interface Attributes {
        providers: AbstractProvider<any, any>[]
        style : CSSProperties
    }
}

export default Wysiwyg