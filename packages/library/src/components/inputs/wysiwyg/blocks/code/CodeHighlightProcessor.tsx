import React, {useEffect, useMemo, useRef} from "react"
import highlight from "highlight.js";
import {CodeLineNode} from "./CodeLineNode";
import {CodeNode} from "./CodeNode";

function CodeHighlightProcessor(properties: CodeHighlightProcessor.Attributes) {

    const {node} = properties

    const divRef = useRef<HTMLDivElement>(null);

/*
    useEffect(() => {
        node.dom = divRef.current
    }, [node]);
*/

    const __html = useMemo(() => {
        return highlight.highlight(node.children.map(node => node.text).join("\n"), {language: "typescript"}).value || "</br>"
    }, [node.children]);

    return (
        <div style={{width : "max-content"}} dangerouslySetInnerHTML={{__html : __html}}></div>
    )
}

namespace CodeHighlightProcessor {
    export interface Attributes {
        node : CodeNode
    }
}

export default CodeHighlightProcessor
