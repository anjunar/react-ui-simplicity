import React, {useLayoutEffect, useState} from "react";
import CSSNode from "./nodes/CSSNode";
import AttributeNode from "./nodes/AttributeNode";
import InsertNode from "./nodes/InsertNode";
import {TreeNode} from "../TreeNode";

function Inspector(properties: Inspector.Attributes) {

    const {contentRef, ast, astChange} = properties

    const [path, setPath] = useState<EventTarget[]>([])

    const [activeNode, setActiveNode] = useState<HTMLElement>(null)

    const [prevNode, setPrevNode] = useState<HTMLElement>(null)

    const [action, setAction] = useState("insert")

    useLayoutEffect(() => {
        if (prevNode) {
            prevNode.className = prevNode.className.replace("editor-selected", "")
            if (prevNode.className === "") {
                prevNode.removeAttribute("class")
            }
        }
        if (activeNode) {
            activeNode.className = "editor-selected"
        }
        setPrevNode(activeNode)
    }, [activeNode]);

    useLayoutEffect(() => {
        let clickListener = (event: Event) => {
            let composedPath = event.composedPath();
            let indexOf = composedPath.indexOf(contentRef.current);
            let eventTargets = composedPath.slice(0, indexOf + 1);
            if (eventTargets[0] === contentRef.current) {
                setPath([])
                setActiveNode(null)
            } else {
                setPath(eventTargets.slice(0, eventTargets.length - 1))
                setActiveNode(composedPath[0] as HTMLElement)
            }
        };

        contentRef.current.addEventListener("click", clickListener)

        let actionListener = (event : Event) => {
            let customEvent = event as CustomEvent
            setAction(customEvent.detail.command)
        };

        contentRef.current.addEventListener("action", actionListener)

        return () => {
            if (contentRef.current) {
                contentRef.current.removeEventListener("click", clickListener)
                contentRef.current.removeEventListener("action", actionListener)

                let iterator = document.createNodeIterator(contentRef.current, NodeFilter.SHOW_ELEMENT);
                let cursor = iterator.nextNode();
                while (cursor !== null) {
                    (cursor as HTMLElement).style.border = null
                    cursor = iterator.nextNode()
                }
            }
        }
    }, []);

    function inspectorAction() {
        switch (action) {
            case "default" : return <CSSNode payload={activeNode}/>
            case "attributes" : return <AttributeNode payload={activeNode}/>
            case "insert" : return <InsertNode payload={activeNode} ast={ast.find((node) => node.dom === activeNode)} astChange={astChange}/>
        }
    }

    return (
        <div style={{display: "flex", padding : "12px"}}>
            <div style={{width: "50px"}}>
                {
                    path.map((node: any, index) => (
                        <p key={index} onClick={() => {setActiveNode(node)}}
                           style={{color: node === activeNode ? "var(--color-selected)" : "var(--color-text)"}}>{node.localName}
                        </p>
                        )
                    )
                }
            </div>
            <div style={{flex : 1}}>
                { activeNode && inspectorAction() }
            </div>

        </div>
    )
}

namespace Inspector {
    export interface Attributes {
        contentRef: React.RefObject<HTMLDivElement>
        ast : TreeNode
        astChange : () => void
    }
}

export default Inspector