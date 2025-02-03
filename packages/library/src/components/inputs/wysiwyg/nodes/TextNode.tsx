import React, {useLayoutEffect, useRef} from "react";
import {TextNodeModel} from "../Wysiwyg";

function TextNode(properties : TextNode.Attributes) {

    const {ast, onClickCallback} = properties

    const span = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const selection = window.getSelection();
        if (selection?.rangeCount) {
            if (selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const offset = ast.findIndex(segment => segment.cursor)
                if ((offset > -1 && offset !== range.startOffset) ||offset === 0) {
                    range.setStart(span.current.firstChild, offset + 1);
                    range.collapse(true)
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }

        span.current.firstChild.ast = ast
    }, [ast])

    return (
        <span ref={span} style={{fontWeight: ast[0]?.bold ? "bold" : "", fontStyle: ast[0]?.italic ? "italic" : ""}}>
            {ast.map(segment => segment.text).join("")}
        </span>
    )
}

namespace TextNode {
    export interface Attributes {
        ast: TextNodeModel[]
        onClickCallback : (node : TextNodeModel) => void

    }
}

export default TextNode