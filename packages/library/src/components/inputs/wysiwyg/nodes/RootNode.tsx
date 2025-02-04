import React, {useLayoutEffect, useRef} from "react"
import NodeFactory from "./NodeFactory";
import {TreeNode} from "../TreeNode";

function RootNode(properties : RootNode.Attributes) {

    const {ast, astChange} = properties

    const div = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        ast.dom = div.current
    }, [ast]);

    return (
        <div ref={div}>
            {
                ast.children.length === 0 ? <br/> : ""
            }
            <NodeFactory nodes={ast.children} astChange={astChange}/>
        </div>
    )
}

namespace RootNode {
    export interface Attributes {
        ast : TreeNode
        astChange : () => void
    }
}

export default RootNode