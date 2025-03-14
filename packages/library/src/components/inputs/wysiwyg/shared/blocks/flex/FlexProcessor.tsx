import React, {useEffect, useRef} from "react"
import {FlexNode} from "./FlexNode";
import BoxProcessor from "./BoxProcessor";

function FlexProcessor(properties: FlexProcessor.Attributes) {

    const {node} = properties

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef} style={{display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: node.justifyContent, alignItems : node.alignItems}}>
            {
                node.children.map(node => <BoxProcessor key={node.id} node={node}/>)
            }
        </div>
    )
}

namespace FlexProcessor {
    export interface Attributes {
        node: FlexNode
    }
}

export default FlexProcessor