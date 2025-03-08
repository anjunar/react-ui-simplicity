import React, {useEffect, useRef} from "react"
import {ItemNode} from "./ListNode";
import ProcessorFactory from "../../processors/ProcessorFactory";

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