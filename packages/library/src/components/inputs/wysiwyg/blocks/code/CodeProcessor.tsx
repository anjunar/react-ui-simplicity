import "./CodeProcessor.css"
import React, {useContext, useEffect, useMemo, useRef} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import Prism, {Token} from "prismjs"
import "prismjs/components/prism-typescript";
import {TokenNode} from "./TokenNode";
import TokenProcessor from "./TokenProcessor";

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const {ast: {root}, cursor, event: {currentEvent}} = useContext(EditorContext)

    const preRef = useRef<HTMLPreElement>(null);

    function toTokenNodes(tokens: (string | Token)[], startIndex = 0): TokenNode[] {
        let currentIndex = startIndex;
        return tokens.map(token => {
            if (typeof token === "string") {
                let node = new TokenNode(token, "text", currentIndex);
                currentIndex += token.length;
                return node;
            } else {
                let tokenStartIndex = currentIndex;

                if (Array.isArray(token.content)) {
                    let content = toTokenNodes(token.content, tokenStartIndex);
                    currentIndex = content.length > 0
                        ? content[content.length - 1].index + content[content.length - 1].text.length
                        : tokenStartIndex;
                    return new TokenNode(content, token.type, tokenStartIndex);
                } else {
                    currentIndex += (token.content as string).length;
                    return new TokenNode(token.content as string, token.type, tokenStartIndex);
                }
            }
        });
    }

    useEffect(() => {
        node.dom = preRef.current
    }, [node]);

    const tokenNodes = useMemo(() => {

        let tokens = Prism.tokenize(node.text, Prism.languages.typescript)

        let nodes = toTokenNodes(tokens);

        node.children.length = 0
        node.children.push(...nodes)

        return nodes
    }, [node.text]);

    return (
        <pre ref={preRef} style={{overflowX: "auto", overflowY: "hidden"}}>
            <code style={{display: "block", fontFamily: "monospace", width : "max-content"}}>
                {
                    tokenNodes.map(node => <TokenProcessor key={node.id} node={node}/>)
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