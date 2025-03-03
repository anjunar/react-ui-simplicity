import "./Wysiwyg.css"
import React, {CSSProperties, useEffect, useState} from "react"
import {RootNode} from "./blocks/shared/RootNode";
import NodeFactory from "./blocks/shared/NodeFactory";
import {ParagraphNode, TextBlock} from "./blocks/paragraph/ParagraphNode";
import {AbstractProvider} from "./blocks/shared/AbstractProvider";
import {WysiwygContext} from "./context/WysiwygContext";
import {BlockContext} from "./context/BlockContext";
import Footer from "./ui/Footer";
import Toolbar from "./ui/Toolbar";
import {RootTreeNode} from "./blocks/text/core/TreeNode";

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
            <WysiwygContext value={{providers: providers, ast : ast.root, trigger() {setAst({...ast})}}}>
                <div style={{display : "flex", flexDirection : "column", height : "100%"}}>
                    <Toolbar page={page}/>
                    <div style={{flex : 1, overflow : "auto"}}>
                        {
                            ast.root.blocks.map(node => (
                                    <div key={node.id}>
                                        <BlockContext value={{node : node}}>
                                            <NodeFactory node={node}/>
                                        </BlockContext>
                                    </div>
                                )
                            )
                        }
                    </div>
                    <Footer page={page} onPage={(page) => setPage(page)}/>
                </div>
            </WysiwygContext>

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