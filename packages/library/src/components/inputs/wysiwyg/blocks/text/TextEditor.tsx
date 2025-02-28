import React, {useEffect, useRef, useState} from "react"
import TextFactory from "./TextFactory";
import Cursor from "./components/Cursor";
import {AbstractContainerTreeNode, AbstractTreeNode, ParagraphTreeNode, RootTreeNode, TextTreeNode} from "./AST";
import EditorContext from "./components/EditorContext";

function findNode(node: AbstractTreeNode, callback: (node: AbstractTreeNode) => boolean) {

    if (callback(node)) {
        return node
    }

    if (node instanceof AbstractContainerTreeNode) {
        for (const child of node.children) {
            let selectedNode = findNode(child, callback);
            if (selectedNode) {
                return selectedNode
            }
        }
    }
}

function TextEditor(properties: TextEditor.Attributes) {

    const {ref} = properties

    const [ast, setAst] = useState(() => {
        return {
            root: new RootTreeNode([new ParagraphTreeNode([new TextTreeNode("")])])
        }
    })

    const [cursor, setCursor] = useState<{ container: AbstractTreeNode, offset: number }>(() => {
        let pNode = ast.root.children[0] as ParagraphTreeNode
        let textNode = pNode.children[0]
        return {
            container: textNode,
            offset: 0
        }
    })

    const [event, setEvent] = useState<{handled : boolean, instance : InputEvent}>({
        handled : false,
        instance : null
    })

    let inputRef = useRef<HTMLInputElement>(null);

    let cursorRef = useRef<HTMLDivElement>(null)

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
                    container: selectedNode,
                    offset: caretPosition.offset
                })
            }
            inputRef.current?.focus();
        }

    }

    function onInput(e: React.FormEvent<HTMLInputElement>) {
        let event = e.nativeEvent as InputEvent
        setEvent({
            handled : false,
            instance : event
        })
    }

    useEffect(() => {
        let range = document.createRange();

        let startFirstChild = cursor.container.dom.firstChild;
        let endFistChild = cursor.container.dom.firstChild;

        if (startFirstChild instanceof HTMLBRElement && endFistChild instanceof HTMLBRElement) {
            range.selectNode(cursor.container.dom)
        } else {
            range.setStart(startFirstChild, cursor.offset)
            range.collapse(true)
        }
        let clientRect = range.getBoundingClientRect();

        const editorRect = ref.current.getBoundingClientRect();
        const topOffset = clientRect.top - editorRect.top + ref.current.scrollTop;
        const leftOffset = clientRect.left - editorRect.left + ref.current.scrollLeft;

        cursorRef.current.style.left = leftOffset + "px"
        cursorRef.current.style.top = topOffset + "px"
        cursorRef.current.style.height = clientRect.height + "px"
    }, [cursor]);

    useEffect(() => {
        inputRef.current.addEventListener("focus", () => {
            cursorRef.current.style.display = "block"
        })

        inputRef.current.addEventListener("blur", () => {
            cursorRef.current.style.display = "none"
        })
    }, [inputRef]);

    let value = {
        ast: {
            root: ast.root,
            triggerAST() {
                setAst({...ast})
            }
        },
        cursor: {
            container: cursor.container,
            offset: cursor.offset,
            triggerCursor(value : {container : AbstractTreeNode, offset : number}) {
                setCursor(value)
            }
        },
        event : event
    };

    return (
        <div ref={ref} style={{position: "relative"}} onClick={onContentClick}>
            <EditorContext value={value}>
                <Cursor ref={cursorRef}/>
                <TextFactory node={ast.root}/>
            </EditorContext>
            <input ref={inputRef} onInput={onInput} type={"text"} style={{opacity: 0}}/>
        </div>
    )
}

namespace TextEditor {
    export interface Attributes {
        ref: React.RefObject<HTMLDivElement>
    }
}

export default TextEditor