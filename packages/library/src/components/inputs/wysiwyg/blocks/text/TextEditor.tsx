import React, {useCallback, useEffect, useRef, useState} from "react"
import TextFactory from "./TextFactory";
import Cursor from "./components/Cursor";
import {AbstractTreeNode, ParagraphTreeNode, RootTreeNode, TextTreeNode} from "./ast/TreeNode";
import EditorContext, {GeneralEvent} from "./components/EditorContext";
import {findNode} from "./ast/TreeNodes";

function TextEditor(properties: TextEditor.Attributes) {

    const {ref} = properties

    const [ast, setAst] = useState(() => {
        return {
            root: new RootTreeNode([new ParagraphTreeNode([])])
        }
    })

    const [cursor, setCursor] = useState<{ current: { container: AbstractTreeNode, offset: number } }>(() => {
        let pNode = ast.root.children[0] as ParagraphTreeNode
        // let textNode = pNode.children[0]
        return {
            current: {
                container: pNode,
                offset: 0
            }
        }
    })

    const [event, setEvent] = useState<{ handled: boolean, instance: GeneralEvent }>({
        handled: false,
        instance: null
    })

    let inputRef = useRef<HTMLTextAreaElement>(null);

    let cursorRef = useRef<HTMLDivElement>(null)

    const eventQueue = useRef<GeneralEvent[]>([]);

    const processQueue = useCallback(() => {
        if (eventQueue.current.length > 0) {
            const lastEvent = eventQueue.current[eventQueue.current.length - 1];
            setEvent({ handled: false, instance: lastEvent });
            eventQueue.current = [];
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(processQueue, 50); // Batch alle 50ms
        return () => clearInterval(interval);
    }, [processQueue]);

    function onContentClick(event: React.MouseEvent) {
        let selection = window.getSelection();

        if (selection && !selection.isCollapsed) {
            return
        } else {
            let caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);

            let selectedNode: AbstractTreeNode;
            if (caretPosition.offsetNode instanceof HTMLElement) {
                selectedNode = findNode(ast.root, (node) => node.dom === caretPosition.offsetNode);
            } else {
                selectedNode = findNode(ast.root, (node) => node.dom.firstChild === caretPosition.offsetNode);
            }

            if (selectedNode) {
                setCursor({
                    current: {
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
        const whiteList = ["ArrowLeft", "ArrowRight"]

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

        let containerFirstChild = cursor.current.container.dom.firstChild;

        if (containerFirstChild instanceof HTMLElement || containerFirstChild === null) {
            range.selectNode(cursor.current.container.dom)
            extracted()
        } else {
            range.setStart(containerFirstChild, cursor.current.offset)
            range.collapse(true)
            extracted()
        }


    }, [cursor]);

    let value = {
        ast: {
            root: ast.root,
            triggerAST() {
                setAst({...ast})
            }
        },
        cursor: {
            ...cursor,
            triggerCursor() {
                setCursor({...cursor})
            }
        },
        event: event
    };

    return (
        <div ref={ref} style={{position: "relative"}} onClick={onContentClick}>
            <EditorContext value={value}>
                <Cursor ref={cursorRef}/>
                <TextFactory node={ast.root}/>
            </EditorContext>
            <textarea ref={inputRef} onKeyDown={onKeyDown} onInput={onInput} onFocus={onFocus} onBlur={onBlur} style={{opacity: 0}}/>
        </div>
    )
}

namespace TextEditor {
    export interface Attributes {
        ref: React.RefObject<HTMLDivElement>
    }
}

export default TextEditor