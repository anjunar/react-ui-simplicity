import "./Wysiwyg.css"
import React, {CSSProperties, useState} from "react"
import {RootNode} from "./blocks/RootNode";
import NodeFactory from "./blocks/NodeFactory";
import {ParagraphNode, TextBlock} from "./blocks/paragraph/ParagraphNode";
import {AbstractProvider} from "./blocks/AbstractProvider";
import {Context} from "./context/Context";
import Footer from "./components/Footer";
import Toolbar from "./components/Toolbar";

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const {providers, style} = properties

    const [page, setPage] = useState(0)

    const [ast, setAst] = useState<{root : RootNode}>(() => {
        return {
            root : new RootNode([new ParagraphNode(new TextBlock(""))])
        }
    })

    return (
        <div className={"wysiwyg"} style={style}>
            <Context value={{providers: providers, ast : ast.root, trigger() {setAst({...ast})}}}>
                <div style={{display : "flex", flexDirection : "column", height : "100%"}}>
                    <Toolbar page={page}/>
                    <div style={{flex : 1}}>
                        {
                            ast.root.blocks.map(node => (
                                    <div key={node.id}>
                                        <NodeFactory node={node}/>
                                    </div>
                                )
                            )
                        }
                    </div>
                    <Footer page={page} onPage={(page) => setPage(page)}/>
                </div>
            </Context>

        </div>
    )
}

namespace Wysiwyg {
    export interface Attributes {
        providers: AbstractProvider<any, any, any>[]
        style? : CSSProperties
    }
}

export default Wysiwyg