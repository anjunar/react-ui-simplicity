import React, {useContext, useEffect, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import CodeLineProcessor from "./CodeLineProcessor";
import CodeHighlightProcessor from "./CodeHighlightProcessor";
import {EditorContext} from "../../contexts/EditorState";
import {findParent} from "../../core/TreeNodes";
import {DomContext} from "../../contexts/DomState";
import {CodeLineNode} from "./CodeLineNode";

let lastClientX = 0
let lastClientY = 0

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const {ast: {root}, cursor, event: {currentEvent}} = useContext(EditorContext)

    const {contentEditableRef, inputRef} = useContext(DomContext)

    const preRef = useRef<HTMLPreElement>(null);

    const [active, setActive] = useState(false)

    useEffect(() => {
        let currentCursor = cursor.currentCursor
        if (currentCursor) {
            if (findParent(currentCursor.container, elem => elem === node)) {
                setActive(true)

                if (currentCursor.container === node) {
                    setTimeout(() => {
                        currentCursor.container = node.children[0]
                        currentCursor.offset = 0
                        cursor.triggerCursor()

                        if (lastClientY > 0 && lastClientX > 0) {
                            let mouseEvent = new MouseEvent("click", {
                                bubbles : true,
                                cancelable : true,
                                view : window,
                                clientX : lastClientX,
                                clientY : lastClientY}
                            );

                            contentEditableRef.current.dispatchEvent(mouseEvent)
                        }
                    }, 100)
                }

            } else {
                setActive(false)
            }
        }
    }, [cursor]);

    useEffect(() => {
        node.dom = preRef.current
    }, [node]);

    useEffect(() => {
        let listener = (event) => {
            lastClientX = event.clientX
            lastClientY = event.clientY

            setTimeout(() => {
                lastClientY = -1
                lastClientX = -1
            }, 200)
        };
        document.addEventListener("click", listener)

        return () => {
            return document.removeEventListener("click", listener)
        }
    }, []);

    useEffect(() => {
        function handlePaste(event: ClipboardEvent) {
            event.preventDefault();

            const pastedText = event.clipboardData.getData("text");

            let codeLine = cursor.currentCursor.container as CodeLineNode

            let start = codeLine.text.substring(0, cursor.currentCursor.offset)
            let end = codeLine.text.substring(cursor.currentCursor.offset)

            let parent = codeLine.parent;
            let parentIndex = codeLine.parentIndex;

            codeLine.text = start

            for (const line of pastedText.split("\n").reverse()) {
                let newCodeLine = new CodeLineNode(line.replace(/^\s+$/, ""))
                parent.insertChild(parentIndex + 1, newCodeLine)
            }

            let endLineNode = new CodeLineNode(end);
            parent.insertChild(parentIndex + 1, endLineNode)
        }

        inputRef.current.addEventListener("paste", handlePaste);
        return () => {
            inputRef.current.removeEventListener("paste", handlePaste);
        };
    }, []);

    return (
        <pre ref={preRef} style={{overflowX: "auto", overflowY: "hidden"}}>
            <code style={{display: "block", fontFamily: "monospace"}}>
                {
                    active ? (
                        node.children.map(node => <CodeLineProcessor key={node.id} node={node}/>)
                    ) : (
                        <CodeHighlightProcessor key={node.id} node={node}/>
                    )
                }
            </code>
        </pre>
    )
}

namespace CodeProcessor {
    export interface Attributes {
        node: CodeNode
    }
}

export default CodeProcessor