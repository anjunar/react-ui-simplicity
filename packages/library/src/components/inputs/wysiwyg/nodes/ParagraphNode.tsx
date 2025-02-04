import React, {useEffect, useRef} from "react";
import NodeFactory from "./NodeFactory";
import {TreeNode} from "../TreeNode";

function ParagraphNode(properties: ParagraphNode.Attributes) {

    const {ast} = properties

    const paragraph = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const range = document.createRange();
        range.selectNodeContents(paragraph.current);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        ast.dom = paragraph.current
    }, [ast]);

    return (
        <div ref={paragraph}>
            {
                ast.children.length === 0 ? <br/> : ""
            }
            <NodeFactory nodes={ast.children}/>
        </div>
    )
}

namespace ParagraphNode {
    export interface Attributes {
        ast: TreeNode
    }
}

export default ParagraphNode