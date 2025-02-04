import React, {useEffect, useLayoutEffect, useRef} from "react";
import NodeFactory from "./NodeFactory";
import {TreeNode} from "../TreeNode";

function ParagraphNode(properties: ParagraphNode.Attributes) {

    const {ast, astChange} = properties

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

    useLayoutEffect(() => {
        let listener = (event : KeyboardEvent) => {
            let cursor = ast.find((node : TreeNode) => node.attributes.cursor);
            if (cursor) {
                if (event.key.length === 1) {
                    event.preventDefault()
                    ast.traverse((node) => node.attributes.cursor = false)
                    let indexOf = ast.children.indexOf(cursor);
                    let textNode = new TreeNode("text");
                    textNode.attributes.text = event.key
                    textNode.attributes.cursor = true
                    ast.splice(indexOf + 1, 0, textNode)
                    astChange()
                }
            }
        };
        document.addEventListener("keydown", listener)
        return () => {
            document.removeEventListener("keydown", listener)
        }
    }, []);

    return (
        <div ref={paragraph}>
            {
                ast.children.length === 0 ? <br/> : ""
            }
            <NodeFactory nodes={ast.children} astChange={astChange}/>
        </div>
    )
}

namespace ParagraphNode {
    export interface Attributes {
        ast: TreeNode
        astChange : () => void
    }
}

export default ParagraphNode