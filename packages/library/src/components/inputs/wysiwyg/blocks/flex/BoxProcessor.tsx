import React, {useEffect, useRef} from "react"
import {BoxNode} from "./FlexNode";
import ProcessorFactory from "../../processors/ProcessorFactory";

function BoxProcessor(properties: BoxProcessor.Attributes) {

    const {node} = properties

    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        node.dom = divRef.current
    }, [node]);

    return (
        <div ref={divRef}>
            {
                node.children.map(node => <ProcessorFactory key={node.id} node={node}/>)
            }
        </div>
    )
}

namespace BoxProcessor {
    export interface Attributes {
        node : BoxNode
    }
}

export default BoxProcessor