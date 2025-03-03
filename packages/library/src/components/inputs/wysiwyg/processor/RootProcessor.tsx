import React, {useContext, useEffect, useRef} from "react"
import {ParagraphNode, RootNode, TextNode} from "../core/TreeNode";
import EditorFactory from "./EditorFactory";
import EditorContext from "../ui/EditorContext";
import DivProcessor from "./DivProcessor";
import {onArrowLeft, onArrowRight} from "./Processors";

function RootProcessor(properties: RootNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {currentCursor, triggerCursor}, event} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (event.instance && node === currentCursor.container && ! event.handled) {
            let e = event.instance
            let node = currentCursor.container as ParagraphNode

            switch (e.type) {
                case "insertCompositionText" :
                case "insertText" : {

                    if (node.children.length === 0) {
                        let textNode = new TextNode(e.data)
                        let paragraphNode = new ParagraphNode([textNode])
                        node.appendChild(paragraphNode)

                        currentCursor.container = textNode
                        currentCursor.offset = e.data.length

                        event.handled = true

                        triggerAST()
                        triggerCursor()

                    }

                }
                    break
                case "keydown" : {

                    switch (e.data) {
                        case "ArrowLeft" : {
                            onArrowLeft(root, currentCursor);

                            event.handled = true

                            triggerCursor()

                        } break
                        case "ArrowRight" : {
                            onArrowRight(root, currentCursor);

                            event.handled = true

                            triggerCursor()
                        }
                    }

                } break
            }

        }

    }, [event.instance]);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef} className={"root"}>
            {
                node.children.map(node => (<EditorFactory key={node.id} node={node}/>))
            }
        </div>
    )
}

namespace RootNode {
    export interface Attributes {
        node: RootNode
    }
}

export default RootProcessor