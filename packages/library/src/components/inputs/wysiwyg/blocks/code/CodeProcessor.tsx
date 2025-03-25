import "./CodeProcessor.css"
import React, {useContext, useEffect, useMemo, useRef} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import Prism from "prismjs"
import "prismjs/components/prism-typescript";
import TokenLineProcessor from "./TokenLineProcessor";
import {groupTokensIntoLines, tokenDiff, toTokenNodes} from "./CodeUtils";
import {useWheel} from "../../../../../hooks/UseWheelHook";

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const {ast: {root, triggerAST}, cursor, event: {currentEvent}} = useContext(EditorContext)

    const preRef = useRef<HTMLPreElement>(null);

    let scrollTop = useWheel(() => {
        return {
            stopPropagating : true,
            preventDefault : true,
            ref : preRef,
            maximum : node.children.reduce((sum, child) => sum + child.domHeight, 0) - (preRef.current.clientHeight)
        }
    }, [preRef.current, node.children.length]);

    const visibleBlocks = useMemo(() => {
        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) < (node.domHeight - 48) && (height + child.domHeight) >= scrollTop
            height += child.domHeight;
            return isVisible;
        });
    }, [node.children.length, node.text, scrollTop]);

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
        <pre ref={preRef} style={{overflowY: "auto", overflowX: "scroll", height: node.domHeight, scrollbarWidth : "none"}} className={`language-${"typescript"}`}>
            <code style={{display: "block", fontFamily: "monospace", width: "max-content"}} className={`language-${"typescript"}`}>
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