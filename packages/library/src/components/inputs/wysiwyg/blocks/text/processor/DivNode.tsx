import React, {useEffect, useRef} from "react"
import {ParagraphTreeNode} from "../ast/TreeNode";
import TextFactory from "../TextFactory";

function DivNode(properties: DivNode.Attributes) {

    const {node} = properties

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef}>
            {
                node.children.map(node => <TextFactory key={node.id} node={node}/>)
            }
        </div>
    )
}

namespace DivNode {
    export interface Attributes {
        node : ParagraphTreeNode
    }
}

export default DivNode