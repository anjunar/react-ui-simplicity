import "./CodeProcessor.css"
import React, {useContext, useEffect, useMemo, useRef, useState} from "react"
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

    const preRef = useRef<HTMLPreElement>(null);

    const visibleBlocks = useMemo(() => {
        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) < (node.domHeight - 48) && (height + child.domHeight) >= scrollTop
            height += child.domHeight;
            return isVisible;
        });
    }, [node.children.length, node.text, scrollTop]);

    useEffect(() => {

        let pre = preRef.current

        let lastY = 0;

        const handleTouchStart = (event: TouchEvent) => {
            lastY = event.touches[0].clientY;
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault();
            event.stopPropagation()
            const deltaY = lastY - event.touches[0].clientY;
            lastY = event.touches[0].clientY;

            setScrollTop(prev => {
                const maxScroll = node.children.reduce((sum, child) => sum + child.domHeight, 0)
                return Math.max(0, Math.min(prev + deltaY, maxScroll));
            });
        };

        pre.addEventListener("touchstart", handleTouchStart);
        pre.addEventListener("touchmove", handleTouchMove);

        function onWheel(event : WheelEvent) {
            event.preventDefault()
            event.stopPropagation()
            setScrollTop((prev) => {
                let minimum = prev + event.deltaY * 0.5
                minimum = Math.max(0, minimum);
                let maximum = node.children.reduce((sum, child) => sum + child.domHeight, 0)
                return Math.min(minimum, maximum);
            });
        }

        pre.addEventListener("wheel", onWheel)

        return () => {
            pre.removeEventListener("wheel", onWheel)
            pre.removeEventListener("touchstart", handleTouchStart);
            pre.removeEventListener("touchmove", handleTouchMove);
        }
    }, []);

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