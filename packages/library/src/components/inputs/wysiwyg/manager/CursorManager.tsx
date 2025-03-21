import React, {useContext, useDeferredValue, useEffect} from "react"
import {AbstractContainerNode, AbstractNode, TextNode} from "../core/TreeNode";
import {findNode} from "../core/TreeNodes";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";
import {EditorContext} from "../contexts/EditorState";
import {DomContext} from "../contexts/DomState";
import {TokenNode} from "../blocks/code/TokenNode";

function cleanUpAST(node: AbstractNode) {

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

    const {cursorRef, inputRef, contentEditableRef, inspectorRef} = useContext(DomContext)

    const {ast: {root, triggerAST}, cursor} = useContext(EditorContext)

    let cursorDeferredValue = useDeferredValue(cursor);

    function setCursor(container: Node | HTMLElement, range: Range, node: AbstractNode) {

        let abstractNode = node as TextNode

        if (container instanceof HTMLElement) {
            range.selectNode(container);
        } else {
            let offset = cursor.currentCursor.offset > abstractNode.text.length ? abstractNode.text.length : cursor.currentCursor.offset;
            range.setStart(container, offset);
            range.collapse(true);
        }

        let clientRect = range.getBoundingClientRect();
        let contentEditableRect = contentEditableRef.current.getBoundingClientRect();

        cursorRef.current.style.left = clientRect.left - contentEditableRect.left + "px"
        let number = clientRect.top - contentEditableRect.top + contentEditableRef.current.scrollTop;
        cursorRef.current.style.top = number + "px"
        cursorRef.current.style.height = clientRect.height + "px"
        cursorRef.current.style.display = "block"

        inputRef.current?.focus();
        inputRef.current.style.top = number + 6 + "px"
    }

    function positionCursor() {
        if (!cursor.currentCursor) return;

        let range = document.createRange();

        let abstractNode = cursor.currentCursor.container as (TextNode);

        if (abstractNode.dom.isConnected) {
            setCursor(abstractNode.dom, range, abstractNode)
        } else {

            let tokenNode = cursor.currentCursor.container;
            if (tokenNode instanceof TokenNode) {

                function findTokenNodeByIndex(tokens: TokenNode[], targetIndex: number): TokenNode | null {
                    for (let token of tokens) {
                        if (typeof token.text === "string") {
                            if (token.index <= targetIndex && targetIndex < token.index + token.text.length) {
                                return token;
                            }
                        } else {
                            let found = findTokenNodeByIndex(token.text, targetIndex);
                            if (found) return found;
                        }
                    }
                    return null;
                }

                let foundNode = findTokenNodeByIndex(root.flatten.filter(node => node instanceof TokenNode), tokenNode.index + cursor.currentCursor.offset - 1)

                cursor.currentCursor.container = foundNode

                setCursor(foundNode.dom, range, foundNode)
            }


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
                    if (caretPosition.offsetNode instanceof HTMLImageElement) {
                        selectedNode = findNode(root, (node) => node.dom === caretPosition.offsetNode.parentNode);
                    }
                } else {
                    selectedNode = findNode(root, (node) => node.dom === caretPosition.offsetNode);

                    if (!selectedNode) {
                        selectedNode = findNode(root, (node) => {
                            if (node.type === "code") {
                                return node.dom.contains(caretPosition.offsetNode)
                            }
                            return false
                        });
                    }
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
    export interface Attributes {}
}

export default CursorManager