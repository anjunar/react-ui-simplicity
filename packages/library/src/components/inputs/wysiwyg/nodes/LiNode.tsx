import React, {useLayoutEffect, useRef} from "react";
import {TreeNode} from "../TreeNode";
import NodeFactory from "./NodeFactory";

function LiNode(properties : LiNode.Attributes) {

    const {ast, callback, astChange} = properties

    const li = useRef<HTMLLIElement>(null);

    useLayoutEffect(() => {
        ast.dom = li.current
    }, [ast]);


    return (
        <li ref={li} className={ast.attributes.clicked ? "editor-selected" : ""}>
            <NodeFactory nodes={ast.children} astChange={astChange}/>
        </li>
    )

}

namespace LiNode {
    export interface Attributes {
        ast : TreeNode
        callback : () => void
        astChange : () => void
    }
}

export default LiNode