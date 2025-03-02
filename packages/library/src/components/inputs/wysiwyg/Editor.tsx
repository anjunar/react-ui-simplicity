import "./Editor.css"
import React, {useCallback, useEffect, useRef, useState} from "react"
import EditorFactory from "./processor/EditorFactory";
import Cursor from "./components/Cursor";
import {AbstractNode, ParagraphNode, RootNode} from "./ast/TreeNode";
import EditorContext, {GeneralEvent} from "./components/EditorContext";
import {findNode} from "./ast/TreeNodes";
import Toolbar from "./components/Toolbar";

function Editor(properties: Editor.Attributes) {

    const {style} = properties

    const [astState, setAstState] = useState(() => {
        return {
            root: new RootNode([new ParagraphNode([])])
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

    let ref = useRef<HTMLDivElement>(null)

    let inputRef = useRef<HTMLTextAreaElement>(null);

    let cursorRef = useRef<HTMLDivElement>(null)

    const eventQueue = useRef<GeneralEvent[]>([]);

    const processQueue = useCallback(() => {
        if (eventQueue.current.length > 0) {
            const lastEvent = eventQueue.current.pop()
            setEvent({handled: false, instance: lastEvent});
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(processQueue, 50)
        return () => clearInterval(interval)
    }, [processQueue]);

    function onContentClick(event: React.MouseEvent) {
        let selection = window.getSelection();

        if (selection && !selection.isCollapsed) {
            return
        } else {
            let caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);

            let selectedNode: AbstractNode;
            if (caretPosition.offsetNode instanceof HTMLElement) {
                selectedNode = findNode(astState.root, (node) => node.dom === caretPosition.offsetNode);
            } else {
                selectedNode = findNode(astState.root, (node) => node.dom.firstChild === caretPosition.offsetNode);
            }

            if (selectedNode) {
                setCursorState({
                    currentCursor: {
                        container: selectedNode,
                        offset: caretPosition.offset
                    }
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

    useEffect(() => {

        if (cursorState.currentCursor) {
            function extracted() {
                let clientRect = range.getBoundingClientRect();

                const editorRect = ref.current.getBoundingClientRect();
                const topOffset = clientRect.top - editorRect.top + ref.current.scrollTop;
                const leftOffset = clientRect.left - editorRect.left + ref.current.scrollLeft;

                cursorRef.current.style.left = leftOffset + "px"
                cursorRef.current.style.top = topOffset + "px"
                cursorRef.current.style.height = clientRect.height + "px"
            }

            let range = document.createRange();

            let containerFirstChild = cursorState.currentCursor.container.dom.firstChild;

            if (containerFirstChild instanceof HTMLElement || containerFirstChild === null) {
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
            range.setStart(selectionState.currentSelection.startContainer.dom.firstChild, selectionState.currentSelection.startOffset);
            range.setEnd(selectionState.currentSelection.endContainer.dom.firstChild, selectionState.currentSelection.endOffset);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [selectionState]);

    useEffect(() => {

        let onSelectionChange = () => {

            let selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                let rangeAt = selection.getRangeAt(0);

                let start = findNode(astState.root, (node) => node.dom.firstChild === rangeAt.startContainer)
                let end = findNode(astState.root, (node) => node.dom.firstChild === rangeAt.endContainer)

                setSelectionState({
                    currentSelection: {
                        startContainer: start,
                        startOffset: rangeAt.startOffset,
                        endContainer: end,
                        endOffset: rangeAt.endOffset
                    }
                })
            } else {
                setSelectionState({
                    currentSelection: null
                })
            }

        }

        document.addEventListener("selectionchange", onSelectionChange)

        return () => {
            return document.removeEventListener("selectionchange", onSelectionChange)
        }
    }, []);

    let value = {
        ast: {
            ...astState,
            triggerAST() {
                setAstState({...astState})
            }
        },
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
        <div ref={ref} className={"editor"} style={{position: "relative", ...style}} onClick={onContentClick}>
            <EditorContext value={value}>
                <Toolbar/>
                <Cursor ref={cursorRef}/>
                <EditorFactory node={astState.root}/>
            </EditorContext>
            <textarea ref={inputRef} onKeyDown={onKeyDown} onInput={onInput} onFocus={onFocus} onBlur={onBlur} style={{position: "absolute", left: "-9999px", opacity: 0}}/>
        </div>
    )
}

namespace Editor {
    export interface Attributes {
        style?: React.CSSProperties,
    }
}

export default Editor