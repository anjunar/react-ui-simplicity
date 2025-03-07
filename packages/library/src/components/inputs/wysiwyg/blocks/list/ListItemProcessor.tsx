import React, {useContext, useEffect, useRef, useState} from "react"
import {ItemNode} from "./ListNode";
import ProcessorFactory from "../../processors/ProcessorFactory";
import EditorContext from "../../EditorContext";
import {findNode, findNodeWithMaxDepth} from "../../core/TreeNodes";
import {ParagraphNode, TextNode} from "../../core/TreeNode";

function ListItemProcessor(properties: ItemProcessor.Attributes) {

    const {node} = properties

    const liRef = useRef(null);

    useEffect(() => {
        node.dom = liRef.current
    }, [node]);

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