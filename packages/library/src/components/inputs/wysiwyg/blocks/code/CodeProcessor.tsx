import "./CodeProcessor.css"
import React, {useContext, useDeferredValue, useEffect, useMemo, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import Prism from "prismjs"
import "prismjs/components/prism-typescript";
import TokenLineProcessor from "./TokenLineProcessor";
import {groupTokensIntoLines, tokenDiff, toTokenNodes} from "./CodeUtils";

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor, event: {currentEvent}} = useContext(EditorContext)

    const [scrollTop, setScrollTop] = useState(0)

    let scrollTopDeferred = useDeferredValue(scrollTop);

    const preRef = useRef<HTMLPreElement>(null);

    const visibleBlocks = useMemo(() => {
        if (!preRef.current) return [];

        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) < (preRef.current.clientHeight + 48) && (height + child.domHeight * 2) >= scrollTop
            height += child.domHeight;
            return isVisible;
        });
    }, [node.children.length, scrollTopDeferred, preRef.current]);

    function onWheel(event : React.WheelEvent<HTMLPreElement>) {
        event.stopPropagation()
        setScrollTop((prev) => {
            let minimum = prev + event.deltaY
            minimum = Math.max(0, minimum);
            let maximum = node.children.reduce((sum, child) => sum + child.domHeight, 0) - (preRef.current.clientHeight + 48)
            return Math.min(minimum, maximum);
        });
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

    return (
        <pre ref={preRef} style={{overflowY: "auto", overflowX: "scroll", maxHeight: "412px", scrollbarWidth : "none"}} onWheel={onWheel} className={`language-${"typescript"}`}>
            <code style={{display: "block", fontFamily: "monospace", width: "max-content"}} className={`language-${"typescript"}`}>
                <div style={{height : scrollTop}}></div>
                {
                    visibleBlocks.map(node => <TokenLineProcessor key={node.id} node={node}/>)
                }
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