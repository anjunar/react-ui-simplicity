import React, {useContext, useEffect, useRef} from "react"
import {ParagraphTreeNode, RootTreeNode, TextTreeNode} from "../ast/TreeNode";
import TextFactory from "../TextFactory";
import EditorContext from "../components/EditorContext";
import DivNode from "./DivNode";
import {onArrowLeft, onArrowRight} from "./Nodes";

function RootNode(properties: RootNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {currentCursor, triggerCursor}, event} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (event.instance && node === currentCursor.container && ! event.handled) {
            let e = event.instance
            let node = currentCursor.container as ParagraphTreeNode

            switch (e.type) {
                case "insertCompositionText" :
                case "insertText" : {

                    if (node.children.length === 0) {
                        let textNode = new TextTreeNode(e.data)
                        let paragraphNode = new ParagraphTreeNode([textNode])
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
        <div ref={divRef}>
            {
                node.children.map(node => (<TextFactory key={node.id} node={node}/>))
            }
        </div>
    )
}

namespace RootNode {
    export interface Attributes {
        node: RootTreeNode
    }
}

export default RootNode