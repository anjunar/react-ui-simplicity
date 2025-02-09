import React, {useLayoutEffect, useRef} from "react";
import {TreeNode} from "../TreeNode";

function TextNode(properties : TextNode.Attributes) {

    const {ast, astChange} = properties

    const span = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const selection = window.getSelection();
        if (selection?.rangeCount) {
            if (selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const offset = ast.findIndex(segment => segment.attributes.cursor)
                if (offset > -1) {
                    range.setStart(span.current.firstChild, offset + 1);
                    range.collapse(true)
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }

        for (const node of ast) {
            node.dom = span.current.firstChild
        }
    }, [ast])

    return (
        <span className={ast[0].attributes.clicked ? "editor-selected" : ""} ref={span} style={{fontWeight: ast[0]?.attributes.bold ? "bold" : "", fontStyle: ast[0]?.attributes.italic ? "italic" : ""}}>
            {ast.map(segment => segment.attributes.text).join("")}
        </span>
    )
}

namespace TextNode {
    export interface Attributes {
        ast: TreeNode[]
        astChange : () => void
    }
}

export default TextNode