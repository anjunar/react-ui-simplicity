import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {RootNode} from "../../core/TreeNode";
import ProcessorFactory from "./ProcessorFactory";
import {DomContext} from "../../contexts/DomState";

function RootProcessor({ node }: RootNode.Attributes) {
    const [scrollTop, setScrollTop] = useState(0)

    const divRef = useRef<HTMLDivElement>(null);
    const pufferRef = useRef<HTMLDivElement>(null);
    const { editorRef, contentEditableRef, inputRef, cursorRef } = useContext(DomContext);

    const visibleBlocks = useMemo(() => {
        if (!editorRef.current) return [];

        let height = 0;
        return node.children.filter(child => {
            const isVisible = height - scrollTop < editorRef.current.clientHeight && height >= scrollTop
            height += child.domHeight;
            return isVisible;
        });
    }, [node.children.length, scrollTop, editorRef.current]);

    useEffect(() => {
        node.dom = divRef.current;
    }, [node]);

    useEffect(() => {
        const contentEditable = contentEditableRef.current;
        if (!contentEditable) return;

        const handleScroll = (event: Event) => {

            const target = event.target as HTMLDivElement;
            const currentScrollTop = target.scrollTop

            if ((currentScrollTop - scrollTop) > 20 || (currentScrollTop - scrollTop) < - 20) {
                setScrollTop(currentScrollTop)
            }

        };

        contentEditable.addEventListener("scroll", handleScroll);
        return () => contentEditable.removeEventListener("scroll", handleScroll);
    }, [contentEditableRef.current, scrollTop]);

    return (
        <div ref={divRef} className="root">
            <div style={{height : scrollTop}}></div>
            {visibleBlocks.map(childNode => (
                <ProcessorFactory key={childNode.id} node={childNode} />
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
