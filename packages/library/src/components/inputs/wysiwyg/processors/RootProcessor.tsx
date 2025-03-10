import React, {useContext, useEffect, useRef} from "react"
import {RootNode, TextNode} from "../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import ParagraphProcessor from "../blocks/paragraph/ParagraphProcessor";
import {onArrowLeft, onArrowRight} from "../utils/ProcessorUtils";
import {ParagraphNode} from "../blocks/paragraph/ParagraphNode";
import {EditorContext} from "../EditorState";

function RootProcessor(properties: RootNode.Attributes) {

    const {node} = properties

    const {ast : {root, triggerAST}, cursor : {currentCursor, triggerCursor}, event : {currentEvent}} = useContext(EditorContext)

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef} className={"root"}>
            {
                node.children.map(node => (<ProcessorFactory key={node.id} node={node}/>))
            }
        </div>
    )
}

namespace RootNode {
    export interface Attributes {
        node: RootNode
    }
}

export default RootProcessor