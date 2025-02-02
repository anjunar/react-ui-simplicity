import React, {useLayoutEffect, useRef} from "react";
import {TextNodeModel} from "../Wysiwyg";

export default function TextNode({ast}: { ast: TextNodeModel[] }) {

    const span = useRef<HTMLSpanElement>(null);

    function getCursorPosition() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;
        const range = selection.getRangeAt(0)
        return range.startOffset - 1
    }

    const onClick = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0)
        if (range.startContainer === span.current.firstChild) {
            let cursorPosition = getCursorPosition();
            let model = ast[cursorPosition];
            if (model) {
                model.cursor = true
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

        document.addEventListener("click", onClick)
        return () => {
            document.removeEventListener("click", onClick)
        }
    }, [ast])

    return (
        <span ref={span} style={{fontWeight: ast[0]?.bold ? "bold" : "", fontStyle: ast[0]?.italic ? "italic" : ""}}>
            {ast.map(segment => segment.text).join("")}
        </span>
    )
}