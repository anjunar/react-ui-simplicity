import "./CodeProcessor.css"
import React, {useContext, useEffect, useMemo, useRef} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import Prism from "prismjs"
import "prismjs/components/prism-typescript";
import {TokenNode} from "./TokenNode";
import TokenLineProcessor from "./TokenLineProcessor";
import {groupTokensIntoLines, tokenDiff, toTokenNodes} from "./CodeUtils";

function CodeProcessor(properties: CodeProcessor.Attributes) {

    const {node} = properties

    const {ast: {root}, cursor, event: {currentEvent}} = useContext(EditorContext)

    const preRef = useRef<HTMLPreElement>(null);

    const tokenNodes = useMemo(() => {

        let tokens = Prism.tokenize(node.text, Prism.languages.typescript)

        let nodes = toTokenNodes(tokens);

        let tokenNode = cursor.currentCursor.container as TokenNode;

        let oldOffset = tokenNode.index + cursor.currentCursor.offset

        let tokenLineNodes = groupTokensIntoLines(nodes);

        let tokenDiffer = tokenDiff(node.children, tokenLineNodes);

        node.children.length = 0
        node.children.push(...tokenDiffer)

        if (tokenNode instanceof TokenNode) {

            function findTokenNodeByIndex(tokens: TokenNode[], targetIndex: number): TokenNode | null {
                for (let token of tokens) {
                    if (typeof token.text === "string") {
                        if (token.index <= targetIndex && targetIndex <= token.index + token.text.length) {
                            return token;
                        }
                    } else {
                        let found = findTokenNodeByIndex(token.text, targetIndex);
                        if (found) return found;
                    }
                }
                return null;
            }

            let newTokenNode = findTokenNodeByIndex(root.flatten.filter(node => node instanceof TokenNode), oldOffset) as TokenNode;
            cursor.currentCursor.container = newTokenNode
            cursor.currentCursor.offset = oldOffset - newTokenNode.index

        }

        return tokenDiffer
    }, []);

    useEffect(() => {
        node.dom = preRef.current
    }, [node]);

    return (
        <pre ref={preRef} style={{overflowX: "auto", overflowY: "hidden"}}>
            <code style={{display: "block", fontFamily: "monospace", width: "max-content"}}>
                {
                    node.children.map(node => <TokenLineProcessor key={node.id} node={node}/>)
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