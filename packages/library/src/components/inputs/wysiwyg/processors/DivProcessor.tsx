import React, {useContext, useEffect, useRef} from "react"
import {ParagraphNode, TextNode} from "../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import EditorContext from "../EditorContext";
import cursor from "../ui/Cursor";
import {onArrowLeft, onArrowRight} from "../utils/ProcessorUtils";

function DivProcessor(properties: DivNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {currentCursor, triggerCursor}, event} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef} className={node.justify ? node.justify : null}>
            {node.children.length === 0 ? <br/> : ""}
            {
                node.children.map(node => <ProcessorFactory key={node.id} node={node}/>)
            }
        </div>
    )
}

namespace DivNode {
    export interface Attributes {
        node : ParagraphNode
    }
}

export default DivProcessor