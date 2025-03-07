import "./Editor.css"
import React, {useCallback, useDeferredValue, useEffect, useRef, useState} from "react"
import ProcessorFactory from "./processors/ProcessorFactory";
import Cursor from "./ui/Cursor";
import {AbstractNode, RootNode, TextNode} from "./core/TreeNode";
import EditorContext, {GeneralEvent} from "./EditorContext";
import {findNode} from "./core/TreeNodes";
import Toolbar from "./ui/Toolbar";
import Footer from "./ui/Footer";
import {AbstractProvider} from "./blocks/shared/AbstractProvider";
import Inspector from "./ui/Inspector";
import {ParagraphNode} from "./blocks/paragraph/ParagraphNode";

function Editor(properties: Editor.Attributes) {

    const {style, providers} = properties

    const [astState, setAstState] = useState(() => {
        return {
            root: new RootNode([new ParagraphNode([new TextNode()])])
        }
    })

    const [cursorState, setCursorState] = useState<{ currentCursor: { container: AbstractNode, offset: number } }>(() => {
        return {
            currentCursor: null
        }
    })

    let cursorDeferredValue = useDeferredValue(cursorState);

    const [selectionState, setSelectionState] = useState<{
        currentSelection: {
            startContainer: AbstractNode,
            startOffset: number,
            endContainer: AbstractNode,
            endOffset: number
        }
    }>(() => {
        return {
            currentSelection: null
        }
    })

    const [event, setEvent] = useState<{ handled: boolean, instance: GeneralEvent }>({
        handled: false,
        instance: null
    })

    const [page, setPage] = useState(0)

    const [inspector, setInspector] = useState({
        current : null
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
                selectedNode= findNode(astState.root, (node) => node.dom.parentElement === caretPosition.offsetNode);
            } else {
                selectedNode= findNode(astState.root, (node) => node.dom === caretPosition.offsetNode);
            }

            if (selectedNode) {
                setCursorState({
                    currentCursor: {
                        container: selectedNode,
                        offset: caretPosition.offset
                    }
                })
            } else {
                setCursorState({
                    currentCursor: null
                })
            }
            inputRef.current?.focus();
        }

    }

    function onInput(e: React.FormEvent<HTMLTextAreaElement>) {
        let inputEvent = e.nativeEvent as InputEvent;

        setEvent({
            handled : false,
            instance : {
                type: inputEvent.inputType,
                data: inputEvent.data
            }
        })

    }

    function onKeyDown(event: React.KeyboardEvent) {
        const whiteList = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Home", "End"]

        if (whiteList.indexOf(event.key) > -1) {
            setEvent({
                handled : false,
                instance : {
                    type: event.type,
                    data: event.key
                }
            })

        }
    }

    function onFocus() {
        cursorRef.current.style.display = "block"
    }

    function onBlur() {
        cursorRef.current.style.display = "none"
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
                left : adjustedLeftOffset,
                top : topOffset
            }
        })
    }

    useEffect(() => {
        if (!cursorState.currentCursor) return;

        let range = document.createRange();
        let container = cursorState.currentCursor.container.dom;

        if (container instanceof HTMLElement) {
            range.selectNode(container);
        } else {
            range.setStart(container, cursorState.currentCursor.offset);
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
        if (selectionState.currentSelection) {
            let range = document.createRange();
            range.setStart(selectionState.currentSelection.startContainer.dom, selectionState.currentSelection.startOffset);
            range.setEnd(selectionState.currentSelection.endContainer.dom, selectionState.currentSelection.endOffset);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [selectionState]);

    useEffect(() => {

        inputRef.current.value = " " + inputRef.current.value;
        if (cursorState.currentCursor) {
            inputRef.current.focus()
        }


    }, [cursorState]);

    useEffect(() => {

        let onSelectionChange = () => {

            let selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                let rangeAt = selection.getRangeAt(0);

                let start = findNode(astState.root, (node) => node.dom === rangeAt.startContainer)
                let end = findNode(astState.root, (node) => node.dom === rangeAt.endContainer)

                if (!(selectionState.currentSelection &&
                    selectionState.currentSelection.startContainer === start &&
                    selectionState.currentSelection.endContainer === end &&
                    selectionState.currentSelection.startOffset === rangeAt.startOffset &&
                    selectionState.currentSelection.endOffset === rangeAt.endOffset)) {
                    setSelectionState({
                        currentSelection: {
                            startContainer: start,
                            startOffset: rangeAt.startOffset,
                            endContainer: end,
                            endOffset: rangeAt.endOffset
                        }
                    })
                }
            } else {
                setSelectionState({
                    currentSelection: null
                })
            }

        }

        function onDocumentClick() {
            setInspector({
                current: null
            })
        }


        document.addEventListener("selectionchange", onSelectionChange)
        document.addEventListener("click", onDocumentClick)

        return () => {
            document.removeEventListener("selectionchange", onSelectionChange)
            document.removeEventListener("click", onDocumentClick)
        }
    }, [selectionState.currentSelection]);

    let value = {
        ast: {
            ...astState,
            triggerAST() {
                setAstState({...astState})
            }
        },
        providers: providers,
        cursor: {
            ...cursorState,
            triggerCursor() {
                setCursorState({...cursorState})
            }
        },
        selection: {
            ...selectionState,
            triggerSelection() {
                setSelectionState({...selectionState})
            }
        },
        event: event
    };

    return (
        <div ref={ref} className={"editor"} style={{position: "relative", ...style}}>
            <EditorContext value={value}>
                <Toolbar page={page}/>
                <Cursor ref={cursorRef}/>
                {
                    inspector.current && <Inspector style={inspector.current}/>
                }
                <div onClick={onContentClick} onContextMenu={onContextClick} style={{flex: 1, overflow : "auto"}}>
                    <ProcessorFactory node={astState.root}/>
                </div>
                <Footer page={page} onPage={(value) => setPage(value)}/>
            </EditorContext>
            <textarea ref={inputRef}
                      onKeyDown={onKeyDown}
                      onInput={onInput}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      disabled={!! inspector.current}
                      style={{position: "absolute", top: "-2000px", opacity: 1}}/>
        </div>
    )
}

namespace Editor {
    export interface Attributes {
        style?: React.CSSProperties,
        providers : AbstractProvider<any, any, any>[]
    }
}

export default Editor