import React, {useContext, useEffect, useRef} from "react"
import {ItemNode} from "./ListNode";
import ProcessorFactory from "../../processors/ProcessorFactory";
import {EditorContext} from "../../EditorState";
import {findParent} from "../../core/TreeNodes";
import {TextNode} from "../../core/TreeNode";
import List from "../../../../lists/list/List";
import Item = List.Item;
import {ParagraphNode} from "../paragraph/ParagraphNode";

function ListItemProcessor(properties: ItemProcessor.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor}, event : {currentEvent}} = useContext(EditorContext)

    const liRef = useRef(null);

    useEffect(() => {
        node.dom = liRef.current
    }, [node]);

    useEffect(() => {

        let findParent1 = findParent(currentCursor?.container, item => node === item);

        if (currentEvent.instance && node === findParent1 && !currentEvent.handled) {

            if (currentCursor.container instanceof TextNode) {
                if (currentCursor.offset === currentCursor.container.text.length) {

                    if (currentEvent.instance.type === "insertLineBreak") {

                        let parent = node.parent;
                        let parentIndex = node.parentIndex;

                        let textNode = new TextNode("");

                        parent.insertChild(parentIndex + 1, new ItemNode([new ParagraphNode([textNode])]))

                        currentCursor.container = textNode
                        currentCursor.offset = 0

                        currentEvent.handled = true

                        triggerAST()

                    }

                }
            }

        }

    }, [currentEvent]);



    return (
        <li ref={liRef} style={{position: "relative"}}>
            {node.children.map(child => <ProcessorFactory key={child.id} node={child}/>)}
        </li>
    )
}

namespace ItemProcessor {
    export interface Attributes {
        node: ItemNode
    }
}

export default ListItemProcessor