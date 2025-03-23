import "./CodeProcessor.css"
import React, {useContext, useEffect, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import Prism from "prismjs"
import "prismjs/components/prism-typescript";
import TokenLineProcessor from "./TokenLineProcessor";
import {groupTokensIntoLines, tokenDiff, toTokenNodes} from "./CodeUtils";
import {TokenLineNode} from "./TokenLineNode";

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor, event: {currentEvent}} = useContext(EditorContext)

    const [scrollTop, setScrollTop] = useState(0)

    const preRef = useRef<HTMLPreElement>(null);

    function onScroll(event : React.UIEvent<HTMLPreElement>) {
        let preElement = event.target as HTMLPreElement

        let newScrollTop = preElement.scrollTop

        let threshold = newScrollTop - scrollTop

        if (threshold > 19 || threshold < -19) {
            setScrollTop(newScrollTop)
        }
    }

    useEffect(() => {

        let tokens = Prism.tokenize(node.text, Prism.languages.typescript)

        let nodes = toTokenNodes(tokens);

        let tokenLineNodes = groupTokensIntoLines(nodes);

        let tokenDiffer = tokenDiff(node.children, tokenLineNodes);

        node.children.length = 0
        node.children.push(...tokenDiffer)

        triggerAST()
    }, []);

    useEffect(() => {
        node.dom = preRef.current
    }, [node]);

    let start = Math.round(scrollTop / TokenLineNode.Height);
    let end = start + CodeNode.MaximumLines

    let lineNodes = node.children.slice(start, end)

    return (
        <pre ref={preRef} style={{overflow: "auto", maxHeight: "412px"}} onScroll={onScroll} className={`language-${"typescript"}`}>
            <code style={{display: "block", fontFamily: "monospace", width: "max-content"}} className={`language-${"typescript"}`}>
                <div style={{height : Math.round(scrollTop / TokenLineNode.Height) * TokenLineNode.Height}}></div>
                {
                    lineNodes.map(node => <TokenLineProcessor key={node.id} node={node}/>)
                }
                <div style={{height : node.children.length * TokenLineNode.Height - end * TokenLineNode.Height}}></div>
            </code>
        </pre>
    )
}

namespace CodeProcessor {
    export interface Attributes {
        node: CodeNode
    }
}

export default CodeProcessor