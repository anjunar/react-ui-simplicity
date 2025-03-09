import React, {useContext, useDeferredValue, useEffect} from "react"
import {AbstractNode} from "../core/TreeNode";
import {findNode} from "../core/TreeNodes";
import {EditorContext} from "../EditorState";

function CursorManager(properties: CursorManager.Attributes) {

    const {cursorRef, inputRef, editorRef, contentEditableRef, inspectorRef} = properties

    const {ast, event, cursor, providers, selection} = useContext(EditorContext)

    let cursorDeferredValue = useDeferredValue(cursor);

    useEffect(() => {
        if (!cursor.currentCursor) return;

        let range = document.createRange();
        let container = cursor.currentCursor.container.dom;

        if (container instanceof HTMLElement) {
            range.selectNode(container);
        } else {
            range.setStart(container, cursor.currentCursor.offset);
            range.collapse(true);
        }

        let clientRect = range.getBoundingClientRect();
        let editorRect = editorRef.current.getBoundingClientRect();

        cursorRef.current.style.left = clientRect.left - editorRect.left + editorRef.current.scrollLeft + "px"
        cursorRef.current.style.top = clientRect.top - editorRect.top + editorRef.current.scrollTop + "px"
        cursorRef.current.style.height = clientRect.height + "px"
        cursorRef.current.style.display = "block"

        inputRef.current?.focus();
    }, [cursorDeferredValue]);

    useEffect(() => {

        inputRef.current.value = " " + inputRef.current.value;
        if (cursor.currentCursor) {
            inputRef.current.focus()
        }


    }, [cursor]);

    useEffect(() => {
        function onFocus() {
            cursorRef.current.style.display = "block"
        }

        function onBlur() {
            cursorRef.current.style.display = "none"
        }

        inputRef.current.addEventListener("focus", onFocus)
        inputRef.current.addEventListener("blur", onBlur)

        return () => {
            inputRef.current.removeEventListener("focus", onFocus)
            inputRef.current.removeEventListener("blur", onBlur)
        }
    }, [inputRef.current]);

    useEffect(() => {

        function onContentClick(event: MouseEvent) {
            if (event.composedPath().includes(inspectorRef.current)) {
                return;
            }
            let selection = window.getSelection();

            if (selection && !selection.isCollapsed) {
                return
            } else {
                let caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);

                let selectedNode: AbstractNode
                if (caretPosition.offsetNode instanceof HTMLSpanElement) {
                    selectedNode = findNode(ast.root, (node) => node.dom.parentElement === caretPosition.offsetNode);
                } else {
                    selectedNode = findNode(ast.root, (node) => node.dom === caretPosition.offsetNode);
                }

                if (selectedNode) {
                    cursor.currentCursor = {
                        container: selectedNode,
                        offset: caretPosition.offset
                    }
                } else {
                    cursor.currentCursor = null
                }

                cursor.triggerCursor()

                inputRef.current?.focus();
            }

        }

        contentEditableRef.current.addEventListener("click", onContentClick)

        return () => {
            contentEditableRef.current.removeEventListener("click", onContentClick)
        }
    }, [contentEditableRef.current]);


    return (
        <div></div>
    )
}

namespace CursorManager {
    export interface Attributes {
        cursorRef : React.RefObject<HTMLDivElement>
        inputRef : React.RefObject<HTMLTextAreaElement>
        editorRef : React.RefObject<HTMLDivElement>
        contentEditableRef : React.RefObject<HTMLDivElement>
        inspectorRef : React.RefObject<HTMLDivElement>
    }
}

export default CursorManager