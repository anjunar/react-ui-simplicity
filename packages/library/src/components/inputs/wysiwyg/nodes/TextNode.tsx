import React, {useLayoutEffect, useRef} from "react";
import {TextNodeModel} from "../Wysiwyg";

function TextNode(properties : TextNode.Attributes) {

    const {ast, onClickCallback} = properties

    const span = useRef<HTMLSpanElement>(null);

    function getCursorPosition() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;
        const range = selection.getRangeAt(0)
        return range.startOffset - 1
    }

    const onClick = (event : any) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0)
        if (range.startContainer === span.current.firstChild) {
            let cursorPosition = getCursorPosition();
            let model = ast[cursorPosition];
            if (model) {
                onClickCallback(model)
            }
        }
    }

    useLayoutEffect(() => {
        const selection = window.getSelection();
        if (selection?.rangeCount) {
            if (selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const offset = ast.findIndex(segment => segment.cursor)
                if (offset > -1) {
                    range.setStart(span.current.firstChild, offset + 1);
                    range.collapse(true)
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }

        for (const element of ast) {
            element.node = span.current.firstChild
        }

        span.current.parentElement.addEventListener("click", onClick)

        return () => {
            span.current.parentElement.removeEventListener("click", onClick)
        }

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