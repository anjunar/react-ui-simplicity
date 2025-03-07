import React, {useContext, useEffect, useRef, useState} from "react"
import {TableCellNode, TableNode, TableRowNode} from "./TableNode";
import TableRowProcessor from "./TableRowProcessor";
import {findNode, findNodeWithMaxDepth, findParent} from "../../core/TreeNodes";
import EditorContext from "../../EditorContext";
import {ParagraphNode, TextNode} from "../../core/TreeNode";

function TableProcessor(properties: TableProcessor.Attributes) {

    const {node} = properties

    const [open, setOpen] = useState(false)

    const tableRef = useRef(null);

    useEffect(() => {
        node.dom = tableRef.current
    }, [node]);

    return (
        <div style={{position : "relative"}}>
            <table className={"table"} ref={tableRef}>
                <tbody>
                {
                    node.children.map(node => <TableRowProcessor key={node.id} node={node}/>)
                }
                </tbody>
            </table>
            {
                open && (
                    <div style={{position : "absolute", bottom : "-48px", left: "50%", transform : "translateX(-50%)", boxShadow : "3px 3px 10px 3px #1a1a1a"}}>
                    </div>
                )
            }
        </div>
    )
}

namespace TableProcessor {
    export interface Attributes {
        node : TableNode
    }
}

export default TableProcessor