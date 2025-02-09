import React, {useLayoutEffect, useRef} from "react";
import {TreeNode} from "../TreeNode";
import LiNode from "./LiNode";

function UlNode(properties : UlNode.Attributes) {

    const {ast, astChange} = properties

    const ul = useRef<HTMLUListElement>(null);

    const callbackHandler = () => {
        let li = new TreeNode("li");
        li.appendChild(new TreeNode("p"))
        ast.appendChild(li)
        astChange()
    }

    useLayoutEffect(() => {
        ast.dom = ul.current
    }, [ast]);



    return (
        <ul ref={ul} className={ast.attributes.clicked ? "editor-selected" : ""}>
            {
                ast.children.map(node => <LiNode callback={callbackHandler} key={node.id} ast={node} astChange={astChange}/>)
            }
        </ul>
    )

}

namespace UlNode {
    export interface Attributes {
        ast : TreeNode
        astChange : () => void
    }
}

export default UlNode