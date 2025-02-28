import React, {useEffect, useRef} from "react"
import {TextTreeNode} from "../AST";

function SpanNode(properties: SpanNode.Attributes) {

    const {node} = properties

    const spanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = spanRef.current
    }, [node]);

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