import React, {useContext, useEffect, useRef} from "react"
import EditorContext from "../ui/EditorContext";
import {HeadingNode} from "../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";

function HeadingProcessor(properties: HeadingProcessor.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor: {currentCursor, triggerCursor}, event} = useContext(EditorContext)

    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        node.dom = headingRef.current
    }, [node]);

    const Heading: React.ElementType = node.level as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    return (
        <Heading ref={headingRef}>
            {node.children.length === 0 ? <br/> : ""}
            {
                node.children.map(node => <ProcessorFactory key={node.id} node={node}/>)
            }
        </Heading>
    )

}

namespace HeadingProcessor {
    export interface Attributes {
        node: HeadingNode
    }
}

export default HeadingProcessor