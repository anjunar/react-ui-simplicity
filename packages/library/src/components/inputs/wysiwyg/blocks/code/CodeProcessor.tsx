import React, {useContext, useEffect, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import CodeLineProcessor from "./CodeLineProcessor";
import CodeHighlightProcessor from "./CodeHighlightProcessor";
import {EditorContext} from "../../contexts/EditorState";
import {findParent} from "../../core/TreeNodes";
import {DomContext} from "../../contexts/DomState";

let lastClientX = 0
let lastClientY = 0

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const {ast: {root}, cursor: {currentCursor, triggerCursor}, event: {currentEvent}} = useContext(EditorContext)

    const {contentEditableRef} = useContext(DomContext)

    const preRef = useRef<HTMLPreElement>(null);

    const [active, setActive] = useState(false)

    useEffect(() => {
        if (currentCursor) {
            if (findParent(currentCursor.container, elem => elem === node)) {
                setActive(true)

                if (currentCursor.container === node) {
                    setTimeout(() => {
                        currentCursor.container = node.children[0]
                        currentCursor.offset = 0
                        triggerCursor()

                        let mouseEvent = new MouseEvent("click", {
                            bubbles : true,
                            cancelable : true,
                            view : window,
                            clientX : lastClientX,
                            clientY : lastClientY}
                        );

                        contentEditableRef.current.dispatchEvent(mouseEvent)
                    }, 100)
                }

            } else {
                setActive(false)
            }
        }
    }, [currentCursor]);

    useEffect(() => {
        node.dom = preRef.current
    }, [node]);

    useEffect(() => {
        let listener = (event) => {
            lastClientX = event.clientX
            lastClientY = event.clientY
        };
        document.addEventListener("click", listener)

        return () => {
            return document.removeEventListener("click", listener)
        }
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