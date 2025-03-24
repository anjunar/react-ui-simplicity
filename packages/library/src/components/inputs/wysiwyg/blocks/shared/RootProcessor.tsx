import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {RootNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import {DomContext} from "../../contexts/DomState";

function RootProcessor({node}: RootNode.Attributes) {
    const [scrollTop, setScrollTop] = useState(0)

    const divRef = useRef<HTMLDivElement>(null);
    const scrollDelta = useRef(0);
    const {editorRef, contentEditableRef} = useContext(DomContext);

    const visibleBlocks = useMemo(() => {
        if (!editorRef.current) return [];

        let height = 0;
        return node.children.filter(child => {
            const isVisible = (height - scrollTop) < editorRef.current.clientHeight && (height + child.domHeight) >= scrollTop
            height += child.domHeight;
            return isVisible;
        });
    }, [node.children.length, scrollTop, editorRef.current]);

    useEffect(() => {
        node.dom = divRef.current;
    }, [node]);

    useEffect(() => {
        let debounceTimeout: NodeJS.Timeout | null = null;

        const handleScroll = (event: WheelEvent) => {
            // event.preventDefault();
            scrollDelta.current += event.deltaY; // Delta aufsummieren

            if (debounceTimeout) clearTimeout(debounceTimeout);

            debounceTimeout = setTimeout(() => {
                setScrollTop(prev => {
                    const maxScroll = node.domHeight - contentEditableRef.current.offsetHeight
                    const newScrollTop = Math.max(0, Math.min(prev + scrollDelta.current, maxScroll));
                    scrollDelta.current = 0; // Reset nach Anwendung
                    return newScrollTop;
                });
            }, 50); // Debounce-Zeit (anpassbar)
        };

        contentEditableRef.current.addEventListener("wheel", handleScroll);
        return () => contentEditableRef.current.removeEventListener("wheel", handleScroll);
    }, [contentEditableRef.current, scrollTop]);

    return (
        <div ref={divRef} className="root">
            <div style={{height : scrollTop}}></div>
            {visibleBlocks.map(childNode => (
                <ProcessorFactory key={childNode.id} node={childNode}/>
            ))}
        </div>
    );
}

namespace RootNode {
    export interface Attributes {
        node: RootNode;
    }
}

export default RootProcessor;
