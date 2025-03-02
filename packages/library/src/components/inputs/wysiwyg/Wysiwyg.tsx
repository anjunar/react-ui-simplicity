import "./Wysiwyg.css"
import React, {CSSProperties, useEffect, useState} from "react"
import {RootNode} from "./blocks/shared/RootNode";
import NodeFactory from "./blocks/shared/NodeFactory";
import {ParagraphNode, TextBlock} from "./blocks/paragraph/ParagraphNode";
import {AbstractProvider} from "./blocks/shared/AbstractProvider";
import {Context} from "./context/Context";
import Footer from "./components/Footer";
import Toolbar from "./components/Toolbar";
import {RootTreeNode} from "./blocks/text/ast/TreeNode";

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const {providers, style} = properties

    const [page, setPage] = useState(0)

    const [ast, setAst] = useState<{root : RootNode}>(() => {
        return {
            root : new RootNode([new ParagraphNode(new TextBlock(new RootTreeNode()))])
        }
    })

    useEffect(() => {
        let listener = (event) => {
            event.preventDefault()
            let data = event.clipboardData.getData("text/plain");

            let selection = window.getSelection();
            let rangeAt = selection.getRangeAt(0);
            rangeAt.insertNode(document.createTextNode(data))

            let brElement = selection.anchorNode.parentElement.querySelector("br");

            if (brElement) {
                brElement.remove()
            }
        };

        document.addEventListener("paste", listener)

        return () => {
            document.removeEventListener("paste", listener)
        }
    }, []);

    return (
        <div className={"wysiwyg"} style={style}>
            <Context value={{providers: providers, ast : ast.root, trigger() {setAst({...ast})}}}>
                <div style={{display : "flex", flexDirection : "column", height : "100%"}}>
                    <Toolbar page={page}/>
                    <div style={{flex : 1, overflow : "auto"}}>
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