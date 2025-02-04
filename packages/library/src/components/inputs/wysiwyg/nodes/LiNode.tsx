import React, {useLayoutEffect, useRef} from "react";
import {TreeNode} from "../TreeNode";
import NodeFactory from "./NodeFactory";
import {node} from "webpack";

function LiNode(properties : LiNode.Attributes) {

    const {ast, callback, astChange} = properties

    const li = useRef<HTMLLIElement>(null);

    useLayoutEffect(() => {
        ast.dom = li.current
    }, [ast]);

    useLayoutEffect(() => {
        let listener = (event : KeyboardEvent) => {
            let cursor = ast.find((node : TreeNode) => node.attributes.cursor);

            if (cursor?.nextSibling === null) {
                if (event.key === "Enter") {
                    callback()
                }
            }
        };
        document.addEventListener("keydown", listener)
        return () => {
            document.removeEventListener("keydown", listener)
        }
    }, []);

    return (
        <li ref={li}>
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