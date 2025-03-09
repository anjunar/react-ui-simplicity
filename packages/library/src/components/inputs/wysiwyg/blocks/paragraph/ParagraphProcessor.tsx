import React, {useContext, useEffect, useRef} from "react"
import ProcessorFactory from "../../processors/ProcessorFactory";
import {ParagraphNode} from "./ParagraphNode";
import {EditorContext} from "../../EditorState";

function ParagraphProcessor(properties: ParagraphProcessor.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, event} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <p ref={divRef} className={node.justify ? node.justify : null}>
            {node.children.length === 0 ? <br/> : ""}
            {
                node.children.map(node => <ProcessorFactory key={node.id} node={node}/>)
            }
        </p>
    )
}

namespace ParagraphProcessor {
    export interface Attributes {
        node: ParagraphNode
    }
}

export default ParagraphProcessor