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

    const onKeyDown = (event: KeyboardEvent) => {

        let cursorPosition = getCursorPosition()

        switch (event.key) {
            case "Backspace" : {
                ast.splice(cursorPosition, 1)
                ast[cursorPosition - 1].cursor = true
            } break
            case "ArrowLeft" : {
                ast[cursorPosition].cursor = false
                ast[cursorPosition - 1].cursor = true
            } break
            case "ArrowRight" : {
                ast[cursorPosition].cursor = false
                ast[cursorPosition + 1].cursor = true
            } break
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
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("click", onClick)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [ast])

    return (
        <span ref={span} style={{fontWeight: ast[0].bold ? "bold" : ""}}>
            {ast.map(segment => segment.text).join("")}
        </span>
    )
}