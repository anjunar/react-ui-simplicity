import React, {useContext, useEffect, useRef} from "react"
import {TextTreeNode} from "../AST";
import EditorContext from "../components/EditorContext";

function SpanNode(properties: SpanNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {container, offset, triggerCursor} , event : {handled, instance}} = useContext(EditorContext)

    const spanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = spanRef.current
    }, [node]);

    useEffect(() => {

        if (instance) {
            let event = instance

            switch (event.inputType) {
                case "insertCompositionText" :
                case "insertText" : {

                    let node = container as TextTreeNode

                    let start = node.text.substring(0, offset)
                    let end = node.text.substring(offset)

                    node.text = start + event.data + end
                    let newOffset = offset + event.data.length;

                    triggerAST()
                    triggerCursor({container : node, offset : newOffset})

                }
                    break
            }

        }

    }, [instance]);

    return (
        <span ref={spanRef}>{node.text.length === 0 ? <br/> : node.text}</span>
    )
}

namespace SpanNode {
    export interface Attributes {
        node : TextTreeNode
    }
}

export default SpanNode