import React, {useLayoutEffect, useRef} from "react";
import {TreeNode} from "../TreeNode";
import TrNode from "./TrNode";

function TableNode(properties : TableNode.Attributes) {

    const {ast, astChange} = properties

    const table = useRef<HTMLTableElement>(null);

    useLayoutEffect(() => {
        ast.dom = table.current
    }, [ast]);


    return (
        <table ref={table} style={{width : "100%", tableLayout : "fixed"}}>
            <thead>
            {
                ast.find((node) => node.type === "thead")
                    ?.children
                    .map(child => (
                        <TrNode key={child.id} ast={child} astChange={astChange}/>
                    ))
            }
            </thead>
            <tbody>
            {
                ast.find((node) => node.type === "tbody")
                    .children
                    .map(child => (
                        <TrNode key={child.id} ast={child} astChange={astChange}/>
                    ))
            }
            </tbody>
        </table>
    )

}

namespace TableNode {
    export interface Attributes {
        ast : TreeNode
        astChange : () => void
    }
}

export default TableNode