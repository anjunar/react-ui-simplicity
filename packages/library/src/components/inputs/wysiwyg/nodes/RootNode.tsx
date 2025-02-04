import React, {useLayoutEffect, useRef} from "react"
import {TreeNode} from "../Wysiwyg";
import NodeFactory from "./NodeFactory";

function RootNode(properties : RootNode.Attributes) {

    const {ast} = properties

    const div = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        div.current.ast = ast
    }, [ast]);

    return (
        <div ref={div}>
            {
                ast.children.length === 0 ? <br/> : ""
            }
            <NodeFactory nodes={ast.children}/>
        </div>
    )
}

namespace RootNode {
    export interface Attributes {
        ast : TreeNode
    }
}

export default RootNode