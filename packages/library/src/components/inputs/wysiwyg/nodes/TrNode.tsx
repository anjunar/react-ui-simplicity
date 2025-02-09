import React, {useLayoutEffect, useRef} from "react";
import {TreeNode} from "../TreeNode";
import NodeFactory from "./NodeFactory";
import TdNode from "./TdNode";

function TrNode(properties : TrNode.Attributes) {

    const {ast, astChange} = properties

    const tr = useRef<HTMLTableRowElement>(null);

    useLayoutEffect(() => {
        ast.dom = tr.current
    }, [ast]);


    return (
        <tr ref={tr} className={ast.attributes.clicked ? "editor-selected" : ""}>
            {
                ast.children.map(child => (
                    <TdNode key={child.id} ast={child} astChange={astChange}/>
                ))
            }
        </tr>
    )

}

namespace TrNode {
    export interface Attributes {
        ast : TreeNode
        astChange : () => void
    }
}

export default TrNode