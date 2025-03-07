import "./Editor.css"
import React, {useCallback, useEffect, useRef, useState} from "react"
import ProcessorFactory from "./processors/ProcessorFactory";
import Cursor from "./ui/Cursor";
import {AbstractNode, ParagraphNode, RootNode, TextNode} from "./core/TreeNode";
import EditorContext, {GeneralEvent} from "./EditorContext";
import {findNode} from "./core/TreeNodes";
import Toolbar from "./ui/Toolbar";
import Footer from "./ui/Footer";
import {AbstractProvider} from "./blocks/shared/AbstractProvider";
import Inspector from "./ui/Inspector";

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

    let ref = useRef<HTMLDivElement>(null)

    let inputRef = useRef<HTMLTextAreaElement>(null);

    let cursorRef = useRef<HTMLDivElement>(null)

    let inspectorRef = useRef<HTMLDivElement>(null)

    const eventQueue = useRef<GeneralEvent[]>([]);

    const processQueue = useCallback(() => {
        if (eventQueue.current.length > 0) {
            const lastEvent = eventQueue.current.pop()
            setEvent({handled: false, instance: lastEvent});
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(processQueue, 100)
        return () => clearInterval(interval)
    }, [processQueue]);

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
        eventQueue.current.push({
            type: inputEvent.inputType,
            data: inputEvent.data
        });
    }

    function onKeyDown(event: React.KeyboardEvent) {
        const whiteList = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete"]

        if (whiteList.indexOf(event.key) > -1) {
            eventQueue.current.push({
                type: event.type,
                data: event.key
            });
        }
    }

    function onFocus() {
        cursorRef.current.style.display = "block"
    }

    function onBlur() {
        cursorRef.current.style.display = "none"
    }

    function onContentDoubleClick(event: React.MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        const inspector = inspectorRef.current;
        const container = ref.current;

        const topOffset = event.clientY - container.offsetTop + container.scrollTop;
        const leftOffset = event.clientX - container.offsetLeft + container.scrollLeft;

        inspector.style.display = "block";

        inspector.style.top = topOffset + "px";
        // inspector.style.transform = "translateX(-50%)";

        const inspectorWidth = inspector.offsetWidth;
        const containerWidth = container.offsetWidth;

        let adjustedLeftOffset = leftOffset;

        if (leftOffset - inspectorWidth / 2 < 0) {
            adjustedLeftOffset = inspectorWidth / 2;
        }
        else if (leftOffset + inspectorWidth / 2 > containerWidth) {
            adjustedLeftOffset = containerWidth - inspectorWidth / 2;
        }

        inspector.style.left = adjustedLeftOffset + "px";
    }

    useEffect(() => {

        if (cursorState.currentCursor) {
            function extracted() {
                let clientRect = range.getBoundingClientRect();

                const editorRect = ref.current.getBoundingClientRect();
                const topOffset = clientRect.top - editorRect.top + ref.current.scrollTop;
                const leftOffset = clientRect.left - editorRect.left + ref.current.scrollLeft;

                cursorRef.current.style.left = leftOffset + clientRect.width +  "px"
                cursorRef.current.style.top = topOffset + "px"
                cursorRef.current.style.height = clientRect.height + "px"
                cursorRef.current.style.display = "block"
            }

            let range = document.createRange();

            let containerFirstChild = cursorState.currentCursor.container.dom;

            if (containerFirstChild instanceof HTMLElement) {
                range.selectNode(cursorState.currentCursor.container.dom)
                extracted()
            } else {
                range.setStart(containerFirstChild, cursorState.currentCursor.offset)
                range.collapse(true)
                extracted()
            }
        }

    }, [cursorState]);

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
            inspectorRef.current.style.display = "none"
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
                <Inspector ref={inspectorRef}/>
                <div onClick={onContentClick} onDoubleClick={onContentDoubleClick} style={{flex: 1, overflow : "auto"}}>
                    <ProcessorFactory node={astState.root}/>
                </div>
                <Footer page={page} onPage={(value) => setPage(value)}/>
            </EditorContext>
            <textarea ref={inputRef}
                      onKeyDown={onKeyDown}
                      onInput={onInput}
                      onFocus={onFocus}
                      onBlur={onBlur}
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