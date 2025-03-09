import "./Editor.css"
import React, {useContext, useDeferredValue, useEffect, useRef, useState} from "react"
import ProcessorFactory from "./processors/ProcessorFactory";
import Cursor from "./ui/Cursor";
import {AbstractNode} from "./core/TreeNode";
import {findNode} from "./core/TreeNodes";
import Toolbar from "./ui/Toolbar";
import Footer from "./ui/Footer";
import {AbstractProvider} from "./blocks/shared/AbstractProvider";
import Inspector from "./ui/Inspector";
import EditorContext from "./EditorContext";
import SelectionManager from "./SelectionManager";
import EditorInput from "./EditorInput";

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const {ast, event, cursor, providers, selection} = useContext(EditorContext)

    let cursorDeferredValue = useDeferredValue(cursor);

    const [page, setPage] = useState(0)

    const [inspector, setInspector] = useState({
        current: null
    })

    let ref = useRef<HTMLDivElement>(null)

    let inputRef = useRef<HTMLTextAreaElement>(null);

    let cursorRef = useRef<HTMLDivElement>(null)

    function onContentClick(event: React.MouseEvent) {
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

    function onContextClick(event: React.MouseEvent) {
        onContentClick(event)

        event.stopPropagation();
        event.preventDefault();

        const container = ref.current;

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

        setInspector({
            current: {
                left: adjustedLeftOffset,
                top: topOffset
            }
        })
    }

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
        let editorRect = ref.current.getBoundingClientRect();

        cursorRef.current.style.left = clientRect.left - editorRect.left + ref.current.scrollLeft + "px"
        cursorRef.current.style.top = clientRect.top - editorRect.top + ref.current.scrollTop + "px"
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
        function onDocumentClick() {
            setInspector({
                current: null
            })
        }

        document.addEventListener("click", onDocumentClick)
        return () => {
            document.removeEventListener("click", onDocumentClick)
        }
    }, []);

    return (
        <div ref={ref} className={"editor"} style={{position: "relative", ...style}}>
            <Toolbar page={page}/>
            <Cursor ref={cursorRef}/>
            <SelectionManager/>
            <EditorInput inputRef={inputRef} inspector={inspector}/>
            {
                inspector.current && <Inspector style={inspector.current}/>
            }
            <div onClick={onContentClick} onContextMenu={onContextClick} style={{flex: 1, overflow: "auto"}}>
                <ProcessorFactory node={ast.root}/>
            </div>
            <Footer page={page} onPage={(value) => setPage(value)}/>
        </div>
    )
}

namespace Editor {
    export interface Attributes {
        style?: React.CSSProperties,
    }
}

export default Editor