import React, {useLayoutEffect, useRef} from "react";
import {TreeNode} from "../TreeNode";
import NodeFactory from "./NodeFactory";

function TdNode(properties : TdNode.Attributes) {

    const {ast, astChange} = properties

    const td = useRef<HTMLTableCellElement>(null);

    useLayoutEffect(() => {
        ast.dom = td.current
    }, [ast]);


    return (
        <td ref={td} className={ast.attributes.clicked ? "editor-selected" : ""}>
            <NodeFactory nodes={ast.children} astChange={astChange}/>
        </td>
    )

}

namespace TdNode {
    export interface Attributes {
        ast : TreeNode
        astChange : () => void
    }
}

export default TdNode