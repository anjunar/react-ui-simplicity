import React, {useContext, useDeferredValue, useEffect} from "react"
import {AbstractContainerNode, AbstractNode} from "../../shared/core/TreeNode";
import {findNode} from "../../shared/core/TreeNodes";
import {EditorContext} from "../../EditorState";
import {ParagraphNode} from "../../shared/blocks/paragraph/ParagraphNode";

function cleanUpAST(node : AbstractNode) {

    if (node instanceof ParagraphNode) {
        node.mergeAdjacentTextNodes()
    }


    if (node instanceof AbstractContainerNode) {
        for (const child of node.children) {
            cleanUpAST(child)
        }
    }

}

function CursorManager(properties: CursorManager.Attributes) {

    const {cursorRef, inputRef, editorRef, contentEditableRef, inspectorRef} = properties

    const {ast : {root, triggerAST}, cursor} = useContext(EditorContext)

    let cursorDeferredValue = useDeferredValue(cursor);

    function positionCursor() {
        if (!cursor.currentCursor) return;

        let range = document.createRange();
        let container = cursor.currentCursor.container.dom;

        if (container.isConnected) {
            if (container instanceof HTMLElement) {
                range.selectNode(container);
            } else {
                range.setStart(container, cursor.currentCursor.offset);
                range.collapse(true);
            }

            let clientRect = range.getBoundingClientRect();
            let editorRect = editorRef.current.getBoundingClientRect();

            let number = clientRect.top - editorRect.top + editorRef.current.scrollTop;

            cursorRef.current.style.left = clientRect.left - editorRect.left + editorRef.current.scrollLeft + "px"
            cursorRef.current.style.top = number + "px"
            cursorRef.current.style.height = clientRect.height + "px"
            cursorRef.current.style.display = "block"

            inputRef.current?.focus();
            inputRef.current.style.top = number + 6 + "px"


        }
    }

    useEffect(() => {
        positionCursor();
    }, [cursorDeferredValue]);

    useEffect(() => {
        function onFocus() {
            cursorRef.current.style.display = "block"
        }

        function onBlur() {
            if (cursorRef.current) {
                cursorRef.current.style.display = "none"
            }
        }

        inputRef.current.addEventListener("focus", onFocus)
        inputRef.current.addEventListener("blur", onBlur)

        return () => {
            inputRef.current?.removeEventListener("focus", onFocus)
            inputRef.current?.removeEventListener("blur", onBlur)
        }
    }, [inputRef.current, cursorRef.current]);

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
                if (caretPosition.offsetNode instanceof HTMLElement) {
                    if (caretPosition.offsetNode instanceof HTMLSpanElement) {
                        selectedNode = findNode(root, (node) => node.dom.parentElement === caretPosition.offsetNode);
                    }
                    if (caretPosition.offsetNode instanceof HTMLImageElement) {
                        selectedNode = findNode(root, (node) => node.dom === caretPosition.offsetNode.parentNode);
                    }
                } else {
                    selectedNode = findNode(root, (node) => node.dom === caretPosition.offsetNode);
                }

                if (selectedNode) {
                    cursor.currentCursor = {
                        container: selectedNode,
                        offset: caretPosition.offset
                    }
                } else {
                    cursor.currentCursor = null
                }

                cleanUpAST(root)

                cursor.triggerCursor()

                inputRef.current?.focus();



            }

        }

        let onScroll = () => {
            positionCursor()
        };

        contentEditableRef.current.addEventListener("scroll", onScroll)
        contentEditableRef.current.addEventListener("click", onContentClick)
        return () => {
            contentEditableRef.current?.removeEventListener("scroll", onScroll)
            contentEditableRef.current?.removeEventListener("click", onContentClick)
        }
    }, [contentEditableRef.current]);


    return (
        <></>
    )
}

namespace CursorManager {
    export interface Attributes {
        cursorRef: React.RefObject<HTMLDivElement>
        inputRef: React.RefObject<HTMLTextAreaElement>
        editorRef: React.RefObject<HTMLDivElement>
        contentEditableRef: React.RefObject<HTMLDivElement>
        inspectorRef: React.RefObject<HTMLDivElement>
    }
}

export default CursorManager