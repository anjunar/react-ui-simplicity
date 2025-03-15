import React, {useContext, useEffect} from "react"
import {AbstractNode} from "../../shared/core/TreeNode";
import {findNode} from "../../shared/core/TreeNodes";
import {WysiwygContext} from "../../shared/contexts/WysiwygState";
import {EditorContext} from "../../shared/contexts/EditorState";

function InspectorManager(properties: InspectorManager.Attributes) {

    const {contentEditableRef, inputRef, editorRef, inspectorRef} = properties

    const {cursor} = useContext(WysiwygContext)

    const {ast} = useContext(EditorContext)

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

        function onContextClick(event: MouseEvent) {
            event.stopPropagation();
            event.preventDefault();

            onContentClick(event)

            const container = editorRef.current;

            let viewport = document.getElementById("viewport") || document.querySelector("body");
            let boundingClientRect = viewport.getBoundingClientRect();

            const topOffset = event.clientY - container.offsetTop + container.scrollTop - boundingClientRect.top + 12;
            const leftOffset = event.clientX - container.offsetLeft + container.scrollLeft - boundingClientRect.left;

            const inspectorWidth = 150
            const containerWidth = container.offsetWidth;

            let adjustedLeftOffset = leftOffset;

            if (leftOffset + inspectorWidth > containerWidth) {
                adjustedLeftOffset = containerWidth - inspectorWidth;
            }

            inspectorRef.current.style.left = adjustedLeftOffset + "px"
            inspectorRef.current.style.top = topOffset + "px"
            inspectorRef.current.style.display = "block"
            inputRef.current.disabled = true
        }

        function onDocumentClick() {
            inspectorRef.current.style.display = "none"
            inputRef.current.disabled = false
        }

        document.addEventListener("click", onDocumentClick)
        contentEditableRef.current.addEventListener("contextmenu", onContextClick)
        return () => {
            document.removeEventListener("click", onDocumentClick)
            contentEditableRef.current?.removeEventListener("contextmenu", onContextClick)
        }
    }, []);

    return (
        <></>
    )
}

namespace InspectorManager {
    export interface Attributes {
        editorRef: React.RefObject<HTMLDivElement>
        inputRef: React.RefObject<HTMLTextAreaElement>
        contentEditableRef: React.RefObject<HTMLDivElement>
        inspectorRef: React.RefObject<HTMLDivElement>
    }
}

export default InspectorManager
