import React, {useEffect, useMemo, useRef} from "react"
import highlight from 'highlight.js';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import {CodeNode} from "./CodeNode";

highlight.registerLanguage('typescript', typescript);
highlight.registerLanguage('xml', xml);

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const preRef = useRef<HTMLPreElement>(null);

    const __html = useMemo(() => {
        return highlight.highlight(node.source, {language: "typescript"}).value || "</br>"
    }, [node.source]);

    useEffect(() => {
        node.dom = preRef.current
    }, [node]);

    return (
        <pre ref={preRef} style={{overflowX: "auto", overflowY: "hidden"}}>
            <code dangerouslySetInnerHTML={{__html: __html}} style={{display: "block", fontFamily : "monospace"}}></code>
        </pre>
    )
}

namespace CodeProcessor {
    export interface Attributes {
        node: CodeNode
    }
}

export default CodeProcessor