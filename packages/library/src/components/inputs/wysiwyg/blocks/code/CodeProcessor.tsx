import "./CodeProcessor.css"
import React, {useContext, useEffect, useMemo, useRef} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";
import Prism, {Token} from "prismjs"
import "prismjs/components/prism-typescript";
import {TokenNode} from "./TokenNode";
import TokenProcessor from "./TokenProcessor";
import {TokenLineNode} from "./TokenLineNode";
import TokenLineProcessor from "./TokenLineProcessor";

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

    function groupTokensIntoLines(tokens: TokenNode[]): TokenLineNode[] {
        const lines: TokenLineNode[] = [new TokenLineNode([])];
        let currentLine = 0;

        tokens.forEach((token) => {
            if (typeof token.text === "string" && token.text.includes("\n")) {
                const parts = token.text.split("\n");
                parts.forEach((part, index) => {
                    if (index > 0) {
                        lines.push(new TokenLineNode([new TokenNode("", "text", token.index)]));
                        currentLine++;
                    }
                    if (part) {
                        lines[currentLine].children.push(
                            new TokenNode(part, token.type, token.index)
                        );
                    }
                });
            } else {
                lines[currentLine].children.push(token);
            }
        });

        return lines;
    }

    function tokenDiff(
        oldLines: TokenLineNode[],
        newLines: TokenLineNode[]
    ): TokenLineNode[] {
        const result: TokenLineNode[] = [];

        newLines.forEach((newLine, lineIndex) => {
            const oldLine = oldLines[lineIndex];

            if (oldLine && compareTokenLines(oldLine.children, newLine.children)) {
                result.push(oldLine);
            } else {
                const updatedLine = new TokenLineNode(
                    newLine.children.map((newToken, tokenIndex) => {
                        const oldToken = oldLine?.children[tokenIndex];
                        if (
                            oldToken &&
                            oldToken.text === newToken.text &&
                            oldToken.type === newToken.type
                        ) {
                            return oldToken;
                        } else {
                            return newToken;
                        }
                    })
                );
                result.push(updatedLine);
            }
        });

        return result;
    }

    function compareTokenLines(oldTokens: TokenNode[], newTokens: TokenNode[]): boolean {
        if (oldTokens.length !== newTokens.length) {
            return false;
        }

        for (let i = 0; i < oldTokens.length; i++) {
            if (oldTokens[i].text !== newTokens[i].text || oldTokens[i].type !== newTokens[i].type) {
                return false;
            }
        }

        return true;
    }

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
    }, [node.text]);

    useEffect(() => {
        node.dom = preRef.current
    }, [node]);

    return (
        <pre ref={preRef} style={{overflowX: "auto", overflowY: "hidden"}}>
            <code style={{display: "block", fontFamily: "monospace", width : "max-content"}}>
                {
                    tokenNodes.map(node => <TokenLineProcessor key={node.id} node={node}/>)
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