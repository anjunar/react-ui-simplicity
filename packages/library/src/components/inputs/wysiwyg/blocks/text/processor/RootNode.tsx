import React, {useEffect, useRef} from "react"
import {RootTreeNode} from "../ast/TreeNode";
import TextFactory from "../TextFactory";

function RootNode(properties: RootNode.Attributes) {

    const {node} = properties

    const divRef = useRef<HTMLDivElement>(null);

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