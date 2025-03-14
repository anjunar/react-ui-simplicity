import React, {useContext, useEffect, useRef} from "react"
import {TableNode} from "./TableNode";
import TableRowProcessor from "./TableRowProcessor";
import {TextNode} from "../../core/TreeNode";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import {EditorContext} from "../../../EditorState";

function TableProcessor(properties: TableProcessor.Attributes) {

    const {node} = properties

    let {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, event : {currentEvent}} = useContext(EditorContext);

    const tableRef = useRef(null);

    useEffect(() => {
        node.dom = tableRef.current
    }, [node]);

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