import React, {useContext, useEffect, useRef} from "react"
import {RootNode, TextNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import ParagraphProcessor from "../paragraph/ParagraphProcessor";
import {onArrowLeft, onArrowRight} from "../../../wysiwyg/utils/ProcessorUtils";
import {ParagraphNode} from "../paragraph/ParagraphNode";
import {WysiwygContext} from "../../contexts/WysiwygState";
import {EditorContext} from "../../contexts/EditorState";

function RootProcessor(properties: RootNode.Attributes) {

    const {node} = properties

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