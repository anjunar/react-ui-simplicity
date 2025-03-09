import React, {useContext, useEffect, useRef} from "react"
import {TableNode} from "./TableNode";
import TableRowProcessor from "./TableRowProcessor";
import {TextNode} from "../../core/TreeNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import {EditorContext} from "../../EditorState";

function TableProcessor(properties: TableProcessor.Attributes) {

    const {node} = properties

    let {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, event : {currentEvent}} = useContext(EditorContext);

    const tableRef = useRef(null);

    useEffect(() => {
        node.dom = tableRef.current
    }, [node]);

    useEffect(() => {

        if (currentEvent.instance && node === currentCursor?.container && !currentEvent.handled) {

            switch (currentEvent.instance.type) {
                case "insertLineBreak" : {
                    let index = node.parentIndex;
                    let parent = node.parent;
                    let textNode = new TextNode();

                    currentCursor.container = textNode
                    currentCursor.offset = 0

                    parent.insertChild(index + 1, new ParagraphNode([textNode]));

                    currentEvent.handled = true

                }
                    break
                case "deleteContentBackward" : {

                    let flattened = root.flatten;
                    let index = flattened.indexOf(node);
                    let slice = flattened.slice(0, index);
                    let textNode = slice.findLast(node => node instanceof TextNode);

                    currentCursor.container = textNode
                    currentCursor.offset = textNode.text.length;

                    node.remove()

                    currentEvent.handled = true

                }
                    break
            }

            triggerCursor()
            triggerAST()
        }

    }, [currentEvent.instance]);


    return (
        <table className={"table"} ref={tableRef}>
            <tbody>
            {
                node.children.map(node => <TableRowProcessor key={node.id} node={node}/>)
            }
            </tbody>
        </table>
    )
}

namespace TableProcessor {
    export interface Attributes {
        node: TableNode
    }
}

export default TableProcessor