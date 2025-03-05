import React, {useContext, useEffect, useRef, useState} from "react"
import {ItemNode} from "./ListNode";
import ProcessorFactory from "../../processors/ProcessorFactory";
import EditorContext from "../../EditorContext";
import {findNode, findNodeWithMaxDepth} from "../../core/TreeNodes";
import {ParagraphNode, TextNode} from "../../core/TreeNode";

function ItemProcessor(properties: ItemProcessor.Attributes) {

    const {node} = properties

    const liRef = useRef(null);

    const [open, setOpen] = useState(false)

    let {ast: {triggerAST}, cursor: {currentCursor, triggerCursor}} = useContext(EditorContext);

    function addClick(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()

        let parent = node.parent;
        let parentIndex = node.parentIndex;

        let textNode = new TextNode();

        let firstChild = (node.children[0] as ParagraphNode).children[0] as TextNode
        if (firstChild.text === "") {
            let grandParent = parent.parent;
            let grandParentIndex = parent.parentIndex;
            node.remove()
            grandParent.insertChild(grandParentIndex + 1, new ParagraphNode([textNode]));
        } else {
            parent.insertChild(parentIndex + 1, new ItemNode([new ParagraphNode([textNode])]));
        }

        currentCursor.container = textNode
        currentCursor.offset = 0

        triggerCursor()
        triggerAST()
    }

    function closeClick(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()
        setOpen(false)
    }

    function deleteClick(event : React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.stopPropagation()

        let parent = node.parent;

        node.remove()

        if (parent.children.length === 0) {
            parent.remove()
        }

        triggerAST()
    }

    useEffect(() => {
        node.dom = liRef.current
    }, [node]);

    useEffect(() => {
        let cursor = findNodeWithMaxDepth(node, (node) => node === currentCursor.container, 2);

        if (cursor) {
            setOpen(true)
        } else {
            setOpen(false)
        }
    }, [currentCursor?.container]);


    return (
        <li ref={liRef} style={{position: "relative"}}>
            {
                open && (
                    <div style={{position: "absolute", right: 0, backgroundColor : "var(--color-background-primary)", boxShadow : "3px 3px 10px 3px #1a1a1a"}}>
                        <button className={"material-icons"} onClick={addClick}>add</button>
                        <button className={"material-icons"} onClick={deleteClick}>delete</button>
                        <button className={"material-icons"} onClick={closeClick}>close</button>
                    </div>
                )
            }
            {node.children.map(child => <ProcessorFactory key={child.id} node={child}/>)}
        </li>
    )
}

namespace ItemProcessor {
    export interface Attributes {
        node: ItemNode
    }
}

export default ItemProcessor